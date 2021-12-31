var current_id = 0; //0 - нет заметки, -1 - новая заметка
var current_type = 0; //1 - стандартная, ...
var tags = []; //тэги в заметках
var is_list = false; //открыт ли список заметок
var is_desc = true; //сортировка по дате

function push_toast(title, text, timeout){
    new Toast({
        title: title,
        text: text,
        theme: ($("body").hasClass("white_theme") ? 'light' : 'dark'),
        autohide: true,
        interval: timeout
    });
}

//заполняем список заметок
function fill_notes_list(){
    $(".notes_left").empty();

    let desc = !is_desc;

    $.ajax({
        url: 'notes_list.php',
        type: 'post',
        dataType: 'json',
        data: {sort: (desc == true ? "desc" : "asc")},
        complete: function(data){
            jsonObj = JSON.parse(data.responseText);
            
            let note_list = '';

            for(let i = 0; i < jsonObj.result.length; i++){
                note_list +=
                    '<div class="note_element' + (jsonObj.result[i][0] == current_id ? " active" : "") +
                     '" note_id="' + jsonObj.result[i][0] + '" type_id="' + jsonObj.result[i][2] + '" last_saved="' + jsonObj.result[i][3] + '" str_len="' + jsonObj.result[i][4] + '" tags="';

                for(let j = 0; j < jsonObj.tag[i].length; j++){
                    note_list += jsonObj.tag[i][j] + (j == jsonObj.tag[i].length - 1 ? "" : " ");
                }
                
                note_list +=
                    '">'+
                        '<h3>' + jsonObj.result[i][1] + '</h3>'+
                   '</div>';
            }

            $('.notes_left').html(note_list);
            sort_list_smart();
            sort_list_choice();
        },
        error: function(xhr, status, ethrow){
            alert('Error: ' + status + ' | ' + ethrow);
        }
    })
}

//очищение редактора
function clear_noteEdit(){
    $(".note_inner").empty();
    $(".tags").empty();
}

function fill_note_simple(title, body){
    $(".note_inner").html(
        '<div class="title_right">'+
            '<span>Название:</span>'+
            '<input type="text" name="title" id="title_input" maxlength="256" placeholder="Начните писать заголовок тут..." value="' + title + '">'+
        '</div>'+

        '<div id="input_note" contenteditable="true" placeholder="Начните писать основную часть тут...">' + body + '</div>'
    )
}

function fill_note_recipe(title, photo_id, description, ingredients, remarks){
    $(".note_inner").html(
        '<div class="title_right">'+
            '<span>Название:</span>'+
            '<input type="text" name="title" id="title_input" maxlength="256" placeholder="Начните писать название рецепта тут..." value="' + title + '">'+
        '</div>'+
        '<div class="note_element_photo_right">'+
            '<span>Фото:</span>'+
            '<input type="file" id="file_recipe" name="file" style="display:none;">'+
            '<div style="display:flex;"><label id="file_recipe_label" for="file_recipe" style="' + (photo_id === null ? 'display:block;' : 'display:none;') + '">Загрузить фото</label></div>'+
            '<div class="recipe_img_container" style="' + (photo_id === null ? 'display:none;' : 'display:flex;') + '">'+
                '<img id="recipe_img" alt="recipe img" src="' + (photo_id === null ? '' : "get_photo.php?id=" + photo_id) + '">'+
                '<span id="remove_img">'+
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">'+
                        '<rect x="0" fill="none" width="16" height="16"></rect>'+
                        '<path d="M13.66 3.76l-1.42-1.42L8 6.59 3.76 2.34 2.34 3.76 6.59 8l-4.25 4.24 1.42 1.42L8 9.41l4.24 4.25 1.42-1.42L9.41 8 13.66 3.76z"></path>'+
                    '</svg>'+
                '</span>'+
            '</div>'+
        '</div>'+
        '<div class="note_element_right">'+
            '<span>Описание:</span>'+
            '<div id="input_note_description" class="input_note" contenteditable="true" placeholder="Начните писать описание тут...">' + description + '</div>'+
        '</div>'+
        '<div class="note_element_right">'+
            '<span>Ингредиенты:</span>'+
            '<div id="input_note_ingredients" class="input_note" contenteditable="true" placeholder="Начните писать ингредиенты тут...">'+
                ingredients +
            '</div>'+
        '</div>'+
        '<div class="note_element_right">'+
            '<span>Примечания:</span>'+
            '<div id="input_note_remarks" class="input_note" contenteditable="true" placeholder="Начните писать примечания тут...">' + remarks + '</div>'+
        '</div>'
    );
}

