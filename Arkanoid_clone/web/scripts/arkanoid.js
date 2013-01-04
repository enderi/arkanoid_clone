/*
 *  Arkanoid clone
 */

var Arkanoid={};

var hitCounter =0;

Arkanoid = (function(){
    var defaults = {
        width: stage.width,
        height: stage.height,
        colWidth: stage.width / 13,
        rowHeight: stage.height / 20,
        ball: {
            ballSpeed: 5,
            radius: 10
        },
        paddle: {
            verticalPosition: stage.height-50,
            paddleSpeed: 7,
            left: "left",
            right: "right",
            fire: "enter",
            paddleTypes: [
                {
                    width: 100,
                    startingPosition: stage.width/2 - 100/2,
                    stickiness: false
                },
                {
                    width: 150,
                    startingPosition: stage.width/2 - 150/2,
                    stickiness: false
                },
                {
                    width: 100,
                    startingPosition: stage.width/2 - 100/2,
                    stickiness: true
                }
            ]
        }
    };
    
    // Constructor
    function Arkanoid(){
        this.config = defaults;
        this.levels = JSON.parse(stage.options.levels);
        this.currentLevel = 1;
        
        this.height = this.config.height;
        this.width = this.config.width;
        
        this.paddleSpeed = this.config.paddle.paddleSpeed;
        
        this.paddle;
        this.balls = new Array();
        this.blocks = new Array();
        this.objects = new Array();
        
        this.newGame();
        
        this.latesUpdateTime=new Date().getTime();
        this.currentTime = new Date().getTime();
    }
    
    Arkanoid.keyIsDown = (function(){
        var keys = {
            37: "left",
            39: "right",
            13: "enter"
        };
        
        var down = {};
        stage.on('keydown', function(e){
            var key = e.keyCode;
            down[keys[key]] = true;
        });
        stage.on('keyup', function(e){
            var key = e.keyCode;
            down[keys[key]] = false;
        });
        return function(key){
            return !!down[key];
        };
    })();
    
    // Constructors for objects
    
    function Paddle(arkanoid, yPosition, xPosition, config){
        this.arkanoid = arkanoid;
        
	this.y = defaults.height-50;
	this.x = defaults.width/2-50;
	this.width = 100;
	this.height = 20;
        this.config = config;


        this.reCalculateVectors=function(){
            
            this.vectors = [
                new Arkanoid.V(this.x+this.width/4, this.y, -this.width/2, 0),
                new Arkanoid.V(this.x+this.width/2, this.y+this.height/2, -this.width/4, -this.height/2),
                new Arkanoid.V(this.x-this.width/2, this.y+this.height/2, 0, this.height/2),
                new Arkanoid.V(this.x-this.width/4, this.y, -this.width/4, this.height/2),
                new Arkanoid.V(this.x-this.width/2, this.y+this.height, this.width, 0),
                new Arkanoid.V(this.x+this.width/2, this.y+this.height, 0, -this.height/2)];
        }
        
        this.reCalculateVectors();
        
        
        this.drawObject = function(){
            
            this.object = new Group().addTo(stage).attr({ x: this.x-this.width/2, y: this.y});
      
            for (var i =0 ; i < this.vectors.length; i++){

                new Path()
                    .moveTo(this.vectors[i].getX()-this.x+this.width/2, this.vectors[i].getY()-this.y)
                    .lineTo(this.vectors[i].getX()-this.x+this.width/2+this.vectors[i].compX(), this.vectors[i].getY()-this.y+this.vectors[i].compY())
                    .stroke('green', 2)
                    .closePath()
                    .addTo(this.object);
            }

            this.object.attr({fillColor: '#0077FF'});
        }
        
        this.drawObject();
        

        this.pop = function(index, ballIndex){
            if (this.arkanoid.balls[ballIndex].stickiness && index ===0){
                this.arkanoid.balls[ballIndex].speed=0;
                this.arkanoid.balls[ballIndex].recalculate();
                this.arkanoid.balls[ballIndex].isStuck=this;
            }

        }
	
        this.isActive = function(){ return true; };
	
        this.getVectors = function(){
            return this.vectors;		
        }
    }

    Paddle.prototype.setLocation = function(x, y){
        this.object.attr({
            x: x - this.width /2,
            y: y
        });
        this.reCalculateVectors();
        
    }

    function Ball(x,y, direction, config, attachedPaddle, arkanoid){
        this.arkanoid = arkanoid;
	this.config = config;

        this.x = x;
	this.y = y;

	this.radius = config.radius;
        this.width = config.width;
	this.speed = 0;

	this.timeSet = (new Date).getTime();
        this.direction = direction;
	this.directionInRads = this.direction * Math.PI / 180;  // radians
        
	this.x_component = Math.cos(this.directionInRads)*this.speed;
	this.y_component = Math.sin(this.directionInRads)*this.speed;
        
        this.stickiness=true;
        
        this.isStuck = attachedPaddle;
        
        this.directionVector = new Arkanoid.V(this.x, this.y, this.x_component_, this.y_component);
        
        // these are calculated based on time difference and
        // are used to calculate collisions and bounces
        this.dX = 0;
        this.dY = 0;
        
	this.object = new Circle(this.x, this.y, this.radius).fill('white');
        // Getters
        
        this.setSpeed = function(speed){
            this.speed = speed;
            this.recalculate();    
        }

        this.recalculate = function(){
            this.direction = this.direction % 360;
            while(this.direction<0)
                this.direction +=360;
            this.directionInRads = this.direction * Math.PI / 180;  // radians

            this.x_component = Math.cos(this.directionInRads)*this.speed;
            this.y_component = Math.sin(this.directionInRads)*this.speed;
            this.directionVector.setCompX(this.x_component);
            this.directionVector.setCompY(this.y_component);
        }
        this.getAngle = function(){
            return this.direction;
        }
    }

    Ball.prototype.setLocation = function(x, y){
        this.object.attr({
            x: x,
            y: y
        });
        this.directionVector.setX(x);
        this.directionVector.setY(y);
    }

    function Block(column, row, color, type, arkanoid, config){
        this.arkanoid = arkanoid;
        this.config = config;
        this.width = this.config.colWidth;
        this.height = this.config.rowHeight;
        this.x = (column-1) * this.width;
        this.y = (row-1) * this.height;
        this.active=true;
        
        this.color = color;
        this.type = type;
        
        this.vectors = new Array();
        this.vectors.push(new Arkanoid.V(this.x+this.width, this.y, -this.width, 0));
        this.vectors.push(new Arkanoid.V(this.x, this.y, 0, this.height));
        this.vectors.push(new Arkanoid.V(this.x, this.y+this.height, this.width, 0));
        this.vectors.push(new Arkanoid.V(this.x+this.width, this.y+this.height, 0, -this.height));
        
        this.object = new Rect(this.x, this.y, this.width, this.height, 5).attr({
            fillColor: this.color,
            fillGradient: gradient.linear(0, ['rgba(0,0,0,.2)', 'rgba(0,0,0,0)'])
        }).addTo(stage);
        this.pop = function(index, ballIndex){
            this.active=false;
            this.object.destroy();
        }
	
        this.isActive = function(){ return this.active; };
	
        this.getVectors = function(){
            return this.vectors;		
        }
        
    }
    
    function GameArea(arkanoid, config){
        // Order of the vectors is crucial for collision detection mechanism
        // vectors are in the following order
        // 1. bottom
        // 2. right
        // 3. top
        // 4 right
        
        this.vectors = new Array();
        this.vectors.push(new Arkanoid.V(defaults.width, defaults.height,-defaults.width, 0));
        this.vectors.push(new Arkanoid.V(defaults.width, 0, 0, defaults.height));
        this.vectors.push(new Arkanoid.V(0, 0, defaults.width, 0));
        this.vectors.push(new Arkanoid.V(0, defaults.height, 0, -defaults.height));


        this.arkanoid = arkanoid;
        this.config=config;

        this.pop = function(index, ballIndex){
            if (index == 0){
                // remove ball from the balls array
                this.arkanoid.balls[index].speed=0;
                this.arkanoid.balls[index].recalculate();
            }
        }
	
        this.isActive = function(){ return true; };
	
        this.getVectors = function(){
            return this.vectors;		
        }
    }
    
    function HittableObject(item){
        this.item = item;
        this.getVectors = function(){
            return item.getVectors();
        }
	
        this.youBeenHit = function(index, ballIndex){
            // your vector [index] has been hit
            item.pop(index, ballIndex);
        }
	
        this.isActive = function(){
            return item.isActive();
        }
        this.distanceFromBall = function(ball){
            
            var distanceOfCurrent;
            var objectToHit;
            var vectorThatBallHit;
            var vectorOfCollision;
            var bX = ball.x;
            var bY = ball.y;
            
            var dX = ball.dX;
            var dY = ball.dY;
            
            var first=true;
            
            var vects = this.arkanoid.objects[e].item.vectors;
            for (var k = 0; k<vects.length; k++){
                distanceOfCurrent = vects[k].shortestDistanceFromPoint(bX+dX, bY+dY).length();

                if (first || closestToHit > distanceOfCurrent){
                    closestToHit = distanceOfCurrent;
                    objectToHit=this.item;
                    vectorIndexToHit = k;
                    vectorThatBallHit = vects[k];
                    vectorOfCollision = vects[k].shortestDistanceFromPoint(bX+dX, bY+dY);
                    first =false;
                }
            }
            
            return {
                closestToHit : closestToHit,
                vectorIndexToHit: k,
                vectorOfCollision: vectorOfCollision
            }

        }
    }
    
    tools.mixin( Arkanoid.prototype, {
        initialize: function() {
            var arkanoid = this;
            stage.on('tick', function(){
                arkanoid.draw();
            });
            this.latestTime = new Date().getTime();
            this.currentTime = this.latestTime;
            return this;
        },
        newGame: function (){
            
            var gameArea = new GameArea(this, defaults);
            
            var paddle = this.paddle = new Paddle(this, 0, 0, defaults.paddle);
            
            var ball;
            for (var i = 0 ; i<1; i++){

                ball= new Ball(paddle.x, paddle.y-defaults.ball.radius,-45, defaults.ball, paddle, this);
                ball.object.addTo(stage);
                ball.draw();
                //ball.setSpeed(5);
                this.balls.push(ball);
                ball.isStuck = this.paddle;
            }
            var blocksJSON = this.levels['levels'][this.currentLevel-1]['blocks'];
            
            
            for(var i = 0; i < blocksJSON.length; i++){
                this.blocks.push(new Block(blocksJSON[i]['x'], 
                blocksJSON[i]['y'],
                blocksJSON[i]['color'],
                blocksJSON[i]['type'],
                this,
                this.config));
                
            }

            this.objects.push(new HittableObject(paddle));
            this.objects.push(new HittableObject(gameArea));
            
            var vectors;
            var h;
            for(i = 0; i< this.blocks.length; i++){
                this.objects.push(new HittableObject(this.blocks[i]));
            }
            
        },
        draw: function() {
            this.currentTime = new Date().getTime();
            this.paddle.draw();
            var ball;
            for (var i = 0; i < this.balls.length; i++){
                
                ball = this.balls[i];
                //console.log(this.currentTime - this.latestTime);
                // lets use 16ms because more realistic way causes a few problems
                ball.countDiffs(10 /*this.currentTime - this.latestTime*/);
                ball.checkCollisions();
                ball.draw();
            }
            this.latestTime = this.currentTime;
        }
    });
    
    tools.mixin(Paddle.prototype, {
        draw: function(){
            var arkanoid = this.arkanoid;
            var dX=0;
            if(Arkanoid.keyIsDown(this.config.left) && this.x > 0){
                dX = -arkanoid.paddleSpeed;
            }
            if(Arkanoid.keyIsDown(this.config.right) && this.x < arkanoid.width){
                dX = arkanoid.paddleSpeed;
            }
            if(Arkanoid.keyIsDown(this.config.fire) && this.arkanoid.balls[0].isStuck === this){
                this.arkanoid.balls[0].isStuck=null;
                this.arkanoid.balls[0].speed = 5;
                this.arkanoid.balls[0].recalculate();
            }
            
            if(dX !== 0 ) {
                if(this.arkanoid.balls[0].isStuck){
                   
                    if(this.arkanoid.balls[0].x-this.arkanoid.balls[0].radius+dX<0){
                        dX = 0-(this.arkanoid.balls[0].x-this.arkanoid.balls[0].radius);
                    }
                    if(this.arkanoid.balls[0].x+this.arkanoid.balls[0].radius+dX>this.arkanoid.config.width){
                        dX = this.arkanoid.config.width - this.arkanoid.balls[0].x - this.arkanoid.balls[0].radius;
                    }
                    
                    this.x += dX;
                    
                    this.setLocation(this.x, this.y);
                    this.arkanoid.balls[0].x+=dX;
                    this.arkanoid.balls[0].recalculate();
                    return
                }
                    
                if(this.arkanoid.balls[0].distanceFromObject(this,dX, 0).closestToHit>this.arkanoid.balls[0].radius){
                    this.x += dX;
                    this.setLocation(this.x, this.y);
                    return;
                }
            }
        }
    });    

    tools.mixin(Ball.prototype, {
        countDiffs: function(dTime){
            this.dX = this.x_component * dTime/20;
            this.dY = this.y_component * dTime/20;
        },
        distanceFromObject: function(object, dXO, dYO){
            var closestToHit;
            var objectToHit;
            var vectorThatBallHit;
            var vectorOfCollision;
            var vectorIndexToHit;
            var distanceOfCurrent;
            var e
            var first = true;
            var bX = this.x;
            var bY = this.y;
            var dX = this.dX;
            var dY = this.dY;
            
            
            var offsetVector = new Arkanoid.V(0,0,dXO, dYO);
            vects = object.getVectors();
                        
            for (var k = 0; k<vects.length; k++){

                distanceOfCurrent = vects[k].add(offsetVector).shortestDistanceFromPoint(bX+dX, bY+dY).length();
                
                if (first || closestToHit > distanceOfCurrent){
                    closestToHit = distanceOfCurrent;
                    objectToHit=this.arkanoid.objects[e];
                    vectorIndexToHit = k;
                    vectorThatBallHit = vects[k];
                    vectorOfCollision = vects[k].shortestDistanceFromPoint(bX+dX, bY+dY);
                    first =false;
                }
            }
            
            return {
                closestToHit: closestToHit,
                vectorIndexToHit: vectorIndexToHit,
                vectorOfCollision: vectorOfCollision
            }
            
        },
        checkCollisions: function(){
            var dX;
            var dY;
            var bX;
            var bY;
            var bSpeed;
            var bRadius;
            var distance;
            var closestToHit;
            var distanceOfCurrent;
            var objectToHit;
            var vectorIndexToHit;
            var vectorOfCollision;
            var first = true;
            var hit=false;
            
            for ( i=0; i < this.arkanoid.balls.length; i++){

                dX = this.arkanoid.balls[i].dX;
                dY = this.arkanoid.balls[i].dY;
                bX = this.arkanoid.balls[i].x;
                bY = this.arkanoid.balls[i].y;
                bSpeed = this.arkanoid.balls[i].speed;
                bRadius = this.arkanoid.balls[i].radius;
                closestToHit=null;
                distanceOfCurrent=null;
                objectToHit=null;
                vectorIndexToHit=null;
                vectorOfCollision=null;
                angleOfNormal = null;
                
                

                for ( e=0; e < this.arkanoid.objects.length; e++){
                    if (this.arkanoid.objects[e].isActive() && bSpeed !== 0){
                        vects = this.arkanoid.objects[e].item.vectors;
                        for (k = 0; k<vects.length; k++){
                            distanceOfCurrent = vects[k].shortestDistanceFromPoint(bX+dX, bY+dY).length();

                            if (first || closestToHit > distanceOfCurrent){
                                closestToHit = distanceOfCurrent;
                                objectToHit=this.arkanoid.objects[e];
                                vectorIndexToHit = k;
                                vectorThatBallHit = vects[k];
                                vectorOfCollision = vects[k].shortestDistanceFromPoint(bX+dX, bY+dY);
                                first =false;
                            }
                        }
                        
                    }
                }
                if (!first && closestToHit <= this.arkanoid.balls[i].radius){
                           
                    
                    var collXComp = vectorOfCollision.getNormalRH().projection(this.arkanoid.balls[i].directionVector);
                    var collYComp = vectorOfCollision.projection(this.arkanoid.balls[i].directionVector);
                    var newDirection = collXComp.add(collYComp.scalar(-1));
                    this.arkanoid.balls[i].direction=newDirection.getAngle();
                    
                    this.arkanoid.balls[i].dX=0;
                    this.arkanoid.balls[i].dY=0;
                    this.arkanoid.balls[i].recalculate();
                    
                    objectToHit.youBeenHit(vectorIndexToHit,i);
                }
                }

            },
        
            draw: function(){
                // notice that new value is set in the parameters, very no-no
            
                if (this.dX != 0)
                    this.x = this.x + this.dX;
                if (this.dY != 0)
                    this.y = this.y + this.dY;
                //console.log(this.x + ", " + this.dX);
        
                this.setLocation(this.x = this.x + this.dX, this.y = this.y + this.dY);
            }
        });
    
        return Arkanoid;
    })();

    
