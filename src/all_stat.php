<?php

include("check.php");

if(is_admin()){
    
    $conn = mysqli_connect("localhost", "db_user", "123456a");
    mysqli_select_db($conn, "db");
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);    

    $chars = mysqli_fetch_all(mysqli_query($conn, 
    "
    select
        sum(length(nt.title) + 
        case nt.note_type
        when 1 then length(sn.body)
        when 2 then length(rn.description) + length(rn.ingredients) + length(rn.remarks)
        when 3 then length(cn.surname) + length(cn.name) + length(cn.patronymic) + length(cn.phone) + length(cn.cityphone) + length(cn.remarks)
        when 4 then length(pun.description) + length(pun.plan) + length(pun.quote) + length(pun.remarks)
        else 0
        end) as note_len
    from 
        note_title nt
            left join simple_note sn on 
                sn.note_id = nt.id
            left join recipe_note rn on 
                rn.note_id = nt.id
            left join contact_note cn on 
                cn.note_id = nt.id
            left join purpose_note pun on 
                pun.note_id = nt.id
    "
    ));

    $notes = mysqli_fetch_all(mysqli_query($conn, 
    "
    select 
        count(*)
    from 
        note_title nt
    "
    ));

    $users = mysqli_fetch_all(mysqli_query($conn, 
    "
    select 
        count(*)
    from 
        users
    "
    ));

    $del_notes = mysqli_fetch_all(mysqli_query($conn, 
    "
    select 
        count(*) as c
    from 
        note_title
    where
        is_deleted = 1
    "
    ));

    $tag = mysqli_fetch_all(mysqli_query($conn, 
    "
    select 
        count(*) as c
    from
        tag
    "
    ));

    $pics = mysqli_fetch_all(mysqli_query($conn, 
    "
    select 
        count(*) as c
    from 
        photo
    "
    ));


    exit(json_encode(['chars' => $chars[0][0], 'notes' => $notes[0][0], 'users' => $users[0][0], 'del_notes' => $del_notes[0][0], 'pics' => $pics[0][0], 'tag' => $tag[0][0]]));

}
else{
    echo "denied";
}

?>