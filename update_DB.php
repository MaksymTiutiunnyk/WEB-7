<?php 
$data = json_decode(file_get_contents("php://input"));

$conn = new mysqli("sql304.infinityfree.com", "if0_35609823", "0viQtrEXs9Mmqk", "if0_35609823_web7_db");
    
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