function fill_note_contact(title, photo_id, surname, name, patronymic, phone, cityphone, remarks){
    $(".note_inner").html(
        '<div class="title_right">'+
            '<span>Имя контакта:</span>'+
            '<input type="text" name="title" id="title_input" maxlength="256" placeholder="Начните писать имя контакта тут..." value="' + title + '">'+
        '</div>'+
        '<div class="note_element_photo_right">'+
            '<span>Фото:</span>'+
            '<input type="file" id="file_recipe" name="file" style="display:none;">'+
            '<div style="display:flex;"><label id="file_recipe_label" for="file_recipe" style="' + (photo_id === null ? 'display:block;' : 'display:none;') + '">Загрузить фото</label></div>'+
            '<div class="recipe_img_container" style="' + (photo_id === null ? 'display:none;' : 'display:flex;') + '">'+
                '<img id="recipe_img" alt="recipe img" src="' + (photo_id === null ? '' : "get_photo.php?id=" + photo_id) + '">'+
                '<span id="remove_img">'+
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">'+
                        '<rect x="0" fill="none" width="16" height="16"></rect>'+
                        '<path d="M13.66 3.76l-1.42-1.42L8 6.59 3.76 2.34 2.34 3.76 6.59 8l-4.25 4.24 1.42 1.42L8 9.41l4.24 4.25 1.42-1.42L9.41 8 13.66 3.76z"></path>'+
                    '</svg>'+
                '</span>'+
            '</div>'+
        '</div>'+
        '<div class="note_element_right_some_input">'+
            '<span>Фамилия:</span>'+
            '<input type="text" id="input_note_surname" class="some_input" maxlength="256" placeholder="Начните писать фамилию тут..." value="' + surname + '">'+
        '</div>'+
        '<div class="note_element_right_some_input">'+
            '<span>Имя:</span>'+
            '<input type="text" id="input_note_name" class="some_input" maxlength="256" placeholder="Начните писать имя тут..." value="' + name + '">'+
        '</div>'+
        '<div class="note_element_right_some_input">'+
            '<span>Отчество:</span>'+
            '<input type="text" id="input_note_patronymic" class="some_input" maxlength="256" placeholder="Начните писать отчество тут..." value="' + patronymic + '">'+
        '</div>'+
        '<div class="note_element_right_some_input">'+
            '<span>Мобильный телефон:</span>'+
            '<input type="text" id="input_note_phone" class="some_input" maxlength="256" placeholder="Начните писать отчество тут..." value="' + phone + '">'+
        '</div>'+
        '<div class="note_element_right_some_input">'+
            '<span>Городской телефон:</span>'+
            '<input type="text" id="input_note_cityphone" class="some_input" maxlength="256" placeholder="Начните писать гор. телефон тут..." value="' + cityphone + '">'+
        '</div>'+
        '<div class="note_element_right">'+
            '<span>Примечания:</span>'+
            '<div id="input_note_remarks" class="input_note" contenteditable="true" placeholder="Начните писать примечания тут...">' + remarks + '</div>'+
        '</div>'
    );
}

function fill_note_purpose(title, description, plan, quote, remarks){
    $(".note_inner").html(
        '<div class="title_right">'+
            '<span>Цель:</span>'+
            '<input type="text" name="title" id="title_input" maxlength="256" placeholder="Начните писать название цели тут..." value="' + title + '">'+
        '</div>'+
        '<div class="note_element_right">'+
            '<span>Описание цели:</span>'+
            '<div id="input_note_description" class="input_note" contenteditable="true" placeholder="Начните писать описание тут...">' + description + '</div>'+
        '</div>'+
        '<div class="note_element_right">'+
            '<span>Шаги реализации:</span>'+
            '<div id="input_note_plan" class="input_note" contenteditable="true" placeholder="Начните писать шаги по реализации цели тут...">' + plan + '</div>'+
        '</div>'+
        '<div class="note_element_right">'+
            '<span>Мотивационная цитата:</span>'+
            '<div id="input_note_quote" class="input_note" contenteditable="true" placeholder="Начните писать цитату тут...">' + quote + '</div>'+
        '</div>'+
        '<div class="note_element_right">'+
            '<span>Примечания:</span>'+
            '<div id="input_note_remarks" class="input_note" contenteditable="true" placeholder="Начните писать примечания тут...">' + remarks + '</div>'+
        '</div>'
    );
}

//открываем заметку в редакторе
function open_note(elem){

    let id = elem.attr('note_id');
    $(".note_element").removeClass("active");
    elem.addClass("active");

    $.ajax({
        url: 'get_note.php',
        type: 'post',
        data: {id: id},
        dataType: 'json',
        complete: function(data){
            jsonObj = JSON.parse(data.responseText);

            switch (parseInt(jsonObj.note_type)){
                case 1:
                    fill_note_simple(jsonObj.title, jsonObj.body);
                    break;
                case 2:
                    fill_note_recipe(jsonObj.title, jsonObj.photo_id, jsonObj.description, jsonObj.ingredients, jsonObj.remarks);
                    break;
                case 3:
                    fill_note_contact(jsonObj.title, jsonObj.photo_id, jsonObj.surname, jsonObj.name, jsonObj.patronymic,
                        jsonObj.phone, jsonObj.cityphone, jsonObj.remarks);
                    break;
                case 4:
                    fill_note_purpose(jsonObj.title, jsonObj.description, jsonObj.plan, jsonObj.quote, jsonObj.remarks);
                    break;
            }

            current_type = parseInt(jsonObj.note_type);

            $(".tags").empty();
            let tags = '';

            for(let i = 0; i < jsonObj.tags.length; i++){
                tags +=
                '<div class="tag" tag_id="' + jsonObj.tags[i][0] + '"><div class="tag_text">' + jsonObj.tags[i][1] + '</div>'+
                    '<span class="remove-tag-icon">'+
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">'+
                            '<rect x="0" fill="none" width="16" height="16"></rect>'+
                            '<path d="M13.66 3.76l-1.42-1.42L8 6.59 3.76 2.34 2.34 3.76 6.59 8l-4.25 4.24 1.42 1.42L8 9.41l4.24 4.25 1.42-1.42L9.41 8 13.66 3.76z"></path>'+
                        '</svg>'+
                    '</span>'+
                '</div>'
            }
            tags += '<input id="tag_input" type="text" maxlength="15" size="15" placeholder="Добавить тэг..." spellcheck="false" value="">';

            $(".tags").html(tags);

            current_id = id;
            tags = jsonObj.tags;
        },
        error: function(xhr, status, ethrow){
            alert('Error: ' + status + ' | ' + ethrow);
        }
    })
}

