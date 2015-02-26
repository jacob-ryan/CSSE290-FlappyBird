<?php
// Create a connection the the database and activate reporting of errors and exceptions.
$db = new PDO("mysql:dbname=larsonp;host=localhost", "larsonp", "abcde");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
?>