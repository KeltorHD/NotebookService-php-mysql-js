<?php

include("check.php");

if(is_admin()){

    $conn = mysqli_connect("localhost", "db_user", "123456a");
    mysqli_select_db($conn, "db");
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    $id = htmlspecialchars($_POST['id']);

    $query = mysqli_query($conn, 
    "
    update
        note_title
    set
        is_deleted = true
    where
        id = ".mysqli_real_escape_string($conn, $id));

    exit("{}");
}
else{
    echo "denied";
}

?>