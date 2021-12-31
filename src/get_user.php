<?php

include("check.php");

if(is_admin()){
    
    $conn = mysqli_connect("localhost", "db_user", "123456a");
    mysqli_select_db($conn, "db");
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    
    $id = htmlspecialchars($_POST['id']);

    $user = mysqli_fetch_all(mysqli_query($conn, 
    "
    select 
         nt.id as note_id
        ,nt.title
        ,coalesce(sum(octet_length(`nt`.`title`) + case `nt`.`note_type` 
        when 1 then octet_length(`sn`.`body`) 
        when 2 then octet_length(`rn`.`description`) + octet_length(`rn`.`ingredients`) + octet_length(`rn`.`remarks`) 
        when 3 then octet_length(`cn`.`surname`) + octet_length(`cn`.`name`) + octet_length(`cn`.`patronymic`) + octet_length(`cn`.`phone`) + octet_length(`cn`.`cityphone`) + octet_length(`cn`.`remarks`) 
        when 4 then octet_length(`pun`.`description`) + octet_length(`pun`.`plan`) + octet_length(`pun`.`quote`) + octet_length(`pun`.`remarks`) 
        else 0 end), 0) AS `note_len` 
        ,coalesce(tags.c, 0) as tags
        ,coalesce(rn.photo_id, -1) as photo_id
        ,nt.is_deleted
    from 
        `db`.`note_title` `nt` 
        
            left join `db`.`simple_note` `sn` 
                on `sn`.`note_id` = `nt`.`id`
            left join `db`.`recipe_note` `rn` 
                on `rn`.`note_id` = `nt`.`id` 
            left join `db`.`contact_note` `cn` 
                on `cn`.`note_id` = `nt`.`id` 
            left join `db`.`purpose_note` `pun` 
                on `pun`.`note_id` = `nt`.`id`
            left join 
            (
                select 
                    nt.note_id
                    ,count(*) as c
                from 
                    note_tag nt
                group by 
                    nt.note_id
            ) as tags on 
                tags.note_id = nt.id
    where
        `nt`.`user_id` = ".mysqli_real_escape_string($conn, $id)."
    group by 
        `nt`.`user_id`
        ,nt.id;
    "
    ));

    exit(json_encode(['user' => $user]));
}
else{
    echo "denied";
}

?>

