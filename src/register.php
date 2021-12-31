<?php

session_start();
include("session.php");
include("auth.php");


if(isset($_POST['register'])){
    $conn = mysqli_connect("localhost", "db_user", "123456a");
    mysqli_select_db($conn, "db");

    $login = htmlspecialchars($_POST["user_login"]);
    $pass1 = htmlspecialchars($_POST["user_pass"]);
    $pass2 = htmlspecialchars($_POST["user_pass2"]);
    $email = htmlspecialchars($_POST["user_email"]);
    $firstName = htmlspecialchars($_POST["user_firstName"]);
    $lastName = htmlspecialchars($_POST["user_lastName"]);
    
    $err = array();

    /*Проверка логина*/
    if(!preg_match("/^[a-zA-Z0-9]+$/", $login)){
        $err[] = "Логин должен начинаться с буквы и может состоять только из букв английского алфавита и цифр!";
    }
    if(strlen($login) < 3 or strlen($login) > 30)
    {
        $err[] = "Логин должен состоять не менее чем из 3-х символов и не более чем из 30!";
    }
    // проверяем, не существует ли пользователя с таким именем
    $query = mysqli_query($conn, "SELECT COUNT(id) FROM users WHERE login='".mysqli_real_escape_string($conn, $login)."'");
    if(ceil(mysqli_fetch_array($query)[0]) > 0){
        $err[] = "Пользователь с таким логином уже существует!";
    }
    
    /*проверка пароля*/
    if ($pass1 != $pass2){
        $err[] = "Пароли не совпадают!";
    }
    if(!preg_match("/^[a-zA-Z0-9]+$/", $pass1)){
        $err[] = "Пароль может состоять только из букв английского алфавита и цифр!";
    }
    if(strlen($pass1) < 3 or strlen($pass1) > 30)
    {
        $err[] = "Пароль должен состоять не менее чем из 3 символов и не более чем из 30!";
    }

    /*Проверка почты*/
    if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
        $err[] = "Неверный почтовый ящик!";
    }
    if(strlen($email) < 3 or strlen($email) > 150)
    {
        $err[] = "Электронная почта должна содержать не менее 3 символов и не более 150!";
    }
    $query_email = mysqli_query($conn, "SELECT COUNT(id) FROM users WHERE email='".mysqli_real_escape_string($conn, $email)."'");
    if(ceil(mysqli_fetch_array($query_email)[0]) > 0){
        $err[] = "Пользователь с таким адресом электронной почты уже существует!";
    }

    /*Проверка имени и фамилии*/
    if(!preg_match("/^[a-zA-Z0-9]+$/", $firstName)){
        $err[] = "Имя может состоять только из букв английского алфавита и цифр.!";
    }
    if(strlen($firstName) < 3 or strlen($firstName) > 30)
    {
        $err[] = "Имя должно состоять не менее чем из 3 символов и не более чем из 30!";
    }
    if(!preg_match("/^[a-zA-Z0-9]+$/", $lastName)){
        $err[] = "Фамилия может состоять только из букв английского алфавита и цифр!";
    }
    if(strlen($lastName) < 3 or strlen($lastName) > 30)
    {
        $err[] = "Фамилия должна состоять не менее чем из 3 символов и не более чем из 30!";
    }

    if(count($err) == 0){
        if (!empty($_FILES['user_photo']) && !$_FILES['user_photo']['error']) {
            $destination = 'usr';
            $name = basename($login);
            $ext = pathinfo($_FILES['user_photo']['name'], PATHINFO_EXTENSION);

            if (!move_uploaded_file($_FILES['user_photo']['tmp_name'], "$destination/$name.$ext")) {
                $err[] = "Ошибка загрузки файла!";
            }
        } else {
            $err[] = "Ошибка загрузки файла!";
        }
    }

    if(count($err) == 0){
        //пользователь зарегистрирован
        $password = md5(md5($pass1));

        mysqli_query($conn, "INSERT INTO users SET login='".mysqli_real_escape_string($conn, $login)."', password='".mysqli_real_escape_string($conn, $password)."', hash='', email='".mysqli_real_escape_string($conn, $email)."', firstName='".mysqli_real_escape_string($conn, $firstName)."', lastName='".mysqli_real_escape_string($conn, $lastName)."', extension='".mysqli_real_escape_string($conn, $ext)."'");
        
        delete_value("register_form", "user_login");
        delete_value("register_form", "user_pass");
        delete_value("register_form", "user_pass2");
        delete_value("register_form", "user_email");
        delete_value("register_form", "user_firstName");
        delete_value("register_form", "user_lastName");

        auth($login, $pass1);
        header("Location: ./app.html");
    } else {
        //произошли ошибки валидации
        //запоминаем внутренности формы
        insert_value("register_form", "user_login");
        insert_value("register_form", "user_pass");
        insert_value("register_form", "user_pass2");
        insert_value("register_form", "user_email");
        insert_value("register_form", "user_firstName");
        insert_value("register_form", "user_lastName");

        //конвертируем массив в строку
        $err_str = "";
        foreach ($err as $e){
            $err_str .= "<h4 class='error_msg'>" . $e . "</h4>";
        }

        //вставляем ошибку
        insert_error("register_form", $err_str);
        
        //если ошибка, остаемся в меню
        set_session_value("form_type", "register");

        //переходим на главную страницу
        header("Location: ./index.html"); 
    }
}

?>