// Two-dimensional vector (with starting point) class

Arkanoid.V = function(x_, y_, x_component_, y_component_){
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
        return new Arkanoid.V(x, y, x_component - v.compX(), y_component - v.compY());
    }
    this.add = function(vector){ 
        return new Arkanoid.V(x, y, x_component + vector.compX(), y_component + vector.compY());
    }

    this.scalar = function(scalar){
        return new Arkanoid.V(x, y, x_component*scalar, y_component*scalar);
    }

    this.dotProduct = function(vector){
        return vector.compX() * x_component + vector.compY() * y_component;
    }

    this.normalize = function(){
        return this.scalar(1/this.length());
    }
    
    this.getNormalRH = function(){
        // remove scalar-part when working
        return new Arkanoid.V(x+(x_component)/2, y+(y_component)/2, -y_component, x_component);
    }
    
    this.doesDotProjectOnVector = function(x_2, y_2){
        var v2 = this.projection(new Arkanoid.V(x_2, y_2, x - x_2, y - y_2));

        if(this.dotProduct(v2)>0)
            return false;
        if (v2.length() > this.length())
            return false;
        return true;
    }

    // returns the vector
    this.distanceOfDot = function(x_2, y_2){
        var v = new Arkanoid.V(x_2,y_2,x-x_2,y-y_2);
        v= v.subtract(this.projection(new Arkanoid.V(x_2,y_2,x-x_2,y-y_2)));
        return v;
        
    }

    this.shortestDistanceFromPoint = function( px,py){
        var v3 = new Arkanoid.V(x, y, px-x, py-y);

        var dp = v3.dotProduct(this);
        
        if(dp<0){
            //console.log("catch1"+v3.toString());
            
            return v3;
        }
        var v4 = new Arkanoid.V(this.x2,this.y2,px-this.x2, py-this.y2);
        dp= v4.dotProduct(this);
        if(dp>0){
            return v4;
        }
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

function vectorToStage(vector, color){	
    new Path()
    .moveTo(vector.getX(), vector.getY())
    .lineTo(vector.getX() + vector.compX(), vector.getY() + vector.compY())
    .closePath()
    .stroke(color, 2)
    .addTo(stage);
    
}


function pointToLineDistance( v2, px,py){
    var v3 = new Arkanoid.V(0,0,px-v1.getX(),py-v1.getY());
    
    
    vectorToStage(v3, 'yellow');
    var dp = v3.dotProduct(v2);
    
    if(dp<0){
        return v3;
    }
    var v4 = new Arkanoid.V(0,0,px-v1.x2,py-v1.y2);
    dp= v4.dotProduct(v2);
    if(dp>0){
        return v4;
    }

    return v2.distanceOfDot(px,py);
}

    new Arkanoid().initialize();

    /*
    var popup = new Group().addTo(stage).attr({ x: 200, y: 120});

    popup.on('click',function(){	
        new Arkanoid().initialize();
        (this).destroy();
    });

    new Text('Go!').attr({
        textFillColor: 'white', fontFamily: 'Arial', fontSize: 60, x: 50, y: 30
    }).addTo(popup);
    */