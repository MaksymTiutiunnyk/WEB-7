<?php 
require_once 'config.php';

$conn = new mysqli(HOST_NAME, USER_NAME, PASSWORD, DATABASE);

$sql="SELECT number, server_time, local_time, message FROM MessageInfo ORDER BY number;";

$result = $conn->query($sql);
$conn->close();

if($result->num_rows > 0) {
	$data = array();
	while ($row = $result->fetch_assoc()) {
		$data[] = $row;
	}
}

header('Content-Type: application/json');
echo json_encode($data);
?>