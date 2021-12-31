<?php

include("check.php");
include("common.php");

function insert_tags($conn, $note_id, $tags){
    foreach($tags as $tag){
        $query = mysqli_query($conn,
        "
        delete from
            note_tag
        where
            note_id = $note_id
        ");
    }

    foreach($tags as $tag){
        $query = mysqli_query($conn,
        "
        insert into
            note_tag
            (tag_id, note_id)
        values
            ($tag, $note_id)
        ");
    }
}

if(is_auth()){

    $conn = mysqli_connect("localhost", "db_user", "123456a");
    mysqli_select_db($conn, "db");
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    $current_id = htmlspecialchars($_POST['id']);
    $save_type = htmlspecialchars($_POST['save_type']);
    $note_type = htmlspecialchars($_POST['note_type']);
    $title = htmlspecialchars($_POST['title']);
    $tags = array();
    if (isset($_POST['tags']))
        $tags = array_map("htmlspecialchars", $_POST['tags']);
    
    if ($note_type == 1){ //простая заметка
        $body = restore_contenteditable(htmlspecialchars($_POST['body']));

        if ($save_type == "add"){ //добавление

            //добавление в общую таблицу
            $query = mysqli_query($conn, "
            INSERT INTO 
                note_title 
                (user_id, title, note_type, last_saved) 
            VALUES
                (".mysqli_real_escape_string($conn, intval($_COOKIE['id']))."
                ,'".mysqli_real_escape_string($conn, $title)."'
                ,1
                ,Now()
            )");

            if ($query == false){
                echo "<error>";
                return;
            }

            $id = mysqli_insert_id($conn);

            insert_tags($conn, $id, $tags);

            //добавление в спец таблицу
            mysqli_query($conn, "INSERT INTO simple_note (note_id, body)
            VALUES
            ($id,'".mysqli_real_escape_string($conn, $body)."')");

            exit(json_encode(['id' => $id]));
        } else if ($save_type == "save"){
            mysqli_query($conn, 
            "UPDATE 
                note_title 
            SET 
                title = '".mysqli_real_escape_string($conn, $title)."'
                ,last_saved = Now() 
            WHERE 
                user_id = ".mysqli_real_escape_string($conn, intval($_COOKIE['id']))."
                AND
                id = ".mysqli_real_escape_string($conn, $current_id));

            mysqli_query($conn, 
            "UPDATE 
                simple_note
            SET 
                body = '".mysqli_real_escape_string($conn, $body)."'
            WHERE 
                note_id = ".mysqli_real_escape_string($conn, $current_id));

            insert_tags($conn, $current_id, $tags);
            exit('{}');
        }
    } else if ($note_type == 2){
        $desc = restore_contenteditable(htmlspecialchars($_POST['desc']));
        $ing = restore_contenteditable(htmlspecialchars($_POST['ing']));
        $remarks = restore_contenteditable(htmlspecialchars($_POST['remarks']));
        $img_id = htmlspecialchars($_POST['img_id']);

        if ($img_id != ''){
            $var = explode("id=", $img_id);
            $img_id = array_pop($var);
        }

        if ($save_type == "add"){ //добавление

            //добавление в общую таблицу
            $query = mysqli_query($conn, "
            INSERT INTO 
                note_title 
                (user_id, title, note_type, last_saved) 
            VALUES
                (".mysqli_real_escape_string($conn, intval($_COOKIE['id']))."
                ,'".mysqli_real_escape_string($conn, $title)."'
                ,2
                ,Now()
            )");

            if ($query == false){
                echo "<error>";
                return;
            }

            $id = mysqli_insert_id($conn);

            insert_tags($conn, $id, $tags);

            //добавление в спец таблицу
            mysqli_query($conn, "INSERT INTO recipe_note (note_id, photo_id, description, ingredients, remarks)
            VALUES
            ($id
            ,".(mysqli_real_escape_string($conn, $img_id) == '' ? 'NULL' : mysqli_real_escape_string($conn, $img_id))."
            ,'".mysqli_real_escape_string($conn, $desc)."'
            ,'".mysqli_real_escape_string($conn, $ing)."'
            ,'".mysqli_real_escape_string($conn, $remarks)."'
            )");

            exit(json_encode(['id' => $id]));
        } else if ($save_type == "save"){
            mysqli_query($conn, 
            "UPDATE 
                note_title 
            SET 
                title = '".mysqli_real_escape_string($conn, $title)."'
                ,last_saved = Now() 
            WHERE 
                user_id = ".mysqli_real_escape_string($conn, intval($_COOKIE['id']))."
                AND
                id = ".mysqli_real_escape_string($conn, $current_id));

            mysqli_query($conn, 
            "UPDATE 
                recipe_note
            SET 
                 photo_id = ".(mysqli_real_escape_string($conn, $img_id) == '' ? 'NULL' : mysqli_real_escape_string($conn, $img_id))."
                ,description = '".mysqli_real_escape_string($conn, $desc)."'
                ,ingredients = '".mysqli_real_escape_string($conn, $ing)."'
                ,remarks = '".mysqli_real_escape_string($conn, $remarks)."'
            WHERE 
                note_id = ".mysqli_real_escape_string($conn, $current_id));

            insert_tags($conn, $current_id, $tags);
            exit("{}");
        }
    } else if ($note_type == 3){
        $surname = htmlspecialchars($_POST['surname']);
        $name = htmlspecialchars($_POST['name']);
        $patronymic = htmlspecialchars($_POST['patronymic']);
        $phone = htmlspecialchars($_POST['phone']);
        $cityphone = htmlspecialchars($_POST['cityphone']);
        $remarks = restore_contenteditable(htmlspecialchars($_POST['remarks']));
        $img_id = htmlspecialchars($_POST['img_id']);

        if ($img_id != ''){
            $var = explode("id=", $img_id);
            $img_id = array_pop($var);
        }

        if ($save_type == "add"){ //добавление

            //добавление в общую таблицу
            $query = mysqli_query($conn, "
            INSERT INTO 
                note_title 
                (user_id, title, note_type, last_saved) 
            VALUES
                (".mysqli_real_escape_string($conn, intval($_COOKIE['id']))."
                ,'".mysqli_real_escape_string($conn, $title)."'
                ,3
                ,Now()
            )");

            if ($query == false){
                echo "<error>";
                return;
            }

            $id = mysqli_insert_id($conn);

            insert_tags($conn, $id, $tags);

            //добавление в спец таблицу
            mysqli_query($conn, "INSERT INTO contact_note (note_id, photo_id, surname, name, patronymic, phone, cityphone, remarks)
            VALUES
            ($id
            ,".(mysqli_real_escape_string($conn, $img_id) == '' ? 'NULL' : mysqli_real_escape_string($conn, $img_id))."
            ,'".mysqli_real_escape_string($conn, $surname)."'
            ,'".mysqli_real_escape_string($conn, $name)."'
            ,'".mysqli_real_escape_string($conn, $patronymic)."'
            ,'".mysqli_real_escape_string($conn, $phone)."'
            ,'".mysqli_real_escape_string($conn, $cityphone)."'
            ,'".mysqli_real_escape_string($conn, $remarks)."'
            )");

            exit(json_encode(['id' => $id]));
        } else if ($save_type == "save"){
            mysqli_query($conn, 
            "UPDATE 
                note_title 
            SET 
                title = '".mysqli_real_escape_string($conn, $title)."'
                ,last_saved = Now() 
            WHERE 
                user_id = ".mysqli_real_escape_string($conn, intval($_COOKIE['id']))."
                AND
                id = ".mysqli_real_escape_string($conn, $current_id));

            mysqli_query($conn, 
            "UPDATE 
                contact_note
            SET 
                 photo_id = ".(mysqli_real_escape_string($conn, $img_id) == '' ? 'NULL' : mysqli_real_escape_string($conn, $img_id))."
                ,surname = '".mysqli_real_escape_string($conn, $surname)."'
                ,name = '".mysqli_real_escape_string($conn, $name)."'
                ,patronymic = '".mysqli_real_escape_string($conn, $patronymic)."'
                ,phone = '".mysqli_real_escape_string($conn, $phone)."'
                ,cityphone = '".mysqli_real_escape_string($conn, $cityphone)."'
                ,remarks = '".mysqli_real_escape_string($conn, $remarks)."'
            WHERE 
                note_id = ".mysqli_real_escape_string($conn, $current_id));

            insert_tags($conn, $current_id, $tags);
            exit("{}");
        }
    } else if ($note_type == 4){
        $description = htmlspecialchars($_POST['description']);
        $plan = htmlspecialchars($_POST['plan']);
        $quote = htmlspecialchars($_POST['quote']);
        $remarks = htmlspecialchars($_POST['remarks']);

        if ($save_type == "add"){ //добавление

            //добавление в общую таблицу
            $query = mysqli_query($conn, "
            INSERT INTO 
                note_title 
                (user_id, title, note_type, last_saved) 
            VALUES
                (".mysqli_real_escape_string($conn, intval($_COOKIE['id']))."
                ,'".mysqli_real_escape_string($conn, $title)."'
                ,4
                ,Now()
            )");

            if ($query == false){
                echo "<error>";
                return;
            }

            $id = mysqli_insert_id($conn);

            insert_tags($conn, $id, $tags);

            //добавление в спец таблицу
            mysqli_query($conn, "INSERT INTO purpose_note (note_id, description, plan, quote, remarks)
            VALUES
            ($id
            ,'".mysqli_real_escape_string($conn, $description)."'
            ,'".mysqli_real_escape_string($conn, $plan)."'
            ,'".mysqli_real_escape_string($conn, $quote)."'
            ,'".mysqli_real_escape_string($conn, $remarks)."'
            )");

            exit(json_encode(['id' => $id]));
        } else if ($save_type == "save"){
            mysqli_query($conn, 
            "UPDATE 
                note_title 
            SET 
                title = '".mysqli_real_escape_string($conn, $title)."'
                ,last_saved = Now() 
            WHERE 
                user_id = ".mysqli_real_escape_string($conn, intval($_COOKIE['id']))."
                AND
                id = ".mysqli_real_escape_string($conn, $current_id));

            mysqli_query($conn, 
            "UPDATE 
                purpose_note
            SET 
                 description = '".mysqli_real_escape_string($conn, $description)."'
                ,plan = '".mysqli_real_escape_string($conn, $plan)."'
                ,quote = '".mysqli_real_escape_string($conn, $quote)."'
                ,remarks = '".mysqli_real_escape_string($conn, $remarks)."'
            WHERE 
                note_id = ".mysqli_real_escape_string($conn, $current_id));

            insert_tags($conn, $current_id, $tags);
            exit("{}");
        }
    }

}
else{
    echo "denied";
}

?>