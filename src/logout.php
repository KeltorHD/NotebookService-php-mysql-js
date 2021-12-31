<?php

if (isset($_COOKIE['id'])){
    setcookie("id", "", time() - 3600*24*30*12, "/");
}
if (isset($_COOKIE['hash'])){
    setcookie("hash", "", time() - 3600*24*30*12, "/");
}

header("Location: ./index.html"); 

?>