$(document).ready(function()
{
	var playingGame = false;
	var gameWidth = $(".game-container").width();
	var gameHeight = $(".game-container").height();
	var pipeTopUrl = "pipe-top.png";
	var pipeBottomUrl = "pipe-bottom.png";
	var separation = 160;
	var pipes = [];
	var bird = {
		init: function()
		{
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
		playingGame = false;
		alert("You died!");
		$(".game-game").hide();
		$(".game-submit").show();
	};
	
	var addEventListeners = function()
	{
		$("#new-game").on("click", function()
		{
			$(".game-menu").fadeOut(function()
			{
				initGame();
			});
		});
		
		$("#game-submit-no").on("click", function()
		{
			$(".game-submit").hide();
			$(".game-menu").fadeIn();
		});
		
		$("body").on("keydown", function(e)
		{
			if (e.keyCode == 32)
			{
				bird.velocity = -8;
				
				var taps = parseInt($("#game-stats-taps").text());
				$("#game-stats-taps").text(taps + 1);
				
				(new Audio("flap.wav")).play();
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
					getWidth: getWidth
				});
			}
		});
		
		var isCollision = function(x, y)
		{
			var x1 = getX();
			var x2 = x1 + getWidth();
			var y1 = yPos - gap / 2;
			var y2 = yPos + gap / 2;
			return x >= x1 && x <= x2 && (y <= y1 || y >= y2);
		};
		
		var move = function()
		{
			if (getX() < -top.width())
			{
				setX(gameWidth);
				resetY();
			}
			else
			{
				var oldX = getX();
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
	
	var getYPos = function()
	{
		var top = 100;
		var bottom = 100;
		var range = gameHeight - top - bottom;
		return Math.random() * range + top;
	};
	
	var backgroundPos = 0;
	var render = function()
	{
		backgroundPos -= 1;
		$(".game-container").css("background-position", backgroundPos + "px 0px");
		for (var i = 0; i < pipes.length; i += 1)
		{
			pipes[i].move();
		}
		
		bird.velocity += 0.25;
		bird.yPos += bird.velocity;
		bird.move();
		var deg = Math.atan(bird.velocity / 8.0) * 180 / Math.PI;
		$("#bird").css("transform", "rotate(" + deg + "deg)");
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
	
	addEventListeners();
});