<?php

// cохранение значения поля в сессию
function insert_value($key, $name){
    if (isset($_POST[$name])){
        if (!empty($_POST[$name])){
            $_SESSION[$key . $name] = $_POST[$name];
        }
    }
}

function set_session_value($key, $val){
    $_SESSION[$key] = $val;
}

function get_session_value($key){
    if (isset($_SESSION[$key])){
        return $_SESSION[$key];
    } else {
        return "";
    }
}

// занесение ошибок в сессию
function insert_error($key, $error){
    $_SESSION[$key] = $error;
}

// очистка сессии от мусора
function delete_value($key, $name){
    if (isset($_SESSION[$key . $name])) unset($_SESSION[$key . $name]);
}

function isset_value($key, $name){
    return isset($_SESSION[$key . $name]);
}

function isset_error($key){
    return isset($_SESSION[$key]);
}

// очистка сессии от мусора
function delete_error($key){
    if (isset($_SESSION[$key])) unset($_SESSION[$key]);
}

// показ ошибок
function select_error($key){
    if (isset($_SESSION[$key])) return $_SESSION[$key];
}

// безопасное представление value поля
function select_value($key, $name){
    if (isset($_SESSION[$key . $name])) return htmlspecialchars($_SESSION[$key . $name]);
}

?>