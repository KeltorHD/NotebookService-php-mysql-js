<?php

include("check.php");

if(is_admin()){
    
    $conn = mysqli_connect("localhost", "db_user", "123456a");
    mysqli_select_db($conn, "db");
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);    

    $users = mysqli_fetch_all(mysqli_query($conn, 
    "
    select 	
        id
        ,u.login
        ,coalesce(n.c, 0) as notes
        ,coalesce(utl.note_len, 0) chars
        ,coalesce(tags.c, 0) as tags
        ,coalesce(p.c, 0) as pics
    from 
        users u 
            
            left join user_title_length utl on 
                utl.user_id = u.id
            left join 
            (
                select 
                    ntitle.user_id
                    ,count(*) as c
                from 
                    note_tag ntag
                        left join note_title ntitle on
                            ntitle.id = ntag.note_id

                group by 
                    ntitle.user_id
            ) as tags on 
                tags.user_id = u.id
                
            left join
            (
                select 
                    p.user_id
                    ,count(*) as c
                from 
                    photo p

                group by 
                    p.user_id
            ) as p on 
                p.user_id = u.id
                
            left join
            (
                select 
                    p.user_id
                    ,count(*) as c
                from 
                    note_title p

                group by 
                    p.user_id
            ) as n on 
                n.user_id = u.id
    "));

    exit(json_encode(['users' => $users]));

}
else{
    echo "denied";
}

?>