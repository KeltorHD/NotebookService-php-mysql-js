<?php

session_start();
include("session.php");
include("auth.php");

if(isset($_POST['login'])){
    $conn = mysqli_connect("localhost", "db_user", "123456a");
    mysqli_select_db($conn, "db");
    
    $login = htmlspecialchars($_POST["user_login"]);
    $pass = htmlspecialchars($_POST["user_pass"]);
    
    $query = mysqli_query($conn, "SELECT id, password FROM users WHERE login='".mysqli_real_escape_string($conn, $login)."' LIMIT 1");
    $data = mysqli_fetch_assoc($query);

    # Сравниваем пароли
    if(auth($login, $pass))
    {
        delete_value("form_type", "user_login");
        delete_value("form_type", "user_pass");
        
        //успешно вошли
        set_session_value("form_type", "");

        header("Location: ./app.html"); 
    }
    else
    {
        //запоминаем внутренности формы
        insert_value("auth_form", "user_login");
        insert_value("auth_form", "user_pass");
        insert_error("auth_form", "<h4 class='error_msg'>Неправильный логин или пароль!</h4>");
        
        //если ошибка, остаемся в меню
        set_session_value("form_type", "login");
        
        header("Location: ./index.html"); 
    }
} else {
    header("Location: ./index.html"); 
}


?>