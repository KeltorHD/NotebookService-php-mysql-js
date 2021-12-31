<?php

include("check.php");

if(is_admin()){
    
    $conn = mysqli_connect("localhost", "db_user", "123456a");
    mysqli_select_db($conn, "db");
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    
    $id = htmlspecialchars($_POST['id']);

    $note_type = mysqli_fetch_all(mysqli_query($conn, 
    "
    select
        note_type
    from
        note_title
    where
        id = ".mysqli_real_escape_string($conn, $id)."
    "
    ))[0][0];

    $table = '';
    switch ($note_type) {
        case 1:
            $table = 'simple_note';
            break;
        case 2:
            $table = 'recipe_note';
            break;
        case 3:
            $table = 'contact_note';
            break;
        case 4:
            $table = 'purpose_note';
            break;
    }

    $res = mysqli_query($conn, 
    "
    delete from
        $table
    where
        note_id = ".mysqli_real_escape_string($conn, $id)."
    "
    );

    $res = mysqli_query($conn, 
    "
    delete from
        note_tag
    where
        note_id = ".mysqli_real_escape_string($conn, $id)."
    "
    );

    $res = mysqli_query($conn, 
    "
    delete from
        note_title
    where
        id = ".mysqli_real_escape_string($conn, $id)."
    "
    );

    exit('{}');
}
else{
    echo "denied";
}

?>