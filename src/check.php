<?php
// Скрипт проверки
function is_auth(){
    $conn = mysqli_connect("localhost", "db_user", "123456a");
    mysqli_select_db($conn, "db");
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    
    if (isset($_COOKIE['id']) and isset($_COOKIE['hash'])){   
        $query = mysqli_query($conn, "SELECT *,INET_NTOA(ip) AS ip FROM users WHERE id = '".mysqli_real_escape_string($conn, intval($_COOKIE['id']))."' LIMIT 1");
        $userdata = mysqli_fetch_assoc($query);
    
        if(
            ($userdata['hash'] !== $_COOKIE['hash']) 
            or 
            ($userdata['id'] !== $_COOKIE['id']) 
            ){
                setcookie("id", "", time() - 3600*24*30*12, "/");
                setcookie("hash", "", time() - 3600*24*30*12, "/");
    
                return false;
            }
            else
            {
                return true;
            }
    }
    else
    {
        return false;
    } 
}

function is_admin(){
    $conn = mysqli_connect("localhost", "db_user", "123456a");
    mysqli_select_db($conn, "db");
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    
    if (isset($_COOKIE['id']) and isset($_COOKIE['hash'])){   
        $query = mysqli_query($conn, "SELECT *,INET_NTOA(ip) AS ip FROM users WHERE id = '".mysqli_real_escape_string($conn, intval($_COOKIE['id']))."' LIMIT 1");
        $userdata = mysqli_fetch_assoc($query);
    
        if(
            ($userdata['hash'] !== $_COOKIE['hash']) 
            or 
            ($userdata['id'] !== $_COOKIE['id']) 
            ){
                setcookie("id", "", time() - 3600*24*30*12, "/");
                setcookie("hash", "", time() - 3600*24*30*12, "/");
    
                return false;
            }
            else
            {
                if ($userdata['is_admin'] == 1)
                    return true;
                else
                    return false;
            }
    }
    else
    {
        return false;
    } 
}

?>
