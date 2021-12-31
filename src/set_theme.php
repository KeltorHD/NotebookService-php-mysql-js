<?php

include("check.php");



if(is_auth()){

    $conn = mysqli_connect("localhost", "db_user", "123456a");
    mysqli_select_db($conn, "db");
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    
    $theme = htmlspecialchars($_POST['theme']);

    setcookie("theme", $theme, time() + 3600*24*30*12, "/");
    $_COOKIE['theme'] = $theme;

} else {
    echo 'Denied';
}

?>