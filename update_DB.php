<?php 
$data = json_decode(file_get_contents("php://input"));

require_once 'config.php';
$conn = new mysqli(HOST_NAME, USER_NAME, PASSWORD, DATABASE);
    
$dataArray = $data->data;
foreach ($dataArray as $item) {
   	$time = $item->time;
   	$number = $item->number;

	$sql= $conn->prepare("UPDATE MessageInfo SET local_time=? WHERE number=?");
	$sql->bind_param("si", $time, $number);

	$sql->execute();
}
$conn->close();
?>