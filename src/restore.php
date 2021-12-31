<?php

session_start();
include("session.php");

// Функция для генерации случайной строки
function generateCode($length = 10) {
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHI JKLMNOPRQSTUVWXYZ0123456789";
    $code = "";
    $clen = strlen($chars) - 1;  
    while (strlen($code) < $length) {
            $code .= $chars[mt_rand(0,$clen)];  
    }
    return $code;
}

if(isset($_POST['restore'])){
    $conn = mysqli_connect("localhost", "db_user", "123456a");
    mysqli_select_db($conn, "db");

    $login = htmlspecialchars($_POST["user_login"]);

    // проверяем, существует ли пользователь с таким именем
    $query = mysqli_query($conn, "SELECT COUNT(id) FROM users WHERE login='".mysqli_real_escape_string($conn, $login)."'");
    if(ceil(mysqli_fetch_array($query)[0]) != 0){

        delete_value("restore_form", "user_login");

        set_session_value("form_type", "");

        $restore_hash = generateCode(10);

        mysqli_query($conn, "UPDATE users SET restore_hash='$restore_hash', restore_date=ADDTIME(CURRENT_TIMESTAMP(), '0 01:00:00') WHERE login='".mysqli_real_escape_string($conn, $login)."'");

        header("Location: ./restore-password.php?hash=$restore_hash"); 
    }
    else
    {
        //запоминаем внутренности формы
        insert_value("restore_form", "user_login");
        insert_error("restore_form", "<h4 class='error_msg'>Неправильный логин!</h4>");
        
        //если ошибка, остаемся в меню
        set_session_value("form_type", "restore");
        
        header("Location: ./app.html");
    }
}


?>