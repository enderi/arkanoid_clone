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
