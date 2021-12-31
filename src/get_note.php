<?php

include("check.php");

if(is_auth()){

    $conn = mysqli_connect("localhost", "db_user", "123456a");
    mysqli_select_db($conn, "db");
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    $id = htmlspecialchars($_POST['id']);

    $query = mysqli_query($conn, 
    "
    select
         title
        ,note_type
    from
        note_title
    where
        user_id = ".mysqli_real_escape_string($conn, intval($_COOKIE['id']))."
        and
        id = ".mysqli_real_escape_string($conn, $id)."
        and
        is_deleted = 0
    "
    );

    $row = mysqli_fetch_array($query, MYSQLI_ASSOC);

    $tags = mysqli_fetch_all(mysqli_query($conn, 
        "
        select
             t.id
            ,t.body
        from 
            note_tag nt
                
                left join tag t on
                    t.id = nt.tag_id
        where 
            nt.note_id = $id
        "
        ));    


    if ($row["note_type"] == 1){
        $query2 = mysqli_query($conn, 
        "
        select
            body
        from
            simple_note
        where
            note_id = ".mysqli_real_escape_string($conn, $id));
        $row2 = mysqli_fetch_array($query2, MYSQLI_ASSOC);
        
        exit(json_encode(['note_type' => $row["note_type"], 'title' => $row["title"], 'tags' => $tags, 'body' => $row2["body"]]));
    } else if ($row["note_type"] == 2){
        $query2 = mysqli_query($conn, 
        "
        select
             photo_id
            ,description
            ,ingredients
            ,remarks
        from
            recipe_note
        where
            note_id = ".mysqli_real_escape_string($conn, $id));
        $row2 = mysqli_fetch_array($query2, MYSQLI_ASSOC);
        
        exit(json_encode(['note_type' => $row["note_type"], 'title' => $row["title"], 'tags' => $tags, 
        'photo_id' => $row2["photo_id"], 'description' => $row2["description"],
        'ingredients' => $row2["ingredients"], 'remarks' => $row2["remarks"],]));
    } else if ($row["note_type"] == 3){
        $query2 = mysqli_query($conn, 
        "
        select
             photo_id
            ,surname
            ,name
            ,patronymic
            ,phone
            ,cityphone
            ,remarks
        from
            contact_note
        where
            note_id = ".mysqli_real_escape_string($conn, $id));
        $row2 = mysqli_fetch_array($query2, MYSQLI_ASSOC);
        
        exit(json_encode(['note_type' => $row["note_type"], 'title' => $row["title"], 'tags' => $tags, 
        'photo_id' => $row2["photo_id"], 'surname' => $row2["surname"],
        'name' => $row2["name"], 'patronymic' => $row2["patronymic"], 'phone' => $row2["phone"],
        'cityphone' => $row2["cityphone"], 'remarks' => $row2["remarks"]]));
    } else if ($row["note_type"] == 4){
        $query2 = mysqli_query($conn, 
        "
        select
             description
            ,plan
            ,quote
            ,remarks
        from
            purpose_note
        where
            note_id = ".mysqli_real_escape_string($conn, $id));
        $row2 = mysqli_fetch_array($query2, MYSQLI_ASSOC);
        
        exit(json_encode(['note_type' => $row["note_type"], 'title' => $row["title"], 'tags' => $tags, 
        'description' => $row2["description"], 'plan' => $row2["plan"],
        'quote' => $row2["quote"], 'remarks' => $row2["remarks"]]));
    }

}
else{
    echo "denied";
}

?>