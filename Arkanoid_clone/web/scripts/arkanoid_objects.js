// Objects
arkanoid.model.Block = function(column, row, color, type, columnWidth, rowHeight, index){
	this.index = index;

    this.column = column;
    this.row = row;

    this.width = columnWidth;
	this.height = rowHeight;
	
	this.x = (this.column-1) * this.width;
	this.y = (this.row-1) * this.height;
	
    this.active=true;

    this.color = color;
    this.type = type;  // type 1 - regular block, 2 - requires 2 hits, 3 - does not pop
    this.hits = 0;
    
    this.vectors = new Array();
    this.vectors.push(new arkanoid.model.V(this.x+this.width, this.y, - this.width, 0));
    this.vectors.push(new arkanoid.model.V(this.x, this.y, 0, this.height));
    this.vectors.push(new arkanoid.model.V(this.x, this.y+this.height, this.width, 0));
    this.vectors.push(new arkanoid.model.V(this.x+this.width, this.y+this.height, 0, -this.height));
	
    this.pop = function(index, ballIndex){
		// ball hit you, do something
		this.hits++;
		if(this.type == 1)
			this.active=false;
		if(this.type == 2 && this.hits == 2)
	        this.active=false;
    }

    this.isActive = function(){ return this.active; };

    this.getVectors = function(){
        return this.vectors;		
    }
}

arkanoid.model.Paddle = function(x,y){
    this.paddleSpeed=7;
    
    this.direction = 0;
    
    this.dX=0;
    
    this.y = y;
    this.x = x;
    this.width = 100;
    this.height = 20;
    
    this.ballThatsStuckOnPaddle=null;
    this.vectors=null;
    
    this.sticky = false; // if balls stick on the top horizontal vector
    
    this.reCalculateVectors = function(){
        this.vectors = [
            new arkanoid.model.V(this.x + this.width/4, this.y, -this.width/2, 0),
            new arkanoid.model.V(this.x + this.width/2, this.y+this.height/2, -this.width/4, -this.height/2),
            new arkanoid.model.V(this.x - this.width/2, this.y+this.height/2, 0, this.height/2),
            new arkanoid.model.V(this.x - this.width/4, this.y, -this.width/4, this.height/2),
            new arkanoid.model.V(this.x - this.width/2, this.y+this.height, this.width, 0),
            new arkanoid.model.V(this.x + this.width/2, this.y+this.height, 0, -this.height/2)];
    }

    this.enterPressed = function(){
        if(this.ballThatsStuckOnPaddle){
            this.ballThatsStuckOnPaddle.speed=5;
            this.ballThatsStuckOnPaddle.recalculate();
            this.ballThatsStuckOnPaddle = null;
        }
        
    }
    
    this.ballHitYou = function(ball, vectorIndex){
        if(this.ballThatsStuckOnPaddle || !this.sticky){
            return;
        }
        if(vectorIndex===0){
            ball.speed=0;
            ball.recalculate();
            this.ballThatsStuckOnPaddle = ball;
        }
            
    }
    
    this.setMovement=function(direction){
        this.dX = direction * this.paddleSpeed;
        this.direction=direction;
    }
    
    this.reCalculateVectors();
    
    this.countNewPosition = function(){
        if(this.dX){
            this.x = this.x + this.dX;
            this.dX = 0;
            this.reCalculateVectors();
        }
        
    }

    this.getVectors = function(){
        return this.vectors;		
    }
}

arkanoid.model.Ball = function(x,y,color){
    this.dX=0;
    this.dY=0;
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.isStuckOnPaddle;
    
    this.speed = 0;
    this.direction = -45;
    this.directionVector = new arkanoid.model.V(0,0,0,0);
    
    this.active = true;
    
    this.recalculate = function(){
        this.direction = this.direction % 360;
        while(this.direction<0)
            this.direction +=360;
       
              
		// if direction is almost parallel, we adjust it
		if(this.direction <25){
			this.direction += 25 - this.direction;
		}else if(this.direction > 155 && this.direction <=180){
			this.direction -= this.direction - 155;
		}else if (this.direction >180 && this.direction < 205){
			this.direction += 205 - this.direction ;
		}else if(this.direction >335){
			this.direction -= this.direction - 335;
		}			
			
		
        this.directionInRads = this.direction * Math.PI / 180;  // radians

        this.x_component = Math.cos(this.directionInRads)*this.speed;
        this.y_component = Math.sin(this.directionInRads)*this.speed;
        this.directionVector.setCompX(this.x_component);
        this.directionVector.setCompY(this.y_component);
    }
    
	// model first defines deltas for ball, then calculates if there is collisions 
	// and after that calls this.setNewposition to reposition the ball
    this.setMovement = function(){
        this.dX = this.x_component;
        this.dY = this.y_component;
    }
    this.recalculate();
    
    this.setNewPosition = function(){
        if(this.dX || this.dX){
            this.x = this.x + this.dX;
            this.y = this.y + this.dY;
            this.dX = 0;
            this.dY = 0;
        }
    }
}
