<?php

include("check.php");

if(is_auth()){

    if (!isset($_GET["id"])){
        echo 'denied';
        return;
    }

    $id = $_GET["id"];
    
    $conn = mysqli_connect("localhost", "db_user", "123456a");
    mysqli_select_db($conn, "db");
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    $res = mysqli_fetch_all(mysqli_query($conn, 
    "
    select
         id
        ,ext
    from
        photo
    where
        user_id = '".mysqli_real_escape_string($conn, intval($_COOKIE['id']))."'
        and
        id = $id
    "));

    if (count($res) == 0){
        echo 'denied';
        return;
    } else if (count($res) == 1){

        $id = $res[0][0];
        $ext = $res[0][1];

        header('Content-type: image/'.$ext);

        readfile('uploads' . '/' . $id.'.'.$ext);
        
        return;
    } else {
        echo 'denied';
        return;
    }


} else {
    echo "denied";
}


?>