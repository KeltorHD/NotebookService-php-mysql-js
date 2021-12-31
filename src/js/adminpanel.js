var mas;
var current_quantum = 1;
var sortOrder = 1;
var currentSorted = -1;
var user_id = -1;
var user_name = '';
var length_quantum = 10;
var current_quantum = 1;

function load_stat(){
    $.ajax({
        url: 'all_stat.php',
        type: 'get',
        dataType: 'json',
        complete: function(data){
            jsonObj = JSON.parse(data.responseText);

            $(".content_container").html(
                '<h2>Зарегистрированных пользователей: ' + jsonObj.users + '</h2>'+
                '<h2>Написано заметок: ' + jsonObj.notes + '</h2>'+
                '<h2>Общее число символов: ' + jsonObj.chars + '</h2>'+
                '<h2>Удаленных заметок: ' + jsonObj.del_notes + '</h2>'+
                '<h2>Число тэгов: ' + jsonObj.tag + '</h2>'+
                '<h2>Загружено картинок: ' + jsonObj.pics + '</h2>'
            )
        },
        error: function(xhr, status, ethrow){
            alert('Error: ' + status + ' | ' + ethrow);
        }
    })
}

function fill(){
    for(let i = current_quantum * length_quantum; i < mas.length && i < current_quantum * length_quantum + length_quantum; i++){
        if (user_id == -1){
            $('tbody').append(
                '<tr><td>' + mas[i][0] + 
                '</td><td class="open_user" data-id="' + mas[i][0] + '">' + mas[i][1] + 
                '</td><td>' + mas[i][2] + 
                '</td><td>' + mas[i][3] + 
                '</td><td>' + mas[i][4] + 
                '</td><td>' + mas[i][5] + 
                '</td></tr>'
                );
        } else {
            $('tbody').append(
                '<tr><td>' + mas[i][0] + 
                '</td><td>' + mas[i][1] +
                '</td><td>' + mas[i][2] + 
                '</td><td>' + mas[i][3] + 
                '</td><td>' + (mas[i][4] == -1 ? "-" : mas[i][4]) + 
                '</td><td>' + (mas[i][5] == 1 ? "да" : "нет") + 
                '</td><td class="delete_note" data-id="' + mas[i][0] + '">' + 'удалить' + 
                '</td><td ' + (mas[i][5] == 0 ? 'class="close_note"' : "") + ' data-id="' + mas[i][0] + '">' + (mas[i][5] == 0 ? "пометить" : "-") + 
                '</td></tr>'
                );
        }
    }
    current_quantum++;
}

function load_user_stat(){
    $('.content_container').html(
        '<table class="table_sort">'+
            '<thead>'+
                '<tr>'+
                    '<th class="sortable">ID</th>'+
                    '<th class="sortable">Логин</th>'+
                    '<th class="sortable">Заметок</th>'+
                    '<th class="sortable">Символов</th>'+
                    '<th class="sortable">Тэгов</th>'+
                    '<th class="sortable">Картинок</th>'+
                '</tr>'+
            '</thead>'+
            '<tbody>'+
            '</tbody>'+
        '</table>'+
        '<div class="load_more">Загрузить больше</div>'
    );

    $.ajax({
        url: 'all_users.php',
        type: 'get',
        dataType: 'json',
        complete: function(data){
            jsonObj = JSON.parse(data.responseText);

            mas = jsonObj.users;
            
            $('.sortable').removeClass('asc').removeClass('desc');
            sortOrder = 1;
            currentSorted = -1;
            dateSortAscDesc = 1;
            dateSortOrder = 1;

            $('tbody').empty();
            for(let i = 0; i < jsonObj.users.length && i < length_quantum; i++){
                $('tbody').append(
                    '<tr><td>' + jsonObj.users[i][0] + 
                    '</td><td class="open_user" data-id="' + jsonObj.users[i][0] + '">' + jsonObj.users[i][1] + 
                    '</td><td>' + jsonObj.users[i][2] + 
                    '</td><td>' + jsonObj.users[i][3] + 
                    '</td><td>' + jsonObj.users[i][4] + 
                    '</td><td>' + jsonObj.users[i][5] + 
                    '</td></tr>'
                    );
            }

        },
        error: function(xhr, status, ethrow){
            alert('Error: ' + status + ' | ' + ethrow);
        }
    })
}

function getVal(elm, colIndex){
    var mas_elem = elm[colIndex];
    if(typeof mas_elem !== "undefined"){
        var v = ('' + mas_elem).toUpperCase();
        if($.isNumeric(v)){
            v = parseInt(v,10);
        }
        return v;
    }
}   

