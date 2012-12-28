
function vectorToStage(vector, color){	
	new Path()
		.moveTo(vector.getX(), vector.getY())
		.lineTo(vector.getX() + vector.compX(), vector.getY() + vector.compY())
		.closePath()
		.stroke(color, 2)
		.addTo(stage);
}

var defaults = {
	width: stage.width,
	height: stage.height,
	colWidth: stage.width / 13,
	rowHeight: stage.height / 20
}


var Arkanoid={};

Arkanoid.logic = (function(){
  var objects = new Array();
	var balls = new Array();
	var blocks = new Array();
	var paddle = {};
	
	var latestTime = new Date().getTime();
	
	
	
	function initialize(){

		paddle = new Paddle();
		stage.on('pointermove', function(e){
			if (e.target !== stage) return;
			paddle.changePosition(e.stageX);

		});
		balls.push(addBall(paddle.x+paddle.width/4*3, paddle.y-10));
		
		objects.push(new HittableObject(paddle));
		objects.push(new HittableObject(new GameArea()));		
		
		addBlocks(1);
		
		
		for ( i=0; i < balls.length; i++){
			balls[i].setDirection(-45);
			balls[i].setSpeed(.5, new Date().getTime());
		}
	latestTime = new Date().getTime();
		stage.on('tick', function (){
			timingDevice();
		});
	}
	
	function addBall(x,y,direction){
		var b = new Ball(x, y, direction);
		b.object.fill('white').addTo(stage);
		return b;
	}
	
	function stopBall(index){
//		balls[index].setSpeed(0, new Date().getTime());
		balls.splice(index,1);
	}
	
	// gamearea is divide into 13 columns and 50 rows
	function addBlocks(levelNumber){
		var blocksJSON = levels['levels'][levelNumber-1]['blocks'];
		
		for(var i = 0; i < blocksJSON.length; i++){
				blocks.push(new Block(blocksJSON[i]['x'], 
								blocksJSON[i]['y'], 
								blocksJSON[i]['type'],
								blocksJSON[i]['color']));
		}
		
		for(i = 0; i< blocks.length; i++){
			objects.push(new HittableObject(blocks[i]));
		}
				
	}
	
	function timingDevice(){
		var currentTime = new Date().getTime();
		
		var hit=false;	
		
		var dX = 0;
		var dY = 0;
		var bX = 0;
		var bY = 0;
		
		var i=0;
		var e=0;
		var k=0;
		var o=0;
		var vects;
		var numberOfBalls=balls.length;
		
		var indexesToLoop = new Array();
		var diffX;
		var diffY;
		
		for ( i=0; i < balls.length; i++){
			
			dX = balls[i].getDeltaX(currentTime-latestTime);
			dY = balls[i].getDeltaY(currentTime-latestTime);
			bX = balls[i].getX();
			bY = balls[i].getY();
			
			balls[i].setPosition ({x: bX+dX, y: bY+dY});
			// *** we handle paddle hit separately, because of non-trivial bounces
			// first check if paddle is about to hit the ball, or vice versa
			vects = objects[0].getVectors();
			if(vects[0].getX() <= balls[i].getX()-balls[i].diameter &&
				vects[0].getX() + vects[0].compX() >= balls[i].getX()+balls[i].diameter &&
				balls[i].getY() + balls[i].diameter >= vects[0].getY() && 
				balls[i].getY() + balls[i].diameter <= vects[0].getY() + vects[1].compY()/2){

					balls[i].setY(balls[i].getY()  - 2*( Math.abs( vects[0].getY() - balls[i].diameter - balls[i].getY())));
					// then check if we need to adjust balls direction
					if(balls[i].getX() < vects[0].getX() + vects[0].compX()/4){
						balls[i].setDirection(-165);
					}else if(balls[i].getX() < vects[0].getX() + vects[0].compX()/2){
						balls[i].setDirection(-135);
					} else if(balls[i].getX() >= vects[0].getX() + vects[0].compX()/4*3){
						balls[i].setDirection(-15);
					} else if(balls[i].getX() > vects[0].getX() + vects[0].compX()/2){
						balls[i].setDirection(-45);
					}

					balls[i].setY(vects[0].getY()-balls[i].diameter);
				}
				
			
			
			
			// *** End of Paddle part
			for ( e=1; e < objects.length && balls.length == numberOfBalls ; e++){
				if (objects[e].isActive()){
					vects = objects[e].getVectors();
					indexesToLoop=[];
					if (balls[i].x_component > 0){
						indexesToLoop.push(1);
					}else if(balls[i].x_component < 0){
						indexesToLoop.push(3);
					}
					
					if (balls[i].y_component > 0){
						indexesToLoop.push(0);
					}else if(balls[i].y_component < 0){
						indexesToLoop.push(2);		
					}
					
					for (o = 0; o<indexesToLoop.length; o++){
						k=indexesToLoop[o];
						
						if (vects[k].compX()!=0){
							if (Math.abs(vects[k].getY() - balls[i].getY()) - balls[i].diameter <= 0 &&
									(balls[i].getX() - vects[k].getX() + balls[i].diameter >= 0  &&
									balls[i].getX() - balls[i].diameter - vects[k].getX()-vects[k].compX() <= 0)) {
								if (balls[i].y_component > 0){
									balls[i].setY(balls[i].getY()  - 2*( Math.abs( vects[k].getY() - balls[i].diameter - balls[i].getY())));
								}else{
									balls[i].setY(balls[i].getY()  + 2*( Math.abs( vects[k].getY() + balls[i].diameter - balls[i].getY())));
								}
								
								balls[i].y_component=-balls[i].y_component;
								objects[e].youBeenHit(k,i);
							}
						}else{
							if (Math.abs(vects[k].getX() - balls[i].getX()) - balls[i].diameter <= 0 &&
									balls[i].getY() - vects[k].getY() + balls[i].diameter >= 0  &&
									balls[i].getY() - balls[i].diameter - vects[k].getY() - vects[k].compY() <= 0) {
	
								if (balls[i].x_component > 0){
									balls[i].setX(balls[i].getX()  - 2*( Math.abs( vects[k].getX() - balls[i].diameter - balls[i].getX())));
								}else{
									balls[i].setX(balls[i].getX()  + 2*( Math.abs( vects[k].getX() + balls[i].diameter - balls[i].getX())));
								}

								balls[i].x_component=-balls[i].x_component;
								objects[e].youBeenHit(k,i);
							}
						}
					}
				}
			}
			if(balls.length == numberOfBalls) balls[i].draw();
		}
		latestTime = currentTime;
	}
	
	return {
		initialize: initialize,
		stopBall: stopBall
	}
})();



