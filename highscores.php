<?php
	include("common.php");
	
	$sql = "SELECT * FROM Highscores ORDER BY score DESC, taps;";
	$rows = $db->query($sql);
	
	foreach ($rows as $row)
	{
		print($row["name"] . ";" . $row["score"] . ";" . $row["taps"] . ";" . $row["games"] . ";" . $row["timeSubmitted"]);
		print("\n");
	}
?>