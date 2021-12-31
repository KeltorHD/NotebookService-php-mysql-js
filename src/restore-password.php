<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>BRAND</title>
    
    <link rel="stylesheet" type="text/css" href="css/restore.css">
	<link rel="stylesheet" type="text/css" href="css/font.css">

    <script src="js/jquery.min.js"></script>
</head>
<body class="white_theme">

    <?php
    session_start();
    include("session.php");
    
    set_session_value("change_form", htmlspecialchars($_GET["hash"]));
    ?>

    <form action="restore_handler.php" method="post" class="log_form"> 
        <div class="auth_form">
            <h3>Change password</h3>
            
            <?php echo (isset_error("change_form_error") == true ? select_error("change_form_error") : ""); delete_error("change_form_error");?>

            <div class="form_item">
                <span>Password:</span><input required type="password" name="user_pass1" maxlength="30">
            </div>
            
            <div class="form_item">
                <span>Repeat password:</span><input required type="password" name="user_pass2" maxlength="30">
            </div>
            
            <div class="buttons_auth">
                <button type="submit" name="restore" id="restore_btn">Change</button>
            </div>

        </div>
    </form>

</body>
</html>