//создание простой заметки
function create_note_simple(){
    $(".note_inner").html(
        '<div class="title_right">'+
            '<span>Название:</span>'+
            '<input type="text" name="title" id="title_input" maxlength="256" placeholder="Начните писать заголовок тут...">'+
        '</div>'+

        '<div id="input_note" contenteditable="true" placeholder="Начните писать основную часть тут..."></div>'
    );
}

//создание простой заметки
function create_note_recipe(){
    $(".note_inner").html(
        '<div class="title_right">'+
            '<span>Название:</span>'+
            '<input type="text" name="title" id="title_input" maxlength="256" placeholder="Начните писать название рецепта тут..." value="Хлеб с маслом">'+
        '</div>'+
        '<div class="note_element_photo_right">'+
            '<span>Фото:</span>'+
            '<input type="file" id="file_recipe" name="file" style="display:none;">'+
            '<div style="display:flex;"><label id="file_recipe_label" for="file_recipe">Загрузить фото</label></div>'+
            '<div class="recipe_img_container" style="display:none;">'+
                '<img id="recipe_img" alt="recipe img">'+
                '<span id="remove_img">'+
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">'+
                        '<rect x="0" fill="none" width="16" height="16"></rect>'+
                        '<path d="M13.66 3.76l-1.42-1.42L8 6.59 3.76 2.34 2.34 3.76 6.59 8l-4.25 4.24 1.42 1.42L8 9.41l4.24 4.25 1.42-1.42L9.41 8 13.66 3.76z"></path>'+
                    '</svg>'+
                '</span>'+
            '</div>'+
        '</div>'+
        '<div class="note_element_right">'+
            '<span>Описание:</span>'+
            '<div id="input_note_description" class="input_note" contenteditable="true" placeholder="Начните писать описание тут...">Изысканное блюдо для лучших гурманов!</div>'+
        '</div>'+
        '<div class="note_element_right">'+
            '<span>Ингредиенты:</span>'+
            '<div id="input_note_ingredients" class="input_note" contenteditable="true" placeholder="Начните писать ингредиенты тут...">'+
                '<ol>'+
                    '<li>Хлеб - 1 шт.</li>'+
                    '<li>Масло - 1 шт.</li>'+
                '</ol>'+
            '</div>'+
        '</div>'+
        '<div class="note_element_right">'+
            '<span>Примечания:</span>'+
            '<div id="input_note_remarks" class="input_note" contenteditable="true" placeholder="Начните писать примечания тут..."></div>'+
        '</div>'
    );
}

function create_note_contact(){
    $(".note_inner").html(
        '<div class="title_right">'+
            '<span>Имя контакта:</span>'+
            '<input type="text" name="title" id="title_input" maxlength="256" placeholder="Начните писать имя контакта тут..." value="Лучший друг">'+
        '</div>'+
        '<div class="note_element_photo_right">'+
            '<span>Фото:</span>'+
            '<input type="file" id="file_recipe" name="file" style="display:none;">'+
            '<div style="display:flex;"><label id="file_recipe_label" for="file_recipe">Загрузить фото</label></div>'+
            '<div class="recipe_img_container" style="display:none;">'+
                '<img id="recipe_img" alt="contact img">'+
                '<span id="remove_img">'+
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">'+
                        '<rect x="0" fill="none" width="16" height="16"></rect>'+
                        '<path d="M13.66 3.76l-1.42-1.42L8 6.59 3.76 2.34 2.34 3.76 6.59 8l-4.25 4.24 1.42 1.42L8 9.41l4.24 4.25 1.42-1.42L9.41 8 13.66 3.76z"></path>'+
                    '</svg>'+
                '</span>'+
            '</div>'+
        '</div>'+
        '<div class="note_element_right_some_input">'+
            '<span>Фамилия:</span>'+
            '<input type="text" id="input_note_surname" class="some_input" maxlength="256" placeholder="Начните писать фамилию тут..." value="Иванов">'+
        '</div>'+
        '<div class="note_element_right_some_input">'+
            '<span>Имя:</span>'+
            '<input type="text" id="input_note_name" class="some_input" maxlength="256" placeholder="Начните писать имя тут..." value="Иван">'+
        '</div>'+
        '<div class="note_element_right_some_input">'+
            '<span>Отчество:</span>'+
            '<input type="text" id="input_note_patronymic" class="some_input" maxlength="256" placeholder="Начните писать отчество тут..." value="Иванович">'+
        '</div>'+
        '<div class="note_element_right_some_input">'+
            '<span>Мобильный телефон:</span>'+
            '<input type="text" id="input_note_phone" class="some_input" maxlength="256" placeholder="Начните писать отчество тут..." value="+74433221100">'+
        '</div>'+
        '<div class="note_element_right_some_input">'+
            '<span>Городской телефон:</span>'+
            '<input type="text" id="input_note_cityphone" class="some_input" maxlength="256" placeholder="Начните писать гор. телефон тут...">'+
        '</div>'+
        '<div class="note_element_right">'+
            '<span>Примечания:</span>'+
            '<div id="input_note_remarks" class="input_note" contenteditable="true" placeholder="Начните писать примечания тут..."></div>'+
        '</div>'
    );
}

