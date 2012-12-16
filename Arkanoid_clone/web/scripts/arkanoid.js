window.requestAnimFrame = (function(){
    return window.requestAnimationFrame       || 
           window.webkitRequestAnimationFrame || 
           window.mozRequestAnimationFrame    || 
           window.oRequestAnimationFrame      || 
           window.msRequestAnimationFrame     || 
           function(/* kutsuttava funktio */ callback, /* elementti */ element){
               window.setTimeout(callback, 1000 / 60);
           };
    })();

var startTime = (new Date).getTime();

$(document).ready(function(){ 
    arkanoid.model.balls.addBall(arkanoid.model.pad.getPosition(),422);
    view.tick();
    var context = $("#gamearea")[0].getContext("2d");
    for(var i=21;i<598;i=i+46){
        /*
        arkanoid.model.blocks.addBlock(i,100,'white',0);
        arkanoid.model.blocks.addBlock(i,125,'white',0);
        arkanoid.model.blocks.addBlock(i,150,'white',0);
        arkanoid.model.blocks.addBlock(i,175,'white',0);
        arkanoid.model.blocks.addBlock(i,200,'white',0);
        */
        arkanoid.model.blocks.addBlock(i,100,'grey',0);
        arkanoid.model.blocks.addBlock(i,125,'blue',0);
        arkanoid.model.blocks.addBlock(i,150,'red',0);
        arkanoid.model.blocks.addBlock(i,175,'orange',0);
        arkanoid.model.blocks.addBlock(i,200,'green',0);
        
    }
   /*
    $.each(arkanoid.model.blocks.getBlocks(),function(i, block){
        drawBlock(block, context);
    });
    
    drawPad(context);
    
    arkanoid.model.balls.addBall(arkanoid.model.pad.getPosition(),422);
    $.each(arkanoid.model.balls.getBalls(), function(i, ball){
        //drawBall(ball,context);
    });
    b = arkanoid.model.balls.getBalls()[0];
    b.starting_x=b.x;
    b.starting_y=b.y;
    for (var t=0;t<50;t++){
        console.log(b.getPositionX(t)+ "-"+b.getPositionY(t));
        context.fillRect(b.getPositionX(t),b.getPositionY(t),1,1);
    }
    */
});

var view = {
    context: $("#gamearea")[0].getContext("2d"),
    t: 0,
    lastTime: (new Date).getTime(),
    timing: function(){
        var timeConsumed = (new Date).getTime() - startTime;
        return timeConsumed;
    },

    render: function(){
        view.context.clearRect(0,0,640,480);
        view.context.fillStyle = "rgb(60,60,60)";
        view.context.fillRect(0,0,640,480);
        view.context.clearRect(21,21,598,450);
        view.context.fillStyle = "rgb(0,230,0)";
        
        $.each(arkanoid.model.blocks.getBlocks(),function(i, block){
            drawBlock(block, view.context);
        });
        
        drawPad(view.context);
        /*
        arkanoid.model.balls.addBall(arkanoid.model.pad.getPosition(),422);
        $.each(arkanoid.model.balls.getBalls(), function(i, ball){
            //drawBall(ball,context);
        });
        */
        b = arkanoid.model.balls.getBalls()[0];
        
        var time= view.timing();
        var x_ = Math.round(b.getPositionX(time));
        var y_ = Math.round(b.getPositionY(time));
        console.log("Time: "+time + " x: "+ x_ + " - y: "+y_);
        view.context.fillStyle = "rgb(0,0,0)";
        view.context.fillRect(x_,y_,5,5);
        
    },
    tick: function(){
        //console.log(view.timing());
        view.t++;
        view.timing();
        view.render();
        if(view.t<15)
            requestAnimFrame(view.tick);
    }
};


function drawBlock(block, context){
    context.fillStyle = 'black';
    context.fillRect(block.x,block.y,46,25);
    context.fillStyle = block.color;
    context.fillRect(block.x+1,block.y+1,44,23);               
}
function drawPad(context){
    
    var x = arkanoid.model.pad.getPosition();
    var w = arkanoid.model.pad.getWidth();
    x -= w/2;
    context.fillStyle = 'grey';
    context.fillRect(x,430,w,20);
    context.fillStyle = 'black';
    context.fillRect(x+2,432,w-4,16);
    context.fillStyle = '#25383C';
    context.fillRect(x+3,433,w-6,14);
}

function drawBall(ball, context){
    context.fillStyle='black';
    //console.log(ball.x+ ", " + ball.y);
    context.beginPath();
    context.arc(ball.x,ball.y,8,0,Math.PI*2, true);
    context.closePath();
    context.fill();
    
}

function Block(x,y,color,bonus){
    this.x=x;
    this.y=y;
    this.color=color;
    this.bonus=bonus;
    this.popped=false;
}

arkanoid.model={};

arkanoid.model.blocks=(function(){
    var blocks=new Array();
    function addBlock(x,y,color,bonus){
        var b=new Block(x,y,color,bonus,false);
        blocks.push(b);
    }
    function getBlockCount(){
        return blocks.length;
    }
    function getBlocks(){
        return blocks;
    }
    
    return {
        getBlockCount: getBlockCount,
        addBlock: addBlock,
        getBlocks: getBlocks
    }
})();

arkanoid.model.pad = (function(){
    var x = 300;
    var width = 100;
    var state = 0;
    function getPosition(){
        return x; 
    }
    function setPosition(diff){
        x += diff; // TODO: might hit the wall
    } 
    function setState(s){
        state = s;
    }
    function getWidth(){
        if (state === 1)
            return 150;
        return 100;
    }
    
    return {
        getPosition: getPosition,
        setPosition: setPosition,
        setState: setState,
        getWidth: getWidth
    }
})();

function Ball(x,y){
    this.x=x;
    this.y=y;
    this.speed=0.5;       //
    this.timeSet=(new Date).getTime();
    this.direction=-45*Math.PI/180;  // radians
    
    this.starting_x=x;
    this.starting_y=y;
}

Ball.prototype.getPositionX = function(time){
    //console.log(this.starting_x);
    return Math.cos(this.direction)*time*this.speed+this.starting_x;
}
Ball.prototype.getPositionY = function(time){
    return Math.sin(this.direction)*time*this.speed+this.starting_y;
}


arkanoid.model.balls = (function(){
    var balls = new Array();
    
    function addBall(x,y){
        balls.push(new Ball(x,y));
    }
    function getBalls(){
        return balls;
    }
    
    return {
        addBall: addBall,
        getBalls: getBalls
    }
})();