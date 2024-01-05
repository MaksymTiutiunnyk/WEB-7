<?php 
$data = json_decode(file_get_contents("php://input"));

require_once 'config.php';
$conn = new mysqli(HOST_NAME, USER_NAME, PASSWORD, DATABASE);


$eventNumber = $data->number;
$message = $data->message;
date_default_timezone_set("Europe/Kiev");       
$serverTime = date("Y-m-d H:i:s");

$sql="INSERT INTO MessageInfo(number, server_time, message) VALUES('$eventNumber', '$serverTime', '$message');";
$conn->query($sql);

$conn->close();
?>