/*USE FlappyBird*/

CREATE TABLE Highscores(
	name varchar(255) NOT NULL,
	score int NOT NULL,
	taps int NOT NULL,
	games int NOT NULL,
	timeSubmitted DATETIME NOT NULL
);