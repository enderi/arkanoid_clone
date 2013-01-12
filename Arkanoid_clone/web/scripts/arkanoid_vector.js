// Two-dimensional vector (with starting point) class

var arkanoid = arkanoid || {};

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