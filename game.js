$(document).ready(function()
{
	var gameWidth = $(".game-container").width();
	var gameHeight = $(".game-container").height();
	var pipeTopUrl = "pipe-top.png";
	var pipeBottomUrl = "pipe-bottom.png";
	var separation = 100;
	var pipes = [];
	
	var addEventListeners = function()
	{
		$("#new-game").on("click", function()
		{
			$(".game-menu").fadeOut(function()
			{
				$(".game-game").show();
				pipes.push(createPipe());
				pipes[0].setX(gameWidth);
				pipes.push(createPipe());
				pipes[1].setX(gameWidth * 1.5 + pipes[1].getWidth() / 2);
				window.requestAnimationFrame(render);
			});
		});
	};
	
	var createPipe = function()
	{
		$(".game-game").append("<img class='pipe top' src='" + pipeTopUrl + "'>");
		$(".game-game").append("<img class='pipe bottom' src='" + pipeBottomUrl + "'>");
		
		var top = $(".game-game .pipe.top").last();
		var bottom = $(".game-game .pipe.bottom").last();
		var yPos = getYPos();
		var gap = 100;
		top.css("top", yPos - top.height() - gap / 2);
		bottom.css("top", yPos + gap / 2);
		
		var isCollision = function(x, y)
		{
			return false;
		};
		
		var move = function()
		{
			if (getX() < -top.width())
			{
				setX(gameWidth);
			}
			else
			{
				setX(getX() - 1);
			}
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
		
		return {
			isCollision: isCollision,
			move: move,
			setX: setX,
			getWidth: getWidth
		};
	};
	
	var getYPos = function()
	{
		var top = 50;
		var bottom = 200;
		var range = gameHeight - top - bottom;
		return Math.random() * range + top;
	};
	
	var movePipe = function(pipe)
	{
		if (pipe.getX() < -pipe.getWidth())
		{
			pipe.setX(gameWidth);
			pipe.set
		}
		else
		{
			pipe.setX(pipe.getX() - 3);
		}
	};
	
	var backgroundPos = 0;
	var render = function()
	{
		backgroundPos -= 0.5;
		$(".game-container").css("background-position", backgroundPos + "px 0px");
		for (var i = 0; i < pipes.length; i += 1)
		{
			pipes[i].move();
		}
		
		window.requestAnimationFrame(render);
	};
	
	addEventListeners();
});