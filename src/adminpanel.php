<?php

include("check.php");

if(is_admin()):

?>

<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="utf-8">
	<title>Записная книжка</title>

    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link href="/css/adminpanel.css" type="text/css" rel="stylesheet">
    <link href="/css/font.css" type="text/css" rel="stylesheet">
	
	<script src="js/jquery.min.js"></script>
	<script src="js/nav.js"></script>
	<script src="js/adminpanel.js"></script>
</head>
<body 
        <?php if(isset($_COOKIE['theme'])){
            if ($_COOKIE['theme'] == "white_theme"){
                echo "class='white_theme'";
            }
        } ?>>	
    
    <div class="main header_nav">

        <div class="left_icon">
            <a href="/">Записная книжка</a>
        </div>

        <div class="right_nav">

            <div id="all_stat" class="right_nav_element">Общая статистика</div>
            <div id="all_users" class="right_nav_element"><a href="#">Пользователи</a></div>
            <div class="right_nav_element login_container"><a href="/index.html" id="login-button">Главная</a></div>

        </div>

        <svg id="burger" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <defs><style>.cls-1{fill:none;}</style></defs>
            <title/>
            <g data-name="Layer 2" id="Layer_2">
                <path d="M28,10H4A1,1,0,0,1,4,8H28a1,1,0,0,1,0,2Z"/>
                <path d="M28,17H4a1,1,0,0,1,0-2H28a1,1,0,0,1,0,2Z"/>
                <path d="M28,24H4a1,1,0,0,1,0-2H28a1,1,0,0,1,0,2Z"/>
            </g>
            <g id="frame">
                <rect class="cls-1" height="32" width="32"/>
            </g>
        </svg>

    </div>

    <div class="main title_container">

        <h1>Статистика сервиса</h1>

    </div>

    <div class="main content_container">
    
    </div>

</body>
</html>

<?php else: ?>

<h1>Denied</h1>

<?php endif ?>