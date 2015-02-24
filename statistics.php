<?php
	include("common.php");
?>
	<table class="statistics-table">
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
		<tr>
			<th>Total score:</th>
			<td>
<?php
	$sql = "SELECT SUM(score) AS scoreTotal FROM Highscores;";
	$rows = $db->query($sql);
	foreach ($rows as $row)
	{
		print($row["scoreTotal"]);
	}
?>
			</td>
		</tr>
		<tr>
			<th>Total taps:</th>
			<td>
<?php
	$sql = "SELECT SUM(taps) AS tapsTotal FROM Highscores;";
	$rows = $db->query($sql);
	foreach ($rows as $row)
	{
		print($row["tapsTotal"]);
	}
?>
			</td>
		</tr>
		<tr>
			<th>Total games:</th>
			<td>
<?php
	$sql = "SELECT SUM(games) AS gamesTotal FROM Highscores;";
	$rows = $db->query($sql);
	foreach ($rows as $row)
	{
		print($row["gamesTotal"]);
	}
?>
			</td>
		</tr>
	</table>
	<strong>Score breakdown:</strong>
	<table class="distribution-graph">
		<tr>
<?php
	$start = 0;
	$end = 80;
	$step = 10;
	for ($i = $start; $i < $end; $i += $step)
	{
?>
			<th><?= $i ?> - <?= $i + $step - 1 ?>:</th>
<?php
	}
?>
		</tr>
		<tr>
<?php
	$sql = "SELECT COUNT(*) AS total FROM Highscores;";
	$rows = $db->query($sql);
	foreach ($rows as $row)
	{
		$total = $row["total"];
	}
	$counts = array();
	for ($i = $start; $i < $end; $i += $step)
	{
		$counts[] = 0;
	}
	$sql = "SELECT COUNT(*) AS count, FLOOR(score / 10) AS score FROM Highscores GROUP BY FLOOR(score / 10);";
	$rows = $db->query($sql);
	foreach ($rows as $row)
	{
		$counts[$row["score"]] = $row["count"];
	}
	for ($i = $start; $i < $end; $i += $step)
	{
		$height = $counts[$i / 10] / $total * 300;
?>
			<td>
				<div style="height: <?= $height ?>px;"><?= $counts[$i / 10] ?></div>
			</td>
<?php
	}
?>
		</tr>
	</table>