var levels;
function addLevels(data){
	//levels = JSON.parse(data);
	levels=JSON.parse(data['levels']);
}
var popup = new Group().addTo(stage).attr({ x: 200, y: 120});

popup.on('click',function(){	
	Arkanoid.logic.initialize();
	(this).destroy();
});

new Rect(0, 0, 200, 100, 10)
  .fill(gradient.linear(0, ['red', 'yellow']))
  .stroke('green', 2)
  .addTo(popup);

new Text('Go!').attr({
  textFillColor: 'white', fontFamily: 'Arial', fontSize: 60, x: 50, y: 30
}).addTo(popup);

/*
* Object
*/

function HittableObject(item){
	this.getVectors = function(){
		return item.getVectors();
	}
	
	this.youBeenHit = function(index, ballIndex){
		// your vector index has been hit
		item.pop(index, ballIndex);
	}
	
	this.isActive = function(){
		return item.isActive();
	}	
}

function Block(col_, row_, type_, color_){
	var col = col_;
	var row = row_;
	var type = type_;
	var color = color_;
	var hits=0;
	
	var active = true;
	
	var x1 = (col-1) * defaults.colWidth;
	var y1 = (row-1) * defaults.rowHeight;
	var x2 = x1 + defaults.colWidth;
	var y2 = y1 + defaults.rowHeight;
	
	var vectors = new Array();
	
	vectors.push(		new V(x1, y1, defaults.colWidth, 0));
	vectors.push(		new V(x1, y1, 0, defaults.rowHeight));
	vectors.push(		new V(x1, y2, defaults.colWidth, 0));
	vectors.push(		new V(x2, y1, 0, defaults.rowHeight));
	
	this.object = new Rect(x1, y1, defaults.colWidth, defaults.rowHeight, 5).attr({
        fillColor: color,
        fillGradient: gradient.linear(0, ['rgba(0,0,0,.2)', 'rgba(0,0,0,0)'])
      }).addTo(stage);
	
	this.pop = function(index, ballIndex){
		hits++;
		if (type == 1 ){
			active=0;
			this.object.destroy();
		}
	}
	
	this.isActive = function(){ return active; };
	
	this.getVectors = function(){
	// return two horizontal vectors and two vertical
		
		return vectors;		
	}
	
}

/*
* Ball
*/

