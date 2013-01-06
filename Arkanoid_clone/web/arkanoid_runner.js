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
    
var Arkanoid = {};

/*
 *  This javascript script creates arkanoid instance in given dom node
 */
function runArkanoid(nodeToRunOn){
    /*nodeToRunOn.width(widthToUse);
    nodeToRunOn.height(heightToUse);*/
    $('html, body').animate({scrollTop: nodeToRunOn.offset().top},1000);

    Arkanoid.Menu.initialize('movie');
    return;
    // ToDo
    // load levels from web service
}

Arkanoid.keyIsDown = (function(){
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

Arkanoid.Menu = (function(space){
    var widthToUse = 650;
    var heightToUse = 480;

    var menuItems = ["start", "quit"];
    var menuObjects = [];
    var selectedItem=0;
    var element={};
    var arkanoidMenu={};
    var keyDown = {};
    var isActive;
    var node;
    
    this.lastStroke;
    
    function initialize(nodeToRunOn){
        if(isActive)
            return
        node=nodeToRunOn;
        isActive=true;
        element = document.getElementById("movie");
        arkanoidMenu = Raphael(nodeToRunOn,widthToUse, heightToUse);
        
        menuObjects = [];
        selectedItem = 0;
        for (var i = 0; i< menuItems.length; i++){
            menuObjects.push(arkanoidMenu.text(widthToUse/2, heightToUse/2 * (i+2) / (menuItems.length +3),menuItems[i]).attr({'fill': 'white', 'font-size':'40em'}));
        }
        colorItems();
        
        arkanoidMenu.text(widthToUse/2, heightToUse/2 * (3+2) / (menuItems.length +3),"TOP").attr({'fill':'red', 'font-size':'20em'});
        requestAnimFrame(Arkanoid.Menu.tick);
    }
    
    function reactOnKey(){
        
        if(Arkanoid.keyIsDown('enter')){
            fireApp();
            return false;
        }
        
        if(Arkanoid.keyIsDown('up')){
            selectedItem = 0;
        }
        if(Arkanoid.keyIsDown('down')){
            selectedItem = menuObjects.length-1;
        }
        colorItems();
        return true;
    }
    function colorItems(){
        var color;
        for (var i = 0 ; i < menuObjects.length; i++){
            if (i === selectedItem){
                color = 'orange';
            }else{
                color = 'white';
            }
            menuObjects[i].attr({'fill': color});
            }
    }

    function fireApp(){

        if(selectedItem === 1){
            arkanoidMenu.remove();
            isActive=false;
            $(document).unbind('keydown');
            $(document).unbind('keyup');
            return;
        }
        if(selectedItem === 0){
            //arkanoidMenu.remove();
            launchGame(arkanoidMenu);
        }
    }
    function launchGame(paperRaphael){
        var arkanoidView = new arkanoid.view.Gameview(paperRaphael);
        var arkanoidModel = new arkanoid.model.Game(arkanoidView);
        var arkanoidController = new arkanoid.controller.Gamecontroller(arkanoidModel);
        arkanoidController.start();
        
        
    return;
}

    
    function tick(){
        if(reactOnKey())
            requestAnimFrame(Arkanoid.Menu.tick);
    }
    return {
        initialize: initialize,
        tick: tick
    }
})(this);

