<?php

include("session.php");

function clear_session(){
    set_session_value("form_type", "");

    //форма авторизации
    delete_value("auth_form", "user_login");
    delete_value("auth_form", "user_pass");

    delete_error("auth_form");


    //форма регистрации
    delete_value("register_form", "user_login");
    delete_value("register_form", "user_pass");
    delete_value("register_form", "user_pass2");
    delete_value("register_form", "user_email");
    delete_value("register_form", "user_firstName");
    delete_value("register_form", "user_lastName");
    
    delete_error("register_form");


    //форма восстановления пароля
    delete_value("restore_form", "user_login");
    
    delete_error("restore_form");
}

function restore_contenteditable($to_restore){
    return preg_replace('#&lt;(/?(div|br|ol|li|u|b|i))&gt;#', '<$1>', $to_restore);
}

?>