function create_note_purpose(){
    $(".note_inner").html(
        '<div class="title_right">'+
            '<span>Цель:</span>'+
            '<input type="text" name="title" id="title_input" maxlength="256" placeholder="Начните писать название цели тут..." value="">'+
        '</div>'+
        '<div class="note_element_right">'+
            '<span>Описание цели:</span>'+
            '<div id="input_note_description" class="input_note" contenteditable="true" placeholder="Начните писать описание тут..."></div>'+
        '</div>'+
        '<div class="note_element_right">'+
            '<span>Шаги реализации:</span>'+
            '<div id="input_note_plan" class="input_note" contenteditable="true" placeholder="Начните писать шаги по реализации цели тут..."></div>'+
        '</div>'+
        '<div class="note_element_right">'+
            '<span>Мотивационная цитата:</span>'+
            '<div id="input_note_quote" class="input_note" contenteditable="true" placeholder="Начните писать цитату тут..."></div>'+
        '</div>'+
        '<div class="note_element_right">'+
            '<span>Примечания:</span>'+
            '<div id="input_note_remarks" class="input_note" contenteditable="true" placeholder="Начните писать примечания тут..."></div>'+
        '</div>'
    );
}

//создание заметки
function create_note(type){
    clear_noteEdit();
    $(".note_element").removeClass("active");
    $(".tags").html('<input id="tag_input" type="text" maxlength="15" size="15" placeholder="Добавить тэг..." spellcheck="false" value="">');
    tags = [];
    
    current_id = -1;
    current_type = type;

    switch (type){
        case 1:
            create_note_simple();
            break;
        case 2:
            create_note_recipe();
            break;
        case 3:
            create_note_contact();
            break;
        case 4:
            create_note_purpose();
            break;
    }
}

//удаление заметки
function delete_note(){
    if (current_id == -1 || current_id > 0){
        clear_noteEdit();

        if (current_type > 0){
            $.ajax({
                url: 'delete_note.php',
                type: 'post',
                data: {id: current_id},
                dataType: 'json',
                complete: function(data){
                    fill_notes_list();
                },
                error: function(xhr, status, ethrow){
                    alert('Error: ' + status + ' | ' + ethrow);
                }
            })
        }
        
        current_id = 0;
        $(".note_element").removeClass("active");
        
        push_toast('Внимание!','Заметка удалена',2000);
    }
}

//сохранение заметки
function save_note(){
    if (current_id == -1 || current_id > 0){

        let title = $("#title_input").val();
        let tags = [];

        $('.tag').each(function(i,elem) {
            tags.push($(this).attr("tag_id"));
        });

        if (title.length == 0){
            push_toast("Внимание!", "Заполните заголовок и основную часть!", 1000);
            return;
        }

        switch (current_type){
            case 1:{
                    let body = $("#input_note").html();

                    $.ajax({
                        url: 'save_note.php',
                        type: 'post',
                        data: {note_type: 1, save_type: (current_id == -1 ? "add" : "save"), title: title, body: body, id: current_id, tags: tags},
                        dataType: 'json',
                        complete: function(data){
                            if (current_id == -1){
                                current_id = JSON.parse(data.responseText).id;
                            }

                            push_toast('Внимание!','Заметка сохранена',2000);
                            fill_notes_list();
                        },
                        error: function(xhr, status, ethrow){
                            alert('Error: ' + status + ' | ' + ethrow);
                        }
                    });
                }
                break;
            case 2:{
                    let desc = $("#input_note_description").html();
                    let ing = $("#input_note_ingredients").html();
                    let remarks = $("#input_note_remarks").html();
                    let img_id = $("#recipe_img").attr('src');
                    if (img_id === undefined || img_id === ''){
                        img_id = '';
                    }

                    $.ajax({
                        url: 'save_note.php',
                        type: 'post',
                        data: {note_type: 2, save_type: (current_id == -1 ? "add" : "save"), title: title, tags: tags, id: current_id, desc: desc, ing: ing, remarks: remarks, img_id: img_id},
                        dataType: 'json',
                        complete: function(data){
                            if (current_id == -1){
                                current_id = JSON.parse(data.responseText).id;
                            }

                            push_toast('Внимание!','Заметка сохранена',2000);
                            fill_notes_list();
                        },
                        error: function(xhr, status, ethrow){
                            alert('Error: ' + status + ' | ' + ethrow);
                        }
                    });
                }

                break;
            case 3:{
                    let img_id = $("#recipe_img").attr('src');
                    if (img_id === undefined || img_id === ''){
                        img_id = '';
                    }
                    let surname = $("#input_note_surname").val();
                    let name = $("#input_note_name").val();
                    let patronymic = $("#input_note_patronymic").val();
                    let phone = $("#input_note_phone").val();
                    let cityphone = $("#input_note_cityphone").val();
                    let remarks = $("#input_note_remarks").html();
                    $.ajax({
                        url: 'save_note.php',
                        type: 'post',
                        data: {note_type: 3, save_type: (current_id == -1 ? "add" : "save"), title: title, tags: tags, id: current_id,
                        img_id: img_id, surname: surname, name: name, patronymic: patronymic, phone: phone, cityphone: cityphone, remarks: remarks},
                        dataType: 'json',
                        complete: function(data){
                            if (current_id == -1){
                                current_id = JSON.parse(data.responseText).id;
                            }

                            push_toast('Внимание!','Заметка сохранена',2000);
                            fill_notes_list();
                        },
                        error: function(xhr, status, ethrow){
                            alert('Error: ' + status + ' | ' + ethrow);
                        }
                    });
                }   
                break;
            case 4:{
                    let description = $("#input_note_description").html();
                    let plan = $("#input_note_plan").html();
                    let quote = $("#input_note_quote").html();
                    let remarks = $("#input_note_remarks").html();
                    $.ajax({
                        url: 'save_note.php',
                        type: 'post',
                        data: {note_type: 4, save_type: (current_id == -1 ? "add" : "save"), title: title, tags: tags, id: current_id,
                        description: description, plan: plan, quote: quote, remarks: remarks},
                        dataType: 'json',
                        complete: function(data){
                            if (current_id == -1){
                                current_id = JSON.parse(data.responseText).id;
                            }

                            push_toast('Внимание!','Заметка сохранена',2000);
                            fill_notes_list();
                        },
                        error: function(xhr, status, ethrow){
                            alert('Error: ' + status + ' | ' + ethrow);
                        }
                    });
                }   
                break;
        }
    }
}

