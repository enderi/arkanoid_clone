var widthToUse = 650;
var heightToUse = 480;

var keys = {
    37: "left",
    39: "right",
    40: 'down',
    38: 'up',
    13: "go"
};

Arkanoid = {};

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
function launchGame(nodeToRunOn){
    var levels = '{"levels":[{"level": "1","background":"","blocks":[{"x":"1","y":"2","type":"1","color":"red"},{"x":"2","y":"2","type":"1","color":"red"},{"x":"3","y":"2","type":"1","color":"red"},{"x":"4","y":"2","type":"1","color":"red"},{"x":"5","y":"2","type":"1","color":"red"},{"x":"6","y":"2","type":"1","color":"red"},{"x":"7","y":"2","type":"1","color":"red"},{"x":"8","y":"2","type":"1","color":"red"},{"x":"9","y":"2","type":"1","color":"red"},{"x":"10","y":"2","type":"1","color":"red"},{"x":"11","y":"2","type":"1","color":"red"},{"x":"12","y":"2","type":"1","color":"red"},{"x":"13","y":"2","type":"1","color":"red"},{"x":"1","y":"3","type":"1","color":"blue"},{"x":"2","y":"3","type":"1","color":"blue"},{"x":"3","y":"3","type":"1","color":"blue"},{"x":"4","y":"3","type":"1","color":"blue"},{"x":"5","y":"3","type":"1","color":"blue"},{"x":"6","y":"3","type":"1","color":"blue"},{"x":"7","y":"3","type":"1","color":"blue"},{"x":"8","y":"3","type":"1","color":"blue"},{"x":"9","y":"3","type":"1","color":"blue"},{"x":"10","y":"3","type":"1","color":"blue"},{"x":"11","y":"3","type":"1","color":"blue"},{"x":"12","y":"3","type":"1","color":"blue"},{"x":"13","y":"3","type":"1","color":"blue"},{"x":"1","y":"4","type":"1","color":"orange"},{"x":"2","y":"4","type":"1","color":"orange"},{"x":"3","y":"4","type":"1","color":"orange"},{"x":"4","y":"4","type":"1","color":"orange"},{"x":"5","y":"4","type":"1","color":"orange"},{"x":"6","y":"4","type":"1","color":"orange"},{"x":"7","y":"4","type":"1","color":"orange"},{"x":"8","y":"4","type":"1","color":"orange"},{"x":"9","y":"4","type":"1","color":"orange"},{"x":"10","y":"4","type":"1","color":"orange"},{"x":"11","y":"4","type":"1","color":"orange"},{"x":"12","y":"4","type":"1","color":"orange"},{"x":"13","y":"4","type":"1","color":"orange"}]}]}';
    
    //nodeToRunOn.hide();
/*    nodeToRunOn.width(650);
    nodeToRunOn.height(480);
    $('html, body').animate({scrollTop: nodeToRunOn.offset().top},1000);
*/
    var movie = bonsai.run(
    document.getElementById('movie')
    /*nodeToRunOn.get(0)*/, 
    {
        /*
        code:function() {
            var text = new Text().addTo(stage);

            stage.on('message:levels', function(data){
                addLevels(data);
            });
            stage.sendMessage('ready', {});

        },*/
        levels:levels,
        width: widthToUse, 
        height: heightToUse, 
        framerate:60,
        url: 'scripts/arkanoid.js'
    });
    /*
    movie.on('load', function(){

        movie.on('message:ready', function() {
            // send a categorized message to the runner context
            movie.sendMessage('levels',{
                    levels: levels
            });
        });

    });
    */
}

Arkanoid.Menu = (function(space){
    var menuItems = ["start", "quit"];
    var menuObjects = [];
    var selectedItem=0;
    var element={};
    var arkanoidMenu={};
    var keyDown = {};
    var isActive;
    var node;
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
        
        $(document).keydown(function(e){
            
            if(!keyDown[keys[e.keyCode]])
                reactOnKey(keys[e.keyCode]);
            keyDown[keys[e.keyCode]]=true;
            
            // block future actions when up/down/left/right arrow been pressed
            if (keyDown['down'] || keyDown['up'] ||
                keyDown['left'] || keyDown['right']){
                return false;
            }
        });
        $(document).keyup(function(e){
            keyDown[keys[e.keyCode]]=false;
        });
    }
    function reactOnKey(key){
        if(key === 'go'){
            fireApp();
            return;
        }
        
        if(key === 'up'){
            selectedItem--;
            if (selectedItem<0)
                selectedItem = menuObjects.length-1;
        }
        if(key === 'down'){
            selectedItem++;
            if (selectedItem>=menuObjects.length)
                selectedItem=0;
        }
        colorItems();
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
            arkanoidMenu.remove();
            isActive=false;
            $(document).unbind('keydown');
            $(document).unbind('keyup');
            launchGame(node);
        }
    }
    return {
        initialize: initialize
    }
})(this);

