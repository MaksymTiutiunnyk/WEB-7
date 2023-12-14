<?php 
$conn = new mysqli("sql304.infinityfree.com", "if0_35609823", "0viQtrEXs9Mmqk", "if0_35609823_web7_db");
    
$sql="DELETE FROM MessageInfo";
$conn->query($sql);

$conn->close();
?>