function info_note(){
    if (current_id <= 0){
        push_toast('Внимание!','Сначала сохраните заметку или откройте существующую',2000);
        return;
    }

    $.ajax({
        url: 'stat_note.php',
        type: 'post',
        data: {id: current_id},
        dataType: 'json',
        complete: function(data){
            jsonObj = JSON.parse(data.responseText)

            $(".info_container").html(
                '<div class="note_type">'+
                    '<span>' + jsonObj.type_title + '</span>'+
                    '<button type="button" id="close_info">'+
                        '<svg class="icon-cross-small" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">'+
                            '<rect x="0" fill="none" width="16" height="16"></rect>'+
                            '<path d="M13.66 3.76l-1.42-1.42L8 6.59 3.76 2.34 2.34 3.76 6.59 8l-4.25 4.24 1.42 1.42L8 9.41l4.24 4.25 1.42-1.42L9.41 8 13.66 3.76z"></path>'+
                        '</svg>'+
                   '</button>'+
                '</div>'+
                '<div class="info_elements_container">'+
                    '<div class="info_element">'+
                        '<span class="info_element_title">Дата изменения</span>'+
                        '<span class="info_element_value">' + jsonObj.last_saved + '</span>'+
                    '</div>'+
                    '<div class="info_element">'+
                        '<span class="info_element_title">Количество тэгов</span>'+
                        '<span class="info_element_value">' + jsonObj.tags + '</span>'+
                    '</div>'+
                    '<div class="info_element">'+
                        '<span class="info_element_title">Количество символов</span>'+
                        '<span class="info_element_value">' + jsonObj.chars + '</span>'+
                    '</div>'+
                '</div>'
            );

            $(".info_container").css("display", "block");
            $(".info_container_back").css("display", "block");
        },
        error: function(xhr, status, ethrow){
            alert('Error: ' + status + ' | ' + ethrow);
        }
    });
}

function add_tag(){
    let t = $("#tag_input").val();

    if(t.length == 0) return;

    if ($(".tag_text").filter(function() {
        return $(this).text() === t;
    }).html() !== undefined) {
        $("#tag_input").val('');
        return;
    }

    $.ajax({
        url: 'get_tag.php',
        type: 'post',
        data: {tag_body: t},
        dataType: 'json',
        complete: function(data){
            jsonObj = JSON.parse(data.responseText);

            $(
                '<div class="tag" tag_id="' + jsonObj.id + '"><div class="tag_text">' + t + '</div>'+
                    '<span class="remove-tag-icon">'+
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">'+
                            '<rect x="0" fill="none" width="16" height="16"></rect>'+
                            '<path d="M13.66 3.76l-1.42-1.42L8 6.59 3.76 2.34 2.34 3.76 6.59 8l-4.25 4.24 1.42 1.42L8 9.41l4.24 4.25 1.42-1.42L9.41 8 13.66 3.76z"></path>'+
                        '</svg>'+
                    '</span>'+
                '</div>'
            ).insertBefore("#tag_input");

            $("#tag_input").val('');
        },
        error: function(xhr, status, ethrow){
            alert('Error: ' + status + ' | ' + ethrow);
        }
    });
}

function recipe_photo_send(){
    let formData = new FormData();
    formData.append('file', $("#file_recipe")[0].files[0]);

    $.ajax({
        type: "POST",
        url: '/upload_photo.php',
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        dataType : 'json',
        complete: function(data){
            jsonObj = JSON.parse(data.responseText);

            if (jsonObj.is_error == 1){
                push_toast('Внимание!','Не удалось загрузить фото!',2000);
                return;
            }

            $("#file_recipe_label").hide();
            $("#recipe_img").attr("src", "get_photo.php?id=" + jsonObj.id);
            $(".recipe_img_container").css("display", "flex");
        },
        error: function(xhr, status, ethrow){
            alert('Error: ' + status + ' | ' + ethrow);
        }

    });
}

function delete_recipe_photo(){
    $("#file_recipe_label").css("display", "block");
    $("#file_recipe").val('');
    $("#recipe_img").attr("src", "");
    $(".recipe_img_container").css("display", "none");
}

