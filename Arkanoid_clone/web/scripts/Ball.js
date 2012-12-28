/*
* Ball
*/

function Ball(x,y, direction){
    this.starting_x = x;
    this.starting_y = y;
    this.diameter = 10;
    this.speed = 0;
  
  	this.timeSet = (new Date).getTime();
    this.directionInRads = direction * Math.PI / 180;  // radians
    this.direction = direction;  // degrees
    
    this.x_component = 0; // Math.cos(this.directionInRads) * this.speed;
    this.y_component = 0; // Math.sin(this.directionInRads) * this.speed;

    this.object = new Circle(this.x, this.y, this.diameter);
 
 		this.logged=false;
}


// Getters
Ball.prototype.getPosition = function(time){

    return {
        x: this.x_component * (time - this.timeSet) + this.starting_x,
        y: this.y_component * (time - this.timeSet) + this.starting_y
    }
}

Ball.prototype.getPositionX = function(time){
	return this.x_component * time + this.starting_x;
}
Ball.prototype.getPositionY = function(time){
	return this.y_component * time + this.starting_y;
}

// Getters
Ball.prototype.setBasePosition = function(position){
	this.starting_x = position.x;
	this.starting_y = position.y;
}

Ball.prototype.setSpeed = function(speed, timeOfChange){
	this.speed=speed;
	this.timeSet = timeOfChange;
	this.starting_x = (this).getPositionX(timeOfChange-this.timeSet);
	this.starting_y = (this).getPositionY(timeOfChange-this.timeSet);	
	
	this.x_component = Math.cos(this.directionInRads) * this.speed;
	this.y_component = Math.sin(this.directionInRads) * this.speed;
}

Ball.prototype.setNewDirection = function(direction, timeOfChange){
	this.direction = direction;
	this.directionInRads = direction * Math.PI / 180;  // radians
	
	this.x_component = Math.cos(this.directionInRads) * this.speed;
	this.y_component = Math.sin(this.directionInRads) * this.speed;
	
	this.timeSet = timeOfChange;
}

Ball.prototype.setNewPosition = function(currentTime){
	
	
	var dirChanged=false;
	var newPos = (this).getPosition(currentTime);
	
	// check if over the wall
	if (newPos.x - this.diameter < 0  && this.x_component < 0){
		newPos.x = Math.abs(newPos.x - this.diameter);
		this.x_component=-this.x_component;
		//(this).setNewDirection(180-this.direction, currentTime);
		dirChanged=true;
	}
	else if ( newPos.x + this.diameter > defaults.width && this.x_component > 0 ){
		newPos.x = defaults.width - Math.abs(defaults.width - newPos.x - this.diameter );
		this.x_component=-this.x_component;
		//(this).setNewDirection(180-this.direction, currentTime);
		dirChanged=true;
	}

	if (newPos.y - this.diameter  < 0  && this.y_component < 0){
		newPos.y = Math.abs(newPos.y - this.diameter);
		this.y_component=-this.y_component;
//		(this).setNewDirection(-this.direction, currentTime);
		dirChanged=true;
	}
	else if ( newPos.y + this.diameter  > defaults.height  && this.y_component > 0) {
		newPos.y = defaults.height - Math.abs(defaults.height - newPos.y - this.diameter );
		this.y_component=-this.y_component;
		dirChanged=true;		
		//(this).setNewDirection(-this.direction, currentTime);
		this.direction=-this.direction;
	}

	this.object.attr(newPos);
	if(dirChanged){
		(this).setBasePosition(newPos);
		this.timeSet=currentTime;
	}
	
}

Ball.prototype.youBeenTouchedFrom = function(where, time){
	var changed = false;
	if (where == 8 && this.x_component > 0) {
		this.x_component=-this.x_component;
		where -= 8;
		changed = true;
	}
	
	if (where == 4 && this.x_component < 0) {
		this.x_component=-this.x_component;
		where -= 4;
		changed = true;
	}

	if (where == 2 && this.y_component < 0) {
		this.y_component = -this.y_component;
		where -= 2;
		changed = true;
	}
	if (where == 1 && this.y_component > 0) {
		this.y_component = -this.y_component;
		where -= 1;
		changed = true;
	}
	if (changed){
		(this).setBasePosition((this).getPosition(time));
		this.timeSet = time;
	}
}

// end Ball
