<?php
// Create a connection the the database and activate reporting of errors and exceptions.
$db = new PDO("mysql:dbname=FlappyBird;host=localhost", "root", "ryanjm");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
?>