var init_main_left_width;
var init_main_right_width;
var init_note_inner_padding;

function run_media(){
    if(window.matchMedia('(max-width: 750px)').matches){
        if ((current_id == -1 || current_id > 0) && !is_list){
            $(".main_left").css("display", "none")
            $(".main_right").css("width", "100%");
            $(".back").css("display", "inline");
            $(".note_inner").css("padding", "20px 15px");
        } else {
            $(".main_left").css("width", "100%")
            $(".main_right").css("display", "none");
            $(".back").css("display", "none");
            $(".note_inner").css("padding", init_note_inner_padding);
        }
    } else {
        $(".main_left").css("width", init_main_left_width)
        $(".main_left").css("display", "block")
        $(".main_right").css("display", "block");
        $(".back").css("display", "none");
        $(".note_inner").css("padding", init_note_inner_padding);
    }
}

function apply_media(){
    if(window.matchMedia('(max-width: 750px)').matches){
        $(".main_left").css("display", "none")
        $(".main_right").css("width", "100%");
        $(".main_right").css("display", "block");
        $(".back").css("display", "inline");
        $(".note_inner").css("padding", "20px 15px");

        is_list = false;
    }
}

function sort_list_choice(){
    let mas;
    let attrib = $("#sort_select").val();

    if (is_desc == true){
        mas = $(".note_element").sort(function(a,b){
            
            let ca, cb;

            if (attrib == 'last_saved'){
                ca = new Date($(a).attr('last_saved'));
                cb = new Date($(b).attr('last_saved'));
            } else if (attrib == 'title'){
                ca = $(a).children().html();
                cb = $(b).children().html();
            } else {
                ca = parseInt($(a).attr(attrib));
                cb = parseInt($(b).attr(attrib));
            }

            return (ca < cb) ? 1 : (ca > cb) ? -1 : 0;
        });
    } else {
        mas = $(".note_element").sort(function(a,b){
            
            let ca, cb;

            if (attrib == 'last_saved'){
                ca = new Date($(a).attr('last_saved'));
                cb = new Date($(b).attr('last_saved'));
            } else if (attrib == 'title'){
                ca = $(a).children().html();
                cb = $(b).children().html();
            } else {
                ca = parseInt($(a).attr(attrib));
                cb = parseInt($(b).attr(attrib));
            }

            return (ca < cb) ? -1 : (ca > cb) ? 1 : 0;
        });
    }

    $(".notes_left").html(mas);
}

function open_search(){
    $(".additional_find").css("display", "flex");
    $(".notes_left").css("height", "60%");
    $(".find_left").css("border", "none");
}

function close_search(){
    $(".additional_find").css("display", "none");
    $(".notes_left").css("height", "84%");
    $(".find_left").css("border-bottom", "1px solid #2c3338");

    $("#search").val('');
    $("#search_title").val('');
    $(".checkselect-popup input").prop("checked", true);
    let checked = $('.checkselect').find("input[type='checkbox']:checked").length;
    $('.checkselect').find('select option:first').html('<span style="color:white;">Выбрано типов: ' + checked + '</span>');
    sort_list_smart();

    $("#sort_select").val("last_saved");
    is_desc = true;
    $(".order").replaceWith('<svg class="order" width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-labelledby="sortDownIconTitle" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" color="#000000"> <title id="sortDownIconTitle">Sort in descending order</title> <path d="M11 9H17"/> <path d="M11 5H19"/> <path d="M11 13H15"/> <path d="M10 17L7 20L4 17"/> <path d="M7 5V19"/> </svg>');
    sort_list_choice();
}

function sort_list_smart(){
    let tag = $("#search").val().toLowerCase();
    let title = $("#search_title").val().toLowerCase();
    let arr = [];
    $("input:checkbox[name=types]:checked").each(function(){
        arr.push($(this).val());
    });

    $(".note_element").css("display", "block");
    $(".note_element").each(function(i, elem){

        if (!arr.includes($(elem).attr('type_id'))){
            $(elem).css("display", "none");
            return;
        }

        let tag_inner = $(elem).attr('tags').split(' ');
        if (tag.length > 0){
            let is_incorrect = true;
            for(let i = 0; i < tag_inner.length; i++){
                if (tag_inner[i].toLowerCase().match(new RegExp('.*' + tag + '.*', 'g'))){
                    is_incorrect = false;
                    break;
                }
            }
            if (is_incorrect){
                $(elem).css("display", "none");
                return;
            }
        }

        let title_inner = $(elem).children().html().toLowerCase();
        if (title.length > 0 && !title_inner.match(new RegExp('.*' + title + '.*', 'g'))){
            $(elem).css("display", "none");
            return;
        }
    });
}

