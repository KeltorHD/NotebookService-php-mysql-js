<?php

session_start();
include("session.php");
include("auth.php");

function arr_to_str($arr){
    //конвертируем массив в строку
    $err_str = "";
    foreach ($arr as $e){
        $err_str .= "<h4 class='error_msg'>" . $e . "</h4>";
    }
    return $err_str;
}

if(isset($_POST['restore'])){
    $hash = get_session_value("change_form");

    $pass1 = htmlspecialchars($_POST["user_pass1"]);
    $pass2 = htmlspecialchars($_POST["user_pass2"]);

    $err = array();

    $conn = mysqli_connect("localhost", "db_user", "123456a");
    mysqli_select_db($conn, "db");

    $query = mysqli_query($conn, "SELECT login, password, UNIX_TIMESTAMP(restore_date) as restore_date FROM users WHERE restore_hash='".mysqli_real_escape_string($conn, $hash)."' LIMIT 1");
    $row_cnt = mysqli_num_rows($query);

    if ((int)$row_cnt == 0){
        $err[] = "Неправильный пользователь! Вы уверены, что не злоумышленник?";
        insert_error("change_form_error", arr_to_str($err));
        header("Location: ./restore-password.php?hash=$hash");
    } else {
        $userdata = mysqli_fetch_assoc($query);

        if (time() > (int)$userdata["restore_date"]){
            $err[] = "Timeout!";
        }
        /*проверка пароля*/
        if ($pass1 != $pass2){
            $err[] = "Password mismatch!";
        }
        if(!preg_match("/^[a-zA-Z0-9]+$/", $pass1)){
            $err[] = "Пароль может состоять только из букв английского алфавита и цифр!";
        }
        if(strlen($pass1) < 3 or strlen($pass1) > 30)
        {
            $err[] = "Пароль должен состоять не менее чем из 3 символов и не более чем из 30!";
        }

        $md5pass = md5(md5($pass1));

        if($md5pass == $userdata["password"]){
            $err[] = "Новый пароль такой же, как и предыдущий!";
        }

        if (count($err) == 0){
            mysqli_query($conn, "UPDATE users SET password='".mysqli_real_escape_string($conn, $md5pass)."', restore_date='2000-00-00 00:00:00', restore_hash = null WHERE restore_hash='".mysqli_real_escape_string($conn, $hash)."'");
            delete_error("change_form_error");

            auth($userdata["login"], $pass1);
            header("Location: ./app.html");
        } else {
            insert_error("change_form_error", arr_to_str($err));
            header("Location: ./restore-password.php?hash=$hash");
        }
    }
    
}
?>