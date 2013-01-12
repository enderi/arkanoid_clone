/*
 *  Arkanoid clone
 */

// View
var arkanoid = arkanoid || {};

arkanoid.view = arkanoid.view || {};

arkanoid.view.Gameview = function(gameArea){
	this.gameArea = gameArea;
	this.width = gameArea.width;
	this.height = gameArea.height;
    
	this.levelInfo;
	var levelInfoTextbox;

	this.blocksLeft;
	var blocksLeftTextbox;

	this.ballsLeft;
	var ballsLeftTextbox;
   	
    /*
     * Gamearea is divided to 13 columns and 20 rows
     * Blocks are then placed based on these rows and cols
     */
    var colWidth = this.width / 13;
    var rowHeight = this.height / 20;

    var ballObjectArray = new Array();
    var blockObjectArray = new Array();
    var paddleObject;
			
    this.drawSituation = function(gameSituation){
        var vectors;
        var i;
        var j;
        
        // redraw balls (update position)
        for(i=0; i<gameSituation.balls.length; i++){
            ballObjectArray[i].attr({cx: gameSituation.balls[i].x, cy: gameSituation.balls[i].y})
        }
        
        // redraw paddle
        if(paddleObject)
	        paddleObject.remove();
        drawPaddle(gameSituation.paddle);
        
    }
    this.init = function(gameSituation){
    	if(gameSituation.balls){ 
    		drawBalls(gameSituation.balls);
    		ballsLeftTextbox = gameArea.text(this.width-40, 
				this.height -20, 
				"").attr("fill","#f1f1f1");
    	}
    	if(gameSituation.paddle){ 
    		drawPaddle(gameSituation.paddle);
    	}
    	if(gameSituation.blocks){
    		drawBlocks(gameSituation.blocks);
    		blocksLeftTextbox = gameArea.text(this.width/2, 
					this.height -20, 
					"").attr("fill","#f1f1f1");
    	}
		
		levelInfoTextbox = gameArea.text(20,this.height - 20,
				"").attr("fill","#f1f1f1");
    }
    
	this.clearObjects = function(){
		ballObjectArray = new Array();
		blockObjectArray = new Array();
		paddleObject = {};

		this.gameArea.clear();
		
	}
	
	this.drawVector = function(vector, color){
		vectorToStage(vector, color, this.gameArea);
	}

	this.removeBall = function(index){
		ballObjectArray[index].remove();
		ballObjectArray.splice(index,1);
	}
	this.removeBlock = function(index){
		blockObjectArray[index].remove();
		this.blocksLeft--;
		this.updateTexts();
	}
	
	this.updateTexts = function(){
		levelInfoTextbox.attr({text: "Level " + this.levelInfo});
		blocksLeftTextbox.attr({text: this.blocksLeft + " blocks left"});
		ballsLeftTextbox.attr({text: this.ballsLeft + " balls left"});
	}
	
	this.addBall = function(ball){
		ballObjectArray.push(gameArea.circle(ball.x,
			ball.y, ball.radius).attr({fill: 'white'}));
	}
	
	function drawPaddle(paddle){
        paddleObject = new gameArea.set();
        var vectors = paddle.vectors;
        for (var i=0; i < vectors.length; i++){
            paddleObject.push(vectorToStage(vectors[i], 'orange', gameArea));
        }
    }
    
    function drawBalls(balls){
        for (var i=0; i < balls.length; i++){
            ballObjectArray.push(gameArea.circle(balls[i].x, 
            	balls[i].y, 
            	balls[i].radius).attr({fill: 'white'}));
        }        
    }
    
    function drawBlocks(blocks){
        for(var i=0; i<blocks.length; i++){
            blockObjectArray.push(gameArea.rect((blocks[i].column-1)*colWidth, 
            		(blocks[i].row-1)*rowHeight, 
            		colWidth,
            		rowHeight, 
            		5, i).attr({fill: blocks[i].color}));
        }
    }
    
    function vectorToStage(vector, color, paper){
        return paper.path('M'+vector.getX()+","+vector.getY()+"L"+(vector.getX()+vector.compX())+","+(vector.getY()+vector.compY())).attr({stroke: color});
    }
}

// Model
arkanoid.model = arkanoid.model || {};

