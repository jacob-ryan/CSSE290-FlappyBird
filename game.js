$(document).ready(function()
{
	var playingGame = false;
	var gameWidth = $(".game-container").width();
	var gameHeight = $(".game-container").height();
	var pipeTopUrl = "pipe-top.png";
	var pipeBottomUrl = "pipe-bottom.png";
	var separation = 180;
	var flapTime = 100;
	var pipes;
	var gameMode;
	var crosshair;

	var bird = {
		element: $("#bird")[0],
		init: function()
		{
			$("#bird").css("transform", "");
			bird.xPos = gameWidth / 2 - $("#bird").width() / 2;
			bird.yPos = gameHeight / 2;
			bird.velocity = 0;
			bird.move();
		},
		xPos: 0,
		yPos: 0,
		velocity: 0,
		getX: function()
		{
			return bird.xPos + $("#bird").width() / 2;
		},
		getY: function()
		{
			return bird.yPos + $("#bird").height() / 2;
		},
		move: function()
		{
			$("#bird").css("left", bird.xPos + "px");
			$("#bird").css("top", bird.yPos + "px");
			if (bird.yPos > gameHeight)
			{
				endGame();
			}
		},
		flapWings: function()
		{
			(new Audio("flap.mp3")).play();

			bird.element.src = bird.element.src.replace("_1", "_2");
			setTimeout(function()
			{
				bird.element.src = bird.element.src.replace("_2", "_3");
				setTimeout(function()
				{
					bird.element.src = bird.element.src.replace("_3", "_2");
					setTimeout(function()
					{
						bird.element.src = bird.element.src.replace("_2", "_1");
					}, flapTime);
				}, flapTime);
			}, flapTime);
		}
	};

	var initGame = function()
	{
		$(".game-game").show();

		$(".pipe").remove();
		pipes = [];
		bird.init();

		$("#game-stats-score").text("0");
		$("#game-stats-taps").text("0");
		var games = parseInt($("#game-stats-games").text());
		$("#game-stats-games").text(games + 1);

		createPipe().done(function(pipe)
		{
			pipes.push(pipe);
			pipe.setX(gameWidth);

			createPipe().done(function(pipe)
			{
				pipes.push(pipe);
				pipe.setX(gameWidth * 1.5 + pipe.getWidth() / 2);

				playingGame = true;
				window.requestAnimationFrame(render);
			});
		});
	};

	var endGame = function()
	{
		alert("You died!");
		playingGame = false;
		if (gameMode == "upsideDown")
		{
			$(".game-container").removeClass("upside-down");
		}
		if (gameMode == "fps")
		{
			endGameModefps();
		}
		$(".game-game").hide();
		if (gameMode == "classic") {
		    $(".game-submit").show();
		    $("#game-submit-yes").removeAttr("disabled");
		} else {
		    $(".game-menu").show();
		}
	};

	var addEventListeners = function()
	{
		$("#new-game").on("click", function()
		{
			$(".game-menu").fadeOut(function()
			{
				gameModeClassic();
			});
		});

		$("#view-highscores").on("click", function()
		{
			$(".game-menu").fadeOut(function()
			{
				$(".highscores-table").html("<tr>\
					<th>Rank:</th>\
					<th>Name:</th>\
					<th>Score:</th>\
					<th>Taps:</th>\
					<th>Games:</th>\
					<th>Date/Time:</th>\
				</tr>");
				$.get("highscores.php").done(function(data)
				{
					var scores = data.trim().split("\n");
					if (scores != "")
					{
						for (var i = 0; i < scores.length; i += 1)
						{
							var score = scores[i].trim().split(";");
							var html = "<tr>";
							html += "<td>" + (i + 1) + "</td>";
							html += "<td>" + score[0] + "</td>";
							html += "<td>" + score[1] + "</td>";
							html += "<td>" + score[2] + "</td>";
							html += "<td>" + score[3] + "</td>";
							html += "<td>" + score[4] + "</td>";
							html += "</tr>";
							$(".highscores-table").append(html);
						}
					} else
					{

					}
				});
				$(".game-highscores").fadeIn();
			});
		});

		$("#view-statistics").on("click", function()
		{
			$(".game-menu").fadeOut(function()
			{
				$(".game-statistics").fadeIn();
				$.get("statistics.php").done(function(data)
				{
					$("#game-statistics-output").html(data);
				});
			});
		});

		$("#other-game-modes").on("click", function()
		{
			$(".game-menu").fadeOut(function()
			{
				$(".game-modes").fadeIn();
			});
		});

		$("#game-modes-mainMenu").on("click", function()
		{
			$(".game-modes").fadeOut(function()
			{
				$(".game-menu").fadeIn();
			});
		});

		$("#game-modes-upsideDown").on("click", function()
		{
			$(".game-modes").fadeOut(function()
			{
				gameModeUpsideDown();
			});
		});

		$("#game-modes-hard").on("click", function()
		{
			$(".game-modes").fadeOut(function()
			{
				gameModeHard();
			});
		});

		$("#game-modes-fps").on("click", function()
		{
			$(".game-modes").fadeOut(function()
			{
				gameModeFps();
			});
		});

		$("#game-modes-alt").on("click", function()
		{
			$(".game-modes").fadeOut(function()
			{
				gameModeAlt();
			});
		});

		$("#view-options").on("click", function()
		{
			$(".game-menu").fadeOut(function()
			{
				$(".game-options").fadeIn();
			});
		});

		$("#game-options-defaultBird").on("click", function()
		{
			bird.element.src = "bird_1.png";
		});

		$("#game-options-miniBird").on("click", function()
		{
			bird.element.src = "minibird_1.png";
		});

		$("#game-options-metroidBird").on("click", function()
		{
			bird.element.src = "metroid_1.png";
		});

		$("#game-options-defaultBackground").on("click", function()
		{
			$(".game-container").css("background", "url(background-simple.png)");
		});

		$("#game-options-ruinedBackground").on("click", function()
		{
			$(".game-container").css("background", "url(background-ruined.png)");
		});

		$("#game-options-metroidBackground").on("click", function()
		{
			$(".game-container").css("background", "url(background-metroid.png)");
		});

		$("#game-options-defaultPipe").on("click", function()
		{
			pipeTopUrl = "pipe-top.png";
			pipeBottomUrl = "pipe-bottom.png";
		});

		$("#game-options-dirtPipe").on("click", function()
		{
			pipeTopUrl = "pipe_dirt-top.png";
			pipeBottomUrl = "pipe_dirt-bottom.png";
		});

		$("#game-options-clearPipe").on("click", function()
		{
			pipeTopUrl = "pipe_clear-top.png";
			pipeBottomUrl = "pipe_clear-bottom.png";
		});

		$("#game-highscores-mainMenu").on("click", function()
		{
			$(".game-highscores").fadeOut(function()
			{
				$(".game-menu").fadeIn();
			});
		});

		$("#game-statistics-mainMenu").on("click", function()
		{
			$(".game-statistics").fadeOut(function()
			{
				$(".game-menu").fadeIn();
			});
		});

		$("#game-options-mainMenu").on("click", function()
		{
			$(".game-options").fadeOut(function()
			{
				$(".game-menu").fadeIn();
			});
		});

		$("#game-submit-no").on("click", function()
		{
			$(".game-submit").fadeOut(function()
			{
				$(".game-menu").fadeIn();
			});
		});

		$("#game-submit-yes").on("click", function()
		{
			var name = $("#game-submit-name").val().trim();
			var score = parseInt($("#game-stats-score").text());
			var taps = parseInt($("#game-stats-taps").text());
			var games = parseInt($("#game-stats-games").text());

			if (name.length >= 3 && name.length <= 32)
			{
				$("#game-submit-yes").attr("disabled", "disabled");
				$.post("submit-score.php?name=" + name + "&score=" + score + "&taps=" + taps + "&games=" + games).done(function()
				{
					alert("Your score was submitted.");
					$("#game-submit-no").click();
				}).fail(function(error)
				{
					alert(JSON.stringify(error));
				});
			}
			else
			{
				alert("Please enter a valid name\nthat is 3 to 32 characters long.");
			}

		});

		$("body").on("keydown", function(e)
		{
			if (e.keyCode == 32)
			{
				e.preventDefault();

				if (gameMode == "hard")
				{
					bird.velocity = -10.5;
				}
				else if (gameMode == "alt")
				{
					var offset = 0;
					var doMove = function()
					{
						for (var i = 0; i < pipes.length; i += 1)
						{
							pipes[i].move();
						}
						backgroundPos -= 1;
						$(".game-container").css("background-position", backgroundPos + "px 0px");
						
						offset += 1;
						if (offset <= 100)
						{
							setTimeout(doMove, 1);
						}
					};
					
					doMove();
				}
				else
				{
					bird.velocity = -7.8;
				}
				var taps = parseInt($("#game-stats-taps").text());
				$("#game-stats-taps").text(taps + 1);

				bird.flapWings();
			}
		});
	};

	var createPipe = function()
	{
		var defer = $.Deferred();

		$(".game-game").append("<img class='pipe top' src='" + pipeTopUrl + "'>");
		$(".game-game").append("<img class='pipe bottom' src='" + pipeBottomUrl + "'>");

		var top = $(".game-game .pipe.top").last();
		var bottom = $(".game-game .pipe.bottom").last();
		var gap = separation;
		var yPos;

		var loadCount = 0;
		top.add(bottom).on("load", function()
		{
			loadCount += 1;
			if (loadCount == 2)
			{
				resetY();
				defer.resolve({
					isCollision: isCollision,
					move: move,
					setX: setX,
					getWidth: getWidth,
					shootPipe: shootPipe
				});
			}
		});

		var shootPipe = function(x, y)
		{
			var x1 = getX();
			var x2 = x1 + getWidth();
			var y1 = yPos - gap / 2;
			var y2 = yPos + gap / 2;
			if (x >= x1 && x <= x2)
			{
				if (y <= y1 && top.is(":visible"))
				{
					top.hide();
					return true;
				}
				else if (y >= y2 && bottom.is(":visible"))
				{
					bottom.hide();
					return true;
				}
			}
			return false;
		};

		var isCollision = function(x, y)
		{
			var x1 = getX();
			var x2 = x1 + getWidth();
			var y1 = yPos - gap / 2;
			var y2 = yPos + gap / 2;
			if (x >= x1 && x <= x2)
			{
				if (y <= y1 && top.is(":visible"))
				{
					return true;
				}
				else if (y >= y2 && bottom.is(":visible"))
				{
					return true;
				}
			}
			return false;
		};

		var move = function()
		{
			if (getX() < -top.width())
			{
				top.show();
				bottom.show();
				setX(gameWidth);
				resetY();
			}
			else
			{
				var oldX = getX();
				if (gameMode == "hard")
					setX(oldX - 6);
				else
					setX(oldX - 2);

				var cutoff = gameWidth / 2 - getWidth();
				if (oldX >= cutoff && getX() < cutoff)
				{
					var score = parseInt($("#game-stats-score").text());
					$("#game-stats-score").text(score + 1);
				}
			}
		};

		var resetY = function()
		{
			yPos = getYPos();
			top.css("top", (yPos - top.height() - gap / 2) + "px");
			bottom.css("top", (yPos + gap / 2) + "px");
		};

		var getYPos = function()
		{
			var top = separation;
			var bottom = separation;
			var range = gameHeight - top - bottom;
			return Math.random() * range + top;
		};

		var getX = function()
		{
			return parseFloat(top.css("left"));
		};

		var setX = function(x)
		{
			top.css("left", x + "px");
			bottom.css("left", x + "px");
		};

		var getWidth = function()
		{
			return top.width();
		};

		return defer.promise();
	};

	var backgroundPos = 0;
	var render = function()
	{
		if (gameMode != "alt")
		{
			backgroundPos -= 1;
			$(".game-container").css("background-position", backgroundPos + "px 0px");
			for (var i = 0; i < pipes.length; i += 1)
			{
				pipes[i].move();
			}
			if (gameMode == "fps")
			{
				var value = crosshair.css("left");
				value = parseInt(value) - 2;
				crosshair.css("left", value + "px");
			}
			if (gameMode == "hard")
			{
				bird.velocity += 0.40;
			}
			else
			{
				bird.velocity += 0.25;
			}
			bird.yPos += bird.velocity;
			bird.move();
			var deg = Math.atan(bird.velocity / 8.0) * 180 / Math.PI;
			$("#bird").css("transform", "rotate(" + deg + "deg)");
		}
		else
		{
			if (bird.yPos <= 50 || bird.yPos >= gameHeight - 50 - $(bird.element).height())
			{
				bird.velocity = -bird.velocity;
			}
			bird.yPos += bird.velocity;
			bird.move();
		}

		for (var i = 0; i < pipes.length; i += 1)
		{
			var pipe = pipes[i];
			if (pipe.isCollision(bird.getX(), bird.getY() - 15) || pipe.isCollision(bird.getX(), bird.getY() + 15))
			{
				endGame();
				break;
			}
		}

		if (playingGame)
		{
			window.requestAnimationFrame(render);
		}
	};

	var gameModeClassic = function()
	{
		gameMode = "classic";
		initGame();
	};

	var gameModeUpsideDown = function()
	{
		gameMode = "upsideDown";
		$(".game-container").addClass("upside-down");
		initGame();
	};

	var gameModeHard = function()
	{
		gameMode = "hard";
		initGame();
	};

	var gameModeAlt = function()
	{
		gameMode = "alt";
		initGame();
		bird.velocity = -4;
	}

	var gameModeFps = function()
	{
		gameMode = "fps";
		var tempCrosshair = document.createElement("img");
		tempCrosshair.setAttribute("id", "crosshair");
		tempCrosshair.setAttribute("src", "crosshair.png");
		$(".game-game").append(tempCrosshair);
		$("#crosshair").css("top", 0);
		$("#crosshair").css("left", -100);
		$(".game-game").on("click", aimCrosshair);
		crosshair = $("#crosshair");
		initGame();
	};

	var endGameModefps = function()
	{
		crosshair.remove();
		$(".game-game").off("click", aimCrosshair);
	};

	var aimCrosshair = function(event)
	{
		var offset = $(".game-game").offset();
		var xPos = event.clientX - offset.left - 72;
		var yPos = event.clientY - offset.top - 72;
		crosshair.css("top", yPos);
		crosshair.css("left", xPos);
		pipes[0].shootPipe(xPos + 72, yPos + 72);
		pipes[1].shootPipe(xPos + 72, yPos + 72);
	};

	addEventListeners();
});