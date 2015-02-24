<?php
	include("common.php");
?>
	<table>
		<tr>
			<th>Max score:</th>
			<td>
<?php
	$sql = "SELECT MAX(score) AS maxScore FROM Highscores;";
	$rows = $db->query($sql);
	foreach ($rows as $row)
	{
		print($row["maxScore"]);
	}
?>
			</td>
		</tr>
		<tr>
			<th>Mean score:</th>
			<td>
<?php
	$sql = "SELECT AVG(score) AS meanScore FROM Highscores;";
	$rows = $db->query($sql);
	foreach ($rows as $row)
	{
		print($row["meanScore"]);
	}
?>
			</td>
		</tr>
		<tr>
			<th>Median score:</th>
			<td>
<?php
	$sql = "SELECT score FROM Highscores WHERE score > 0 ORDER BY score DESC;";
	$rows = $db->query($sql);
	$i = 0;
	foreach ($rows as $row)
	{
		if ($i == floor($rows->rowCount() / 2))
		{
			$median = $row["score"];
		}
		$i += 1;
	}
	print($median);
?>
			</td>
		</tr>
	</table>