<?php 
$conn = new mysqli("sql304.infinityfree.com", "if0_35609823", "0viQtrEXs9Mmqk", "if0_35609823_web7_db");

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