function simple_sort(obj){
    let self = obj;
    let colIndex = self.prevAll().length;

    if (currentSorted != colIndex){
        sortOrder = 1;
        currentSorted = colIndex;
    }

    let o = (sortOrder == 1) ? 'asc' : 'desc';
    sortOrder *= -1;
    
    dateSortAscDesc = 1;
    dateSortOrder = 1;
    for(let i = 1; i <= 4; i++){
        $('.date_sortable').removeClass('asc-' + i).removeClass('desc-' + i);
    }
    $('.sortable').removeClass('asc').removeClass('desc');
    self.addClass(o);

    var tbody = self.closest("table").find("tbody");

    mas.sort(function(a, b) {
        var A = getVal(a, colIndex);
        var B = getVal(b, colIndex);

        if(A < B) {
            return -1*sortOrder;
        }
        if(A > B) {
            return 1*sortOrder;
        }
        return 0;
    });

    current_quantum = 0;
    $('tbody').empty();
    fill();
}

function load_user(id, name){
    user_id = id;
    user_name = name;
    console.log(name);
    $('.content_container').html(
        '<div class="user_container"><h2>Пользователь: ' + name + '</h2><h2 class="back">Назад</h2></div>'+
        '<table class="table_sort">'+
            '<thead>'+
                '<tr>'+
                    '<th class="sortable">ID</th>'+
                    '<th class="sortable">Название</th>'+
                    '<th class="sortable">Символов</th>'+
                    '<th class="sortable">Тэгов</th>'+
                    '<th class="sortable">Картинка</th>'+
                    '<th class="sortable">Удалена</th>'+
                    '<th>Удалить заметку</th>'+
                    '<th>Пометить как удаленную</th>'+
                '</tr>'+
            '</thead>'+
            '<tbody>'+
            '</tbody>'+
        '</table>'+
        '<div class="load_more">Загрузить больше</div>'
    );

    $.ajax({
        url: 'get_user.php',
        type: 'post',
        data: {id: id},
        dataType: 'json',
        complete: function(data){
            jsonObj = JSON.parse(data.responseText);

            mas = jsonObj.user;
            
            $('.sortable').removeClass('asc').removeClass('desc');
            sortOrder = 1;
            currentSorted = -1;
            dateSortAscDesc = 1;
            dateSortOrder = 1;

            $('tbody').empty();
            for(let i = 0; i < jsonObj.user.length && i < length_quantum; i++){
                $('tbody').append(
                    '<tr><td>' + jsonObj.user[i][0] + 
                    '</td><td>' + jsonObj.user[i][1] +
                    '</td><td>' + jsonObj.user[i][2] + 
                    '</td><td>' + jsonObj.user[i][3] + 
                    '</td><td>' + (jsonObj.user[i][4] == -1 ? "-" : jsonObj.user[i][4]) + 
                    '</td><td>' + (jsonObj.user[i][5] == 1 ? "да" : "нет") + 
                    '</td><td class="delete_note" data-id="' + jsonObj.user[i][0] + '">' + 'удалить' + 
                    '</td><td ' + (jsonObj.user[i][5] == 0 ? 'class="close_note"' : '') + ' data-id="' + jsonObj.user[i][0] + '">' + (jsonObj.user[i][5] == 0 ? "пометить" : "-") + 
                    '</td></tr>'
                    );
            }

        },
        error: function(xhr, status, ethrow){
            alert('Error: ' + status + ' | ' + ethrow);
        }
    })
}

function full_delete_note(id){
    $.ajax({
        url: 'full_delete_note.php',
        type: 'post',
        data: {id: id},
        dataType: 'json',
        complete: function(data){
            load_user(user_id, user_name);
        },
        error: function(xhr, status, ethrow){
            alert('Error: ' + status + ' | ' + ethrow);
        }
    })
}

function close_note(id){
    $.ajax({
        url: 'close_note.php',
        type: 'post',
        data: {id: id},
        dataType: 'json',
        complete: function(data){
            console.log(data.responseText);

            load_user(user_id, user_name);
        },
        error: function(xhr, status, ethrow){
            alert('Error: ' + status + ' | ' + ethrow);
        }
    })
}

jQuery(function($){
    
    $("#all_stat").click(function(){
        current_quantum = 1;
        user_id = -1;
        load_stat();
        $(".title_container").html("<h1>Статистика сервиса</h1>");
    });
    $("#all_users").click(function(){
        current_quantum = 1;
        user_id = -1;
        load_user_stat();
        $(".title_container").html("<h1>Пользователи</h1>");
    });
    $(document).on("click", ".back", function(){
        current_quantum = 1;
        user_id = -1;
        load_user_stat();
        $(".title_container").html("<h1>Пользователи</h1>");
    });
    $(document).on("click", ".open_user", function(){
        current_quantum = 1;
        load_user($(this).attr('data-id'), $(this).html());
    });
    $(document).on("click", ".delete_note", function(){
        current_quantum = 1;
        full_delete_note($(this).attr('data-id'));
    });
    $(document).on("click", ".close_note", function(){
        current_quantum = 1;
        close_note($(this).attr('data-id'));
    });
    $(document).on("click", ".load_more", function(){
        fill();
    });

    $(document).on('click', '.sortable', function(){
        if (typeof mas !== "undefined" && mas.length > 0){
            simple_sort($(this));
        }
    });

    load_stat();

    //load_user_stat();

});