function set_current_theme(){
    let is_white = $("body").hasClass("white_theme");

    if (is_white){
        $(".theme_change").replaceWith(
        '<svg class="theme_change" xmlns="http://www.w3.org/2000/svg" width="36px" height="36px" viewBox="0 0 36 36">'+
            '<g id="Lager_93" data-name="Lager 93" transform="translate(2 2)">'+
            '<g id="Sun_3_Brightness_3" data-name="Sun 3, Brightness 3">'+
                '<path id="Path_68" data-name="Path 68" d="M32,14H27.033c-2,1.769-.779,4,.967,4h4.967C34.966,16.231,33.746,14,32,14Z" fill="#040505"/>'+
                '<g id="Path_69" data-name="Path 69" fill="none" stroke-miterlimit="10">'+
                '<path d="M17.172,10.111a6,6,0,1,0,4.715,4.715A6.01,6.01,0,0,0,17.172,10.111Z" stroke="none"/>'+
                '<path d="M 15.99852275848389 13.99979972839355 C 15.40029907226563 13.99979972839355 14.83786392211914 14.26465797424316 14.45541763305664 14.72645950317383 C 14.18128776550293 15.05748176574707 13.88667678833008 15.62165832519531 14.04035758972168 16.43178939819336 C 14.1787109375 17.16349411010742 14.83581733703613 17.82003402709961 15.56771087646484 17.958740234375 C 15.71307563781738 17.98624801635742 15.85765266418457 18.00020027160645 15.99740505218506 18.00020027160645 C 16.59555816650391 18.00020027160645 17.15798187255859 17.73542404174805 17.54046440124512 17.27376556396484 C 17.81481742858887 16.94261169433594 18.1097583770752 16.37818908691406 17.95689964294434 15.57052993774414 C 17.81802749633789 14.83748245239258 17.1605224609375 14.17996406555176 16.42829895019531 14.041259765625 C 16.28293609619141 14.01375389099121 16.13835906982422 13.99979972839355 15.99860572814941 13.99979972839355 L 15.99852275848389 13.99979972839355 M 15.99860000610352 9.999795913696289 C 16.38235282897949 9.999801635742188 16.77459716796875 10.03580474853516 17.17200469970703 10.11100006103516 C 19.52100563049316 10.55599975585938 21.44199371337891 12.47699928283691 21.88699340820313 14.82600021362305 C 22.61180877685547 18.65568542480469 19.69624137878418 22.00020408630371 15.99740028381348 22.00020408630371 C 15.61366271972656 22.00020408630371 15.22141265869141 21.96419525146484 14.82400512695313 21.88899993896484 C 12.47600555419922 21.44400024414063 10.55400466918945 19.52299880981445 10.11000442504883 17.17499923706055 C 9.383377075195313 13.34440803527832 12.29961967468262 9.999755859375 15.99860000610352 9.999795913696289 Z" stroke="none" fill="#040505"/>'+
                '</g>'+
                '<rect id="Rectangle_26" data-name="Rectangle 26" width="8" height="4" rx="1.993" transform="translate(26 14)" fill="#040505"/>'+
                '<rect id="Rectangle_27" data-name="Rectangle 27" width="8" height="4" rx="1.993" transform="translate(18 26) rotate(90)" fill="#040505"/>'+
                '<rect id="Rectangle_28" data-name="Rectangle 28" width="8" height="4" rx="1.993" transform="translate(18 -2) rotate(90)" fill="#040505"/>'+
                '<rect id="Rectangle_29" data-name="Rectangle 29" width="8" height="4" rx="1.993" transform="translate(-2 14)" fill="#040505"/>'+
                '<g id="Group_22" data-name="Group 22">'+
                '<rect id="Rectangle_30" data-name="Rectangle 30" width="6.925" height="3.766" rx="1.883" transform="translate(23.22 6.117) rotate(-45)" fill="#040505"/>'+
                '</g>'+
                '<g id="Group_23" data-name="Group 23">'+
                '<rect id="Rectangle_31" data-name="Rectangle 31" width="3.766" height="6.925" rx="1.883" transform="matrix(0.707, -0.707, 0.707, 0.707, 23.22, 25.883)" fill="#040505"/>'+
                '</g>'+
                '<g id="Group_24" data-name="Group 24">'+
                '<rect id="Rectangle_32" data-name="Rectangle 32" width="3.766" height="6.925" rx="1.883" transform="translate(1.22 3.883) rotate(-45)" fill="#040505"/>'+
                '</g>'+
                '<g id="Group_25" data-name="Group 25">'+
                '<rect id="Rectangle_33" data-name="Rectangle 33" width="6.925" height="3.766" rx="1.883" transform="translate(1.22 28.117) rotate(-45)" fill="#040505"/>'+
                '</g>'+
            '</g>'+
            '</g>'+
        '</svg>')
    } else {
        $(".theme_change").replaceWith(
            '<svg class="theme_change" xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 32 32">'+
                '<g id="Lager_94" data-name="Lager 94" transform="translate(0)">'+
                '<path id="Path_70" data-name="Path 70" d="M12.516,4.509A12,12,0,0,0,22.3,19.881,12.317,12.317,0,0,0,24,20a11.984,11.984,0,0,0,3.49-.514,12.1,12.1,0,0,1-9.963,8.421A12.679,12.679,0,0,1,16,28,12,12,0,0,1,12.516,4.509M16,0a16.5,16.5,0,0,0-2.212.15A16,16,0,0,0,16,32a16.526,16.526,0,0,0,2.01-.123A16.04,16.04,0,0,0,31.85,18.212,16.516,16.516,0,0,0,32,15.944,1.957,1.957,0,0,0,30,14a2.046,2.046,0,0,0-1.23.413A7.942,7.942,0,0,1,24,16a8.35,8.35,0,0,1-1.15-.08,7.995,7.995,0,0,1-5.264-12.7A2.064,2.064,0,0,0,16.056,0Z" fill="#040505"/>'+
                '</g>'+
            '</svg>')
    }
}