arkanoid.model.Game = function(view){
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

// Controller
arkanoid.controller = {};

arkanoid.controller.Gamecontroller = function(model){
    var arkanoidController = this;
    this.start = function(){
        model.start();
        requestAnimFrame(this.tick);
    }
    
    this.tick = function (){
        if(arkanoid.controller.Gamecontroller.keyIsDown('left')){
            model.suggestPaddleMove(-1);
        }
        
        if(arkanoid.controller.Gamecontroller.keyIsDown('right')){
            model.suggestPaddleMove(1);
        }
        
        if(arkanoid.controller.Gamecontroller.keyIsDown('enter')){
            model.enterPressed();
        }
        
        model.doATick();

        if (model.gameIsActive){
        	requestAnimFrame(arkanoidController.tick);
        }else{
        	console.log("ending game");
        	return;
        }
        
    }
    
}


// Tracking keys
arkanoid.controller.Gamecontroller.keyIsDown = (function(){
    var keys = {
        37: "left",
        39: "right",
        40: 'down',
        38: 'up',
        13: "enter"
    };
    
    var down = {};

    $(document).keydown(function(e){
        var key = e.keyCode;
        down[keys[key]] = true;
        
        if (keys[key])
            return false; // block scrolling and other unwanted behaviour
    });

    $(document).keyup(function(e){
        var key = e.keyCode;
        down[keys[key]] = false;    
    });
    
    return function(key){
        return !!down[key];
    };
})();


// Two-dimensional vector (with starting point) class
arkanoid.model.V = function(x_, y_, x_component_, y_component_){
    var x = x_;
    var y = y_;
    var x_component = x_component_;
    var y_component = y_component_;
    this.x2 = x + x_component;
    this.y2 = y + y_component;
    
    this.angle = null;
    
    this.getX = function(){ return x; }
    this.getY = function(){ return y; }
    
    this.setX = function(x_){ x = x_; }
    this.setY = function(y_){ y = y_; }
    

    this.compX = function(){ return x_component; }
    this.compY = function(){ return y_component; }

    this.setCompX = function(xComp){ x_component = xComp; }
    this.setCompY = function(yComp){ y_component = yComp; }
    
    this.subtract = function(v){ 
        return new arkanoid.model.V(x, y, x_component - v.compX(), y_component - v.compY());
    }
    this.add = function(vector){ 
        return new arkanoid.model.V(x, y, x_component + vector.compX(), y_component + vector.compY());
    }

    this.scalar = function(scalar){
        return new arkanoid.model.V(x, y, x_component*scalar, y_component*scalar);
    }

    this.dotProduct = function(vector){
        return vector.compX() * x_component + vector.compY() * y_component;
    }

    this.normalize = function(){
        return this.scalar(1/this.length());
    }
    
    this.getNormalRH = function(){
        // remove scalar-part when working
        return new arkanoid.model.V(x+(x_component)/2, y+(y_component)/2, -y_component, x_component);
    }
    
    this.doesDotProjectOnVector = function(x_2, y_2){
        var v2 = this.projection(new arkanoid.model.V(x_2, y_2, x - x_2, y - y_2));

        if(this.dotProduct(v2)>0)
            return false;
        if (v2.length() > this.length())
            return false;
        return true;
    }

    // returns the vector
    this.distanceOfDot = function(x_2, y_2){
        var v = new arkanoid.model.V(x_2,y_2,x-x_2,y-y_2);
        v= v.subtract(this.projection(new arkanoid.model.V(x_2,y_2,x-x_2,y-y_2)));
        return v;
        
    }

    this.shortestDistanceFromPoint = function( px,py){
        
        var v3 = new arkanoid.model.V(x, y, px-x, py-y);

        var dp = v3.dotProduct(this);
        
        if(dp<0){
            //console.log("catch1"+v3.toString());
            
            return v3;
        }
        var v4 = new arkanoid.model.V(this.x2,this.y2,px-this.x2, py-this.y2);
        dp= v4.dotProduct(this);
        if(dp>0){
            //console.log("catch2"+v4.toString());
            return v4;
        }
        //console.log("catch3"+this.toString());
        
        return this.distanceOfDot(px,py);
    }

    this.getAngle = function(){
        if(this.angle){
            return this.angle;
        }
        if(x_component === 0) {
            if (y_component<0)
                this.angle = 270;
            else
                this.angle = 90;
        }
        if(x_component <0){
            if (y_component === 0){
                this.angle = 180;
            }
            else if(y_component <0){
                this.angle = 180+Math.atan(y_component/x_component)*180/Math.PI;
            }
            else {
                this.angle = 180+Math.atan(y_component/x_component)*180/Math.PI;
            }
        }
        if(x_component >0){
            if (y_component ==0){
                this.angle = 0;
            }
            else if(y_component <0){
                
                this.angle = Math.atan(y_component/x_component)*180/Math.PI;
            }
            else{
                this.angle = Math.atan(y_component/x_component)*180/Math.PI;
            }
        }
        if (this.angle < 0)
            this.angle += 360;
        return this.angle;
    }
    this.projection = function(vector){
        return this.scalar(vector.dotProduct(this) / this.dotProduct(this));
    }

    this.length = function(){
        return Math.sqrt(x_component*x_component+y_component*y_component);
    }

    this.toString = function (){
        return "( " + x + " : " + y + "  ) -> " + x_component + " + " + y_component;
    }
    
}
