<?php
	include("common.php");
	
	if (isset($_GET["name"]) && isset($_GET["score"]) && isset($_GET["taps"]) && isset($_GET["games"]))
	{
		$name = $db->quote($_GET["name"]);
		$score = $db->quote($_GET["score"]);
		$taps = $db->quote($_GET["taps"]);
		$games = $db->quote($_GET["games"]);
		
		$sql = "INSERT INTO Highscores VALUES(" . $name . ", " . $score . ", " . $taps . ", " . $games . ", UTC_TIMESTAMP());";
		$db->query($sql);
		
		print("success");
	}
	else
	{
		print("<h1>Invalid parameters!</h1>");
	}
?>