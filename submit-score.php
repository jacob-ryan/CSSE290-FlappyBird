<?php
	include("common.php");
	
	if (isset($_GET["name"]) && isset($_GET["score"]) && isset($_GET["taps"]) && isset($_GET["games"]))
	{
		// This looks ugly, but it's a non-intrusive way to prevent XSS. It works because name should be alphanumeric, and the other three should only contain numbers. 
		$name = $db->quote(preg_replace("/[^A-Za-z0-9 ]/", '',$_GET["name"]));
		$score = $db->quote(preg_replace("/[^0-9 ]/", '',$_GET["score"]));
		$taps = $db->quote(preg_replace("/[^0-9 ]/", '',$_GET["taps"]));
		$games = $db->quote(preg_replace("/[^0-9 ]/", '',$_GET["games"]));
		
		$sql = "INSERT INTO Highscores VALUES(" . $name . ", " . $score . ", " . $taps . ", " . $games . ", UTC_TIMESTAMP());";
		$db->query($sql);
		
		print("success");
	}
	else
	{
		print("<h1>Invalid parameters!</h1>");
	}
?>