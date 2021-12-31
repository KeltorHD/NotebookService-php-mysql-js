<?php
 
 
include("check.php");

if(is_auth()){
    // Название <input type="file">
    $input_name = 'file';
    
    // Разрешенные расширения файлов.
    $allow = array(
        'png', 'jpeg', 'bmp'
    );
    
    // Запрещенные расширения файлов.
    $deny = array(
        'phtml', 'php', 'php3', 'php4', 'php5', 'php6', 'php7', 'phps', 'cgi', 'pl', 'asp', 
        'aspx', 'shtml', 'shtm', 'htaccess', 'htpasswd', 'ini', 'log', 'sh', 'js', 'html', 
        'htm', 'css', 'sql', 'spl', 'scgi', 'fcgi', 'exe'
    );
    
    // Директория куда будут загружаться файлы.
    $path = __DIR__ . '/uploads/';
    
    $id = '';
    
    $error = $success = '';
    if (!isset($_FILES[$input_name])) {
        $error = 'Файл не загружен.';
    } else {
        $file = $_FILES[$input_name];
    
        // Проверим на ошибки загрузки.
        if (!empty($file['error']) || empty($file['tmp_name'])) {
            $error = 'Не удалось загрузить файл.';
        } elseif ($file['tmp_name'] == 'none' || !is_uploaded_file($file['tmp_name'])) {
            $error = 'Не удалось загрузить файл.';
        } else {

            $conn = mysqli_connect("localhost", "db_user", "123456a");
            mysqli_select_db($conn, "db");
            mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
            
            mysqli_begin_transaction($conn);
            
            $arr = explode('/', $file['type']);
            $ext = array_pop($arr);

            $query = mysqli_query($conn, "
            INSERT INTO 
                photo 
                (user_id, ext) 
            VALUES
                (".mysqli_real_escape_string($conn, intval($_COOKIE['id'])).", '$ext')
            ");
            $id = mysqli_insert_id($conn); //id для названия файлика


            $name = $id . ".$ext";
            $parts = pathinfo($name);

    
            if (empty($name) || empty($parts['extension'])) {
                //echo "<br>$name<br>";
                $error = 'Недопустимый тип файла';
            } elseif (!empty($allow) && !in_array(strtolower($parts['extension']), $allow)) {
                $error = 'Недопустимый тип файла';
            } elseif (!empty($deny) && in_array(strtolower($parts['extension']), $deny)) {
                $error = 'Недопустимый тип файла';
            } else {
                // Перемещаем файл в директорию.
                if (move_uploaded_file($file['tmp_name'], $path . $name)) {
                    
                } else {
                    $error = 'Не удалось загрузить файл.';
                }
            }
        }
    }
    
    // Вывод сообщения о результате загрузки.
    $is_error = '';

    if (!empty($error)) {
        mysqli_rollback($conn);
        $is_error = '1';
    } else {
        mysqli_commit($conn);
        $is_error = '0';
    }
    
    $data = array(
        'is_error' => $is_error, 'id' => $id
    );
    
    header('Content-Type: application/json');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();

} else {
    echo "denied";
}


?>