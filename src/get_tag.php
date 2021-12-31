<?php

include("check.php");

if(is_auth()){

    $conn = mysqli_connect("localhost", "db_user", "123456a");
    mysqli_select_db($conn, "db");
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    $tag_body = htmlspecialchars($_POST['tag_body']);

    $res = mysqli_fetch_all(mysqli_query($conn, 
    "
    select
        id
    from
        tag
    where
        body = '".mysqli_real_escape_string($conn, $tag_body)."'
    "));

    $id = 0;

    if(count($res) >= 1){
        $id = $res[0][0];
    } else {
        $query = mysqli_query($conn, "
            INSERT INTO 
                tag 
                (body) 
            VALUES
                ('".mysqli_real_escape_string($conn, $tag_body)."')
            ");
        $id = mysqli_insert_id($conn);
    }

    exit('{"id":"'.$id.'"}');
}
else{
    echo "denied";
}

?>