function Ball(x,y, direction){
	this.starting_x = x;
  this.starting_y = y;
	this.x = x;
	this.y = y;

	this.diameter = 10;
	this.speed = 0;

	this.timeSet = (new Date).getTime();
	this.directionInRads = direction * Math.PI / 180;  // radians
			
	this.x_component = 0; // Math.cos(this.directionInRads) * this.speed;
	this.y_component = 0; // Math.sin(this.directionInRads) * this.speed;

	this.object = new Circle(this.x, this.y, this.diameter);

// Getters

	this.getDeltaX = function(time){ return this.x_component * (time); }
	this.getDeltaY = function(time){ return this.y_component * (time); }

	this.getX = function(time){ return this.x; }
	this.getY = function(time){ return this.y; }

// Getters
	this.setBasePosition = function(position){
		this.starting_x = position.x;
		this.starting_y = position.y;
	}
	
	this.setDirection = function(direction){
		this.directionInRads = direction * Math.PI / 180;  // radians
		this.x_component = Math.cos(this.directionInRads) * this.speed;
		this.y_component = Math.sin(this.directionInRads) * this.speed;
	}
	this.setSpeed = function(speed, timeOfChange){
		this.speed=speed;
		
		this.x_component = Math.cos(this.directionInRads) * this.speed;
		this.y_component = Math.sin(this.directionInRads) * this.speed;
	}
	this.setPosition = function(position){
		this.x = position.x;
		this.y = position.y;
	}
	this.setX = function(position){
		this.x = position
	}
	this.setY = function(position){
		this.y = position
	}
	
	this.draw = function(){
		this.object.attr({x: this.x, y: this.y});
	}
}
// end Ball


/*
*  Paddle
*/


function Paddle(){
	this.y=defaults.height-50;
	this.x=defaults.width/2-50;
	this.width=100;
	this.height = 20;
	this.object = new Rect(this.x,this.y,this.width, this.height, 5).attr({
        fillColor: '#0077FF',
        fillGradient: gradient.linear(0, ['rgba(0,0,0,.2)', 'rgba(0,0,0,0)'])
      }).addTo(stage);
	  
	var vectors = [new V(this.x, this.y, this.width, 0),
									new V(this.x, this.y, 0, this.height),
									new V(this.x, this.y+this.height, this.width, 0),
									new V(this.x + this.width, this.y, 0, this.height)];
	
	this.pop = function(index, ballIndex){
		
	}
	
	this.changePosition = function(x){
		this.x=x-this.width/2;
		vectors = [new V(this.x, this.y, this.width, 0),
									new V(this.x, this.y, 0, this.height),
									new V(this.x, this.y+this.height, this.width, 0),
									new V(this.x + this.width, this.y, 0, this.height)];
		this.object.attr({x: this.x});
	}
	this.isActive = function(){ return true; };
	
	this.getVectors = function(){
	// return two horizontal vectors and two vertical
		return vectors;		
	}
}

function GameArea(){
	var vectors = new Array();
	vectors.push(		new V(0, defaults.height,defaults.width, 0));
	vectors.push(		new V(defaults.width, 0, 0, defaults.height));
	vectors.push(		new V(0, 0, defaults.width, 0));
	vectors.push(		new V(0, 0, 0, defaults.height));

	this.pop = function(index, ballIndex){
		if (index == 0){
			// remove ball from the balls array
			Arkanoid.logic.stopBall(ballIndex);
		}
	}
	
	this.isActive = function(){ return true; };
	
	this.getVectors = function(){

		return vectors;		
	}
}


function V(x_, y_, x_component_, y_component_){
	var x = x_;
	var y = y_;
	var x_component = x_component_;
	var y_component = y_component_;

	this.getX = function(){ return x; }
	this.getY = function(){ return y; }
	
	this.compX = function(){ return x_component; }

	this.compY = function(){ return y_component; }

	this.subtract = function(vector){ 
		return new V(x, y, x_component - vector.compX(), y_component - vector.compY());
	}
	this.add = function(vector){ 
		return new V(x, y, x_component + vector.compX, y_component + vector.compY);
	}

	this.scalar = function(scalar){
		return new V(x, y, x_component*scalar, y_component*scalar);
	}

	this.dotProduct = function(vector){
		return vector.compX() * x_component + vector.compY() * y_component;
	}
	
	this.doesDotProjectOnVector = function(x_2, y_2){
		var v2 = this.projection(new V(x_2, y_2, x - x_2, y - y_2));

		if(this.dotProduct(v2)>0)
			return false;
		if (v2.length() > this.length())
			return false;
		return true;
	}
	
	this.distanceOfDot = function(x_2, y_2){		
		v=v.subtract(this.projection(new V(x_2, y_2, x - x_2, y - y_2)));
		return v.length();
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