jQuery(function($){
    init_main_left_width = $(".main_left").css("width");
    init_main_right_width = $(".main_right").css("width");
    init_note_inner_padding = $(".note_inner").css("padding");

    document.getElementById('num_list').addEventListener( 'click', function() {
        document.execCommand("insertorderedlist");
    });
    document.getElementById('underline').addEventListener( 'click', function() {
        document.execCommand('underline', false, null);
    });
    document.getElementById('bold').addEventListener( 'click', function() {
        document.execCommand('bold', false, null);
    });
    document.getElementById('italic').addEventListener( 'click', function() {
        document.execCommand('italic', false, null);
    });
    $("#input_note").focusout(function(){
        let element = $(this);        
        if (!element.text().replace(" ", "").length) {
            element.empty();
        }
    });
    $(".input_note").focusout(function(){
        let element = $(this);        
        if (!element.text().replace(" ", "").length) {
            element.empty();
        }
    });

    $(".new_note").click(function() { //открытие всплыв. меню
        $(".new_note_choice").css("display", "flex");
    });
    $(document).mouseup(function (e){ //закрытие всплывающего меню
        let elem = $(".new_note_choice");
        if (!elem.is(e.target) && elem.has(e.target).length === 0) {
            elem.hide();
        }
        elem = $(".info_container");
        if (!elem.is(e.target) && elem.has(e.target).length === 0) {
            elem.hide();
            $(".info_container_back").hide();
        }
    });
    $(document.body).on("click", "#close_info", function(){
        $(".info_container").hide();
        $(".info_container_back").hide();
    });
    $("#new_simple_note_add").click(function() { //создание простой заметки
        create_note(1);
        $(".new_note_choice").hide();
    });
    $("#new_recipe_note_add").click(function() { //создание рецепта
        create_note(2);
        $(".new_note_choice").hide();
    });
    $("#new_contact_note_add").click(function() { //создание контакта
        create_note(3);
        $(".new_note_choice").hide();
    });
    $("#new_purpose_note_add").click(function() { //создание цели
        create_note(4);
        $(".new_note_choice").hide();
    });
    $(document.body).on("click", ".theme_change", function() {
        if ($("body").hasClass("white_theme")){
            $("body").removeClass("white_theme");
            set_current_theme();
            
            $.ajax({
                url: 'set_theme.php',
                type: 'post',
                data: {theme: "dark_theme"},
                error: function(xhr, status, ethrow){
                    alert('Error: ' + status + ' | ' + ethrow);
                }
            });
        } else {
            $("body").addClass("white_theme");
            set_current_theme();
            
            $.ajax({
                url: 'set_theme.php',
                type: 'post',
                data: {theme: "white_theme"},
                error: function(xhr, status, ethrow){
                    alert('Error: ' + status + ' | ' + ethrow);
                }
            });
        }
    });


    $(".trash").click(function() {
        delete_note();
    });

    $(".save").click(function() {
        save_note();
    });

    $(".info").click(function() {
        info_note();
    });
    $(".logout").click(function() {
        window.location = 'logout.php';
    });
    $(document.body).on("click", ".order", function(){
        if (!is_desc){
            $(".order").replaceWith('<svg class="order" width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-labelledby="sortDownIconTitle" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" color="#000000"> <title id="sortDownIconTitle">Sort in descending order</title> <path d="M11 9H17"/> <path d="M11 5H19"/> <path d="M11 13H15"/> <path d="M10 17L7 20L4 17"/> <path d="M7 5V19"/> </svg>');
        } else {
            $(".order").replaceWith('<svg class="order" width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-labelledby="sortUpIconTitle" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" color="#000000"> <title id="sortUpIconTitle">Sort in ascending order</title> <path d="M11 16H17"/> <path d="M11 20H19"/> <path d="M11 12H15"/> <path d="M4 8L7 5L10 8"/> <path d="M7 20L7 6"/> </svg>');
        }
        is_desc = !is_desc;
        sort_list_choice();
    });

    $(document.body).on("click", ".note_element", function(){
        open_note($(this));
        apply_media();
    });
    $(document.body).on("click", ".tag", function(){
        $(this).remove();
    });
    $(document.body).on("focusout", "#tag_input", function(){
        add_tag();
    });
    $(document.body).on("keydown", "#tag_input", function(event){
        if(event.which == 13 || event.which == 32)
            add_tag();
    });
    $(document.body).on("change", "#file_recipe", function(){
        recipe_photo_send();
    });
    $(document.body).on("click", "#recipe_img", function(){
        delete_recipe_photo();
    });
    $(document.body).on("click", ".back", function(){ //нажатие кнопки назад
        $(".main_left").css("width", "100%");
        $(".main_left").css("display", "block")
        $(".main_right").css("display", "none");
        is_list = true;
    });
    $(document.body).on("click", "#search", function(){
        open_search();
    });
    $(document.body).on("keyup", "#search", function(){
        sort_list_smart();
    });
    $(document.body).on("click", ".close_search", function(){
        close_search();
    });
    $(document.body).on("keyup", "#search_title", function(){
        sort_list_smart();
    });
    $(document.body).on("change", ".types_checkbox", function(){
        sort_list_smart();
    });
    $(document.body).on("change", "#sort_select", function(){
        sort_list_choice();
    });

    fill_notes_list(); //посылаем ajax запрос и заполняем список заметок
    clear_noteEdit() //очищение редактора
    $('.checkselect').checkselect();
    set_current_theme();

    /*медиа запросы*/
    run_media();
    $(window).resize(function(){
        run_media();
    })

});