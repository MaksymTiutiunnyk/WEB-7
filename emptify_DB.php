<?php 
require_once 'config.php';

$conn = new mysqli(HOST_NAME, USER_NAME, PASSWORD, DATABASE);
    
$sql="DELETE FROM MessageInfo";
$conn->query($sql);

$conn->close();
?>