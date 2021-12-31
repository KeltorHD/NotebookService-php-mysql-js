<?php

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

function auth($login, $pass){
    $conn = mysqli_connect("localhost", "db_user", "123456a");
    mysqli_select_db($conn, "db");

    $query = mysqli_query($conn, "SELECT id, password FROM users WHERE login='".mysqli_real_escape_string($conn, $login)."' LIMIT 1");
    $data = mysqli_fetch_assoc($query);

    # Сравниваем пароли
    if(mysqli_num_rows($query) > 0 && $data['password'] === md5(md5($pass)))
    {
        # Генерируем случайное число и шифруем его
        $hash = md5(generateCode(10));
        
        if(!@$_POST['not_attach_ip'])
        {
            # Если пользователя выбрал привязку к IP
            # Переводим IP в строку
            $insip = ", ip=INET_ATON('".$_SERVER['REMOTE_ADDR']."')";
        }
        
        # Записываем в БД новый хеш авторизации и IP
        mysqli_query($conn, "UPDATE users SET hash='".$hash."' ".$insip." WHERE id='".mysqli_real_escape_string($conn, $data['id'])."'");
        
        # Ставим куки
        setcookie("id", $data['id'], time()+60*60*24*30);
        setcookie("hash", $hash, time()+60*60*24*30);
        setcookie("theme", "black", time()+60*60*24*30);

        return true;
    }
    else
    {
        return false;
    }
}

?>