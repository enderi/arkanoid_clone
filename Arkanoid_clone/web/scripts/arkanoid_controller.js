window.requestAnimFrame = (function(){
    return window.requestAnimationFrame       || 
           window.webkitRequestAnimationFrame || 
           window.mozRequestAnimationFrame    || 
           window.oRequestAnimationFrame      || 
           window.msRequestAnimationFrame     || 
           function(callback, element){
               window.setTimeout(callback, 1000 / 60);
           };
    })();

// Controller

var arkanoid = arkanoid || {};

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
			arkanoid.Menu.initialize();
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
