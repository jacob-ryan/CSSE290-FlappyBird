<?php
	include("common.php");
	
	if (isset($_POST["name"]) && isset($_POST["score"]) && isset($_POST["taps"]) && isset($_POST["games"]))
	{
		$name = $db->quote($_POST["name"]);
		$score = $db->quote($_POST["score"]);
		$taps = $db->quote($_POST["taps"]);
		$game = $db->quote($_POST["games"]);
		
		$db->query("INSERT INTO Highscores VALUES(" + name + ", " + score + ", " + taps + ", " + games + ", UTC_TIMESTAMP());");
		
		print("success");
	}
	else
	{
		print("<h1>Invalid parameters!</h1>");
	}
?>