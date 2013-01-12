// Model

var arkanoid = arkanoid || {};

arkanoid.model = arkanoid.model || {};

arkanoid.model.Game = function(view){

	/*
	var defaults = {
		width: view.gameArea.width,
		height: view.gameArea.height,
		columnWidth: view.gameArea.width / 13,
		rowHeight: view.gameArea.height / 20,
		currentLevel: 1,
		blocksLeft: 0,
	}
	*/

	var thisModel = this;
	
	
    var balls = new Array();
    var blocks = new Array();

	var columnWidth = view.gameArea.width / 13;
	var rowHeight = view.gameArea.height / 20;
	
	var blocksByColumnsAndRows = new Array(); //[column][row]
	for(var q =0; q < 13;q++){
		blocksByColumnsAndRows.push(new Array(20));
	}
    var paddle = null;
    var gameArea = null;
    
    this.columnWidth = view.width / 13;
    this.rowHeight = view.height / 20;
    
    var currentLevel=1;
	var blocksLeft=0;
	var ballsLeft;
	
	this.gameIsActive;
    
    var levels = JSON.parse('{"levels":[{"level":"1","background":"","blocks":[{"x":"1","y":"2","type":"1","color":"red"},{"x":"2","y":"2","type":"1","color":"red"},{"x":"3","y":"2","type":"1","color":"red"},{"x":"4","y":"2","type":"1","color":"red"},{"x":"5","y":"2","type":"1","color":"red"},{"x":"6","y":"2","type":"1","color":"red"},{"x":"7","y":"2","type":"1","color":"red"},{"x":"8","y":"2","type":"1","color":"red"},{"x":"9","y":"2","type":"1","color":"red"},{"x":"10","y":"2","type":"1","color":"red"},{"x":"11","y":"2","type":"1","color":"red"},{"x":"12","y":"2","type":"1","color":"red"},{"x":"13","y":"2","type":"1","color":"red"},{"x":"1","y":"3","type":"1","color":"blue"},{"x":"2","y":"3","type":"1","color":"blue"},{"x":"3","y":"3","type":"1","color":"blue"},{"x":"4","y":"3","type":"1","color":"blue"},{"x":"5","y":"3","type":"1","color":"blue"},{"x":"6","y":"3","type":"1","color":"blue"},{"x":"7","y":"3","type":"1","color":"blue"},{"x":"8","y":"3","type":"1","color":"blue"},{"x":"9","y":"3","type":"1","color":"blue"},{"x":"10","y":"3","type":"1","color":"blue"},{"x":"11","y":"3","type":"1","color":"blue"},{"x":"12","y":"3","type":"1","color":"blue"},{"x":"13","y":"3","type":"1","color":"blue"},{"x":"1","y":"4","type":"1","color":"orange"},{"x":"2","y":"4","type":"1","color":"orange"},{"x":"3","y":"4","type":"1","color":"orange"},{"x":"4","y":"4","type":"1","color":"orange"},{"x":"5","y":"4","type":"1","color":"orange"},{"x":"6","y":"4","type":"1","color":"orange"},{"x":"7","y":"4","type":"1","color":"orange"},{"x":"8","y":"4","type":"1","color":"orange"},{"x":"9","y":"4","type":"1","color":"orange"},{"x":"10","y":"4","type":"1","color":"orange"},{"x":"11","y":"4","type":"1","color":"orange"},{"x":"12","y":"4","type":"1","color":"orange"},{"x":"13","y":"4","type":"1","color":"orange"}]},{"level":"2","background":"","blocks":[{"x":"3","y":"6","type":"3","color":"gray"},{"x":"4","y":"6","type":"3","color":"gray"},{"x":"5","y":"6","type":"3","color":"gray"},{"x":"6","y":"6","type":"3","color":"gray"},{"x":"7","y":"6","type":"3","color":"gray"},{"x":"8","y":"6","type":"3","color":"gray"},{"x":"9","y":"6","type":"3","color":"gray"},{"x":"10","y":"6","type":"3","color":"gray"},{"x":"11","y":"6","type":"3","color":"gray"},{"x":"12","y":"6","type":"3","color":"gray"},{"x":"13","y":"6","type":"3","color":"gray"},{"x":"11","y":"4","type":"1","color":"orange"},{"x":"6","y":"4","type":"2","color":"yellow"},{"x":"8","y":"4","type":"2","color":"yellow"}]}]}');
    
    var maxLevelCount = levels['levels'].length;

    this.start = function(){
        paddle = new arkanoid.model.Paddle(view.width/2, Math.floor(view.height*6/7));
        ballsLeft = 3;
        initLevel(currentLevel);

        this.gameIsActive=true;
    }
    
    function initLevel(levelNo){
    	if(levelNo > maxLevelCount){
    		return;
    	}
    	currentLevel = levelNo;
    	
    	var blocksJSON = levels['levels'][currentLevel-1]['blocks'];

        var block;
		var i;
		var j;
		var vects;
        for(i = 0; i < blocksJSON.length; i++){
			block = new arkanoid.model.Block(
				blocksJSON[i]['x'], blocksJSON[i]['y'],
				blocksJSON[i]['color'], blocksJSON[i]['type'],
				columnWidth, rowHeight, i);
			blocks.push(block);
			if(block.type != 3)
				blocksLeft++;
			blocksByColumnsAndRows[blocksJSON[i]['x']-1][blocksJSON[i]['y']-1] = block;

       }

        view.levelInfo = currentLevel;
        view.ballsLeft = ballsLeft;
        view.blocksLeft = blocksLeft;

        view.init({
            blocks: blocks,
            balls: balls,
            paddle: paddle
        });
        view.updateTexts();
    }
    
    this.doATick = function(){

    	if (blocksLeft == 0 ){
    		levelCompleted();
    		return;
    	}
    	if (balls.length == 0 && ballsLeft == 0){
    		this.endGame();
    		return;
    	}
    	if(balls.length == 0 && ballsLeft > 0){		
    	    balls.push(new arkanoid.model.Ball(paddle.x,Math.floor(paddle.y -11),'white'));    	    
    	    paddle.ballThatsStuckOnPaddle = balls[0];
    	    ballsLeft --;
    	    view.ballsLeft--;
    	    view.updateTexts();
    	    view.addBall(balls[0]);
			/*view.init({
				blocks: null,
				balls: balls,
				paddle: null
			});*/
    	}
    
        // move paddle
        if (paddle.direction!==0){
            paddle.countNewPosition();
            paddle.direction = 0;
        }
        
        // move balls
        for(var i = 0; i< balls.length; i++){
            if (balls[i].speed !==0){
                balls[i].setMovement();
                checkCollisions(balls[i]);
            }
            balls[i].countNewPosition();
        }
        // remove balls that are not active anymore

        for ( i = balls.length-1; i>=0; i--){
        	if (!balls[i].active){
        		removeBall(i);
        	}	
        }
        
        view.drawSituation({
            blocks: blocks,
            balls: balls,
            paddle: paddle
        });            

    }
   
    // direction is -1, 0 or 1 depending on direction to move
    this.suggestPaddleMove=function(direction){
        paddle.setMovement(direction);
        if(paddle.x - paddle.width / 2 + paddle.dX <0){
        	paddle.dX=0;
        	return
        }
        
        if(paddle.x + paddle.width / 2 + paddle.dX > view.width){
        	paddle.dX = 0;
        	return;
        }

        for (var i = 0; i<balls.length; i++){
            if(paddle.ballThatsStuckOnPaddle == balls[i]){
                balls[i].dX = paddle.dX;
            }else if(distanceFromPointToObject(paddle, balls[i].x, balls[i].y, -paddle.dX, 0).closestToHit <= balls[i].radius){
                paddle.setMovement(0);
                try{
                    paddle.ballThatsStuckOnPaddle.dX = 0; // only one ball can be stuck at time
                }catch(e){}
            }
        }
    }
	
	// Called by controller
    this.enterPressed = function(){
        paddle.enterPressed();
    }
    
    function removeBall(index){
		view.removeBall(index);
		balls.splice(index,1);
    }
    
	this.endGame = function(){
        this.gameIsActive=false;
	}
	
	function endLevel(){
	}
	
	function levelCompleted(){
		var i;
		for(i=0; i<balls.length; i++){
			removeBall(i);
			ballsLeft++; // you can keep all the balls you have active
		}
		view.clearObjects();
		balls = new Array();
		blocks = new Array();
		blocksByColumnsAndRows = new Array(); //[column][row]
		for(var q =0; q < 13;q++){
			blocksByColumnsAndRows.push(new Array(20));
		}
		if(currentLevel < maxLevelCount){
			currentLevel++;
			initLevel(currentLevel);
		}else{
			thisModel.endGame();
			return;
		}
	}
	
    function checkCollisions(ball){
        if(ball.x + ball.dX + ball.radius >= view.width){
            ball.direction = 180- ball.direction;
            ball.recalculate();
            ball.setMovement();
        }
        if(ball.x + ball.dX - ball.radius <=0){
            ball.direction = 180- ball.direction;
            ball.recalculate();
            ball.setMovement();
        }


        if(ball.y + ball.dY - ball.radius > view.height){
        	ball.speed = 0;
        	ball.active = false;

        }
        if(ball.y + ball.dY - ball.radius <=0){
            ball.direction = -ball.direction;
            ball.recalculate();
            ball.setMovement();
        }
        
        // Check if paddle is on the way

        var distn;
        var closest;
        closest = distanceFromPointToObject(paddle, ball.x, ball.y, paddle.dX, 0);

        if (closest.closestToHit <= ball.radius){
            var collXComp = closest.vectorOfCollision.getNormalRH().projection(ball.directionVector);
            var collYComp = closest.vectorOfCollision.projection(ball.directionVector);
            var newDirection = collXComp.add(collYComp.scalar(-1));
            
            ball.direction=newDirection.getAngle();
            ball.dX=0;
            ball.dY=0;
            ball.recalculate();
            ball.setMovement();
            
            // tell paddle that it has been hit
            paddle.ballHitYou(ball, closest.vectorIndexToHit);
            // if ball hit the paddle, then it won't hit blocks, so we return
            return;
        }
        
        // to speed things up, we first find out in which column and row ball is now
		// and then we only look for collisions with blocks around that cell
		// we assume that method works, so in current cell, there is not active block
		var col = Math.floor(ball.x / columnWidth)+1;
		var row = Math.floor(ball.y / rowHeight)+1;
		var closeBlocks = new Array();
		var i;
		var j;
		for(i=col-2;i<=col;i++){
			for (j=row-2; j<=row;j++){
				if(i>=0 && i < blocksByColumnsAndRows.length
				&& j>=0 && j < blocksByColumnsAndRows[i].length){
					if(blocksByColumnsAndRows[i][j] && blocksByColumnsAndRows[i][j].active)
						closeBlocks.push(blocksByColumnsAndRows[i][j]);
				}
			}
		}
		
	
		closest = null;
		var currentObject = null;
		var chosenBlock=null;
		for(i = 0; i< closeBlocks.length; i++){
			currentObject = distanceFromPointToObject(closeBlocks[i], ball.x, ball.y, ball.dX, ball.dY);
			if(!closest){
				closest = currentObject;
				chosenBlock = closeBlocks[i];
			}else if(closest.closestToHit > currentObject.closestToHit){
				closest = currentObject;
				chosenBlock = closeBlocks[i];
			}

		}
		
		if (closest && closest.closestToHit <= ball.radius){
			var collXComp = closest.vectorOfCollision.getNormalRH().projection(ball.directionVector);
			var collYComp = closest.vectorOfCollision.projection(ball.directionVector);
			var newDirection = collXComp.add(collYComp.scalar(-1));
			
			ball.direction=newDirection.getAngle();
			
			ball.dX=0;
			ball.dY=0;
			ball.speed += .1;
			ball.recalculate();
			ball.setMovement();
			chosenBlock.pop(closest.vectorIndexToHit, ball);
			if(!chosenBlock.active) {
				view.removeBlock(chosenBlock.index);
				blocksLeft--;
			}
			return;
		}		
        
    }
  

	// Calculates minimum distance between object and (point + delta)
	// Returns punch of stuff
    function distanceFromPointToObject(object, x, y, dX, dY){
        var closestToHit;
        var vectorThatBallHit;
        var vectorOfCollision;
        var vectorIndexToHit;
        var distanceOfCurrent;
        var e;
        var first = true;
        
        vects = object.getVectors();
        
        for (var k = 0; k<vects.length; k++){

            distanceOfCurrent = vects[k].shortestDistanceFromPoint(x-dX, y-dY).length();
			distanceOfCurrent = vects[k].shortestDistanceFromPoint(x+dX, y+dY).length();

            if (first || closestToHit > distanceOfCurrent){
                closestToHit = distanceOfCurrent;
                vectorIndexToHit = k;
                vectorOfCollision = vects[k].shortestDistanceFromPoint(x, y);
                first =false;
            }
        }
        
        return {
            closestToHit: closestToHit,
            vectorIndexToHit: vectorIndexToHit,
            vectorOfCollision: vectorOfCollision
        }
    }
}
