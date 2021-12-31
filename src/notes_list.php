<?php

include("check.php");

if(is_auth()){

    $conn = mysqli_connect("localhost", "db_user", "123456a");
    mysqli_select_db($conn, "db");
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    
    $sort = htmlspecialchars($_POST['sort']);

    $result = mysqli_fetch_all(mysqli_query($conn, 
    "
    select 
         nt.id
        ,nt.title
        ,nt.note_type
        ,nt.last_saved
        ,length(nt.title) + 
        case nt.note_type
        when 1 then length(sn.body)
        when 2 then length(rn.description) + length(rn.ingredients) + length(rn.remarks)
        when 3 then length(cn.surname) + length(cn.name) + length(cn.patronymic) + length(cn.phone) + length(cn.cityphone) + length(cn.remarks)
        when 4 then length(pun.description) + length(pun.plan) + length(pun.quote) + length(pun.remarks)
        else 0
        end as note_len
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
    where 
        user_id = ".mysqli_real_escape_string($conn, intval($_COOKIE['id']))."
        and
        is_deleted = 0
    order by
        last_saved ".mysqli_real_escape_string($conn, $sort)."
    "
    ));
    $tags = array();
    foreach($result as $row){

        $tags[] = mysqli_fetch_all(mysqli_query($conn, 
        "
        select 
            t.body
        from 
            note_tag nt
                
                left join tag t on
                    t.id = nt.tag_id
        where 
            nt.note_id = ".$row[0]."
        "
        ));
    }

    exit(json_encode(['result' => $result, 'tag' => $tags]));

}
else{
    echo "denied";
}

?>