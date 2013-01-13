    
var arkanoid = arkanoid || {};

/*
 *  This javascript script creates arkanoid instance in given dom node
 */
function runArkanoid(nodeToRunOn){
    $('html, body').animate({scrollTop: nodeToRunOn.offset().top},1000);
    arkanoid.Menu.initialize(nodeToRunOn);
    return;
}
/*
arkanoid.keyIsDown = (function(){
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
*/
arkanoid.Menu = (function(space){
    var widthToUse = 650;
    var heightToUse = 480;

    var menuItems = ["START", "QUIT"];
    var menuObjects = [];
    var selectedItem=0;
    var element={};
    var arkanoidMenu=null;
    var keyDown = {};
    var isActive;
    var node = null;
    var enterPressed=false;
    //this.lastStroke;
    function initialize(nodeToRunOn){
        if(isActive)
            return
        menuObjects = null;
        
        
        selectedItem = 0;
        
        isActive=true;
        
        if(!node)
			node = nodeToRunOn.get(0);        
	    
	    if(arkanoidMenu != null){
	    	arkanoidMenu.clear();
	    	arkanoidMenu.remove();
	    }
        
	    arkanoidMenu = Raphael(node, widthToUse, heightToUse);
	    
        menuObjects = [];
        selectedItem = 0;
		
        for (var i = 0; i< menuItems.length; i++){
            menuObjects.push(arkanoidMenu.text(widthToUse/2, 
            			heightToUse/2 * (i+2) / (menuItems.length +3),
            			menuItems[i]).attr({'fill': 'white', 'font-size':'40em', 'font-family': 'Arial, Helvetica, sans-serif'}));
        }
        colorItems();
        
        //arkanoidMenu.text(widthToUse/2, heightToUse/2 * (3+2) / (menuItems.length +3),"TOP").attr({'fill':'red', 'font-size':'20em'});

		requestAnimFrame(arkanoid.Menu.tick);
    }
    
    function reactOnKey(){
        if(!arkanoid.controller.Gamecontroller.keyIsDown('enter') && enterPressed){
        	enterPressed=false;
            fireApp();
            return false;
        }
        
        if(arkanoid.controller.Gamecontroller.keyIsDown('enter')){
        	enterPressed=true;
        }
        
        if(arkanoid.controller.Gamecontroller.keyIsDown('up')){
            selectedItem = 0;
        }
        if(arkanoid.controller.Gamecontroller.keyIsDown('down')){
            selectedItem = menuObjects.length-1;
        }
        colorItems();
        return true;
    }
    
    function colorItems(){
        var color;
        var size;
        for (var i = 0 ; i < menuObjects.length; i++){
            if (i === selectedItem){
                color = 'orange';
                size = '50em';
            }else{
                color = 'white';
                size = '40em';
            }
            menuObjects[i].attr({'fill': color, 'font-size': size});
        }
    }

    function fireApp(){
		
        if(selectedItem === 1){
            arkanoidMenu.remove();
            isActive=false;
            /*
            $(document).unbind('keydown');
			$(document).unbind('keyup');*/
            return;
        }
        
        if(selectedItem === 0){
            arkanoidMenu.clear();
            launchGame(arkanoidMenu);
        }
    }
    
    function launchGame(paperRaphael){
        var arkanoidView = new arkanoid.view.Gameview(paperRaphael);
        var arkanoidModel = new arkanoid.model.Game(arkanoidView);
        var arkanoidController = new arkanoid.controller.Gamecontroller(arkanoidModel);
        isActive=false;
        arkanoidController.start();       
	    return;
	}
	
    function tick(){

        if(reactOnKey() && isActive)
            requestAnimFrame(arkanoid.Menu.tick);
    }
    
    return {
        initialize: initialize,
        tick: tick
    }
})(this);

