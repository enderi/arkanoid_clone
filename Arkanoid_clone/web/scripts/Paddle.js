/*
*  Paddle
*/
function Paddle(){
	this.y=defaults.height-50;
	this.x=defaults.width/2-50;
	this.width=100;
	this.height = 20;
	this.object=new Rect(this.x,this.y,this.width, this.height, 5).attr({
        fillColor: '#0077FF',
        fillGradient: gradient.linear(0, ['rgba(0,0,0,.2)', 'rgba(0,0,0,0)'])
      }).addTo(stage);
  
}
Paddle.prototype.isBallTouchingMeAndWhere = function(ball, currentTime){
	// check if ball is touching top surface
	var returnValue = 0;
	var b = ball.getPosition(currentTime);
	var p = {};
	p.x = this.x;
	p.y = this.y;
	p.w = this.width;
	p.h = this.height;
	var radius = ball.diameter;
	if ( b.y + radius >=  p.y 
		&& b.y - radius <= p.y
		&& b.x >= p.x
		&& b.x <= p.x + p.w){
		returnValue += 1; // ball is touching top horizontal	
	}
	if ( b.y + radius >=  p.y + p.h
			&& b.y - radius <= p.y + p.h
			&& b.x >= p.x
			&& b.x <= p.x + p.w){
		returnValue += 2; // ball is touching bottom horizontal	
	}

	if ( b.x + radius >=  p.x + p.w
		&& b.x - radius <= p.x + p.w
		&& b.y >= p.y
		&& b.y <= p.y + p.h){
		returnValue += 4; // ball is touching right vertical
	}

	if ( b.x + radius >=  p.x 
		&& b.x - radius <= p.x
		&& b.y >= p.y
		&& b.y <= p.y + p.h){
		returnValue += 8; // ball is touching left vertical
	}	
	
	return returnValue;
}
