
$(document).ready(function(){
    
    var context = $("#gamearea")[0].getContext("2d");
    context.clearRect(0,0,640,480);
    context.fillStyle = "rgb(60,60,60)";
    context.fillRect(0,0,640,480);
    context.clearRect(21,21,598,450);
    context.fillStyle = "rgb(0,230,0)";
    for(var i=21;i<598;i=i+46){
        arkanoid.model.blocks.addBlock(i,100,'grey',0);
        arkanoid.model.blocks.addBlock(i,125,'blue',0);
        arkanoid.model.blocks.addBlock(i,150,'red',0);
        arkanoid.model.blocks.addBlock(i,175,'orange',0);
        arkanoid.model.blocks.addBlock(i,200,'green',0);
        
    }
    $.each(arkanoid.model.blocks.getBlocks(),function(i, block){
        drawBlock(block, context);
    });
    
    drawPad(context);
    
    arkanoid.model.balls.addBall(arkanoid.model.pad.getPosition(),422);
    $.each(arkanoid.model.balls.getBalls(), function(i, ball){
        drawBall(ball,context);
    });
    

});
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
    console.log(ball.x+ ", " + ball.y);
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
    this.speed=0;
    this.direction=.5;
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


/*
Blocks = Backbone.Model.extend({
    initialize: function(){
        // blocks:
        
    }
});
 */