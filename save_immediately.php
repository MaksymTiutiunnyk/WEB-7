<?php 

$data = json_decode(file_get_contents("php://input"));
$conn = new mysqli("sql304.infinityfree.com", "if0_35609823", "0viQtrEXs9Mmqk", "if0_35609823_web7_db");


$eventNumber = $data->number;
$message = $data->message;
date_default_timezone_set("Europe/Kiev");       
$serverTime = date("Y-m-d H:i:s");

$sql="INSERT INTO MessageInfo(number, server_time, message) VALUES('$eventNumber', '$serverTime', '$message');";
$conn->query($sql);

$conn->close();
?>