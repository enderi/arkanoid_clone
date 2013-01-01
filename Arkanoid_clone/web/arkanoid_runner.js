/*
 *  This javascript script creates arkanoid instance in given dom node
 */
function runArkanoid(nodeToRunOn){
                    // ToDo
                    // load levels from web service

                    var levels = '{"levels":[{"level": "1","background":"","blocks":[{"x":"1","y":"2","type":"1","color":"red"},{"x":"2","y":"2","type":"1","color":"red"},{"x":"3","y":"2","type":"1","color":"red"},{"x":"4","y":"2","type":"1","color":"red"},{"x":"5","y":"2","type":"1","color":"red"},{"x":"6","y":"2","type":"1","color":"red"},{"x":"7","y":"2","type":"1","color":"red"},{"x":"8","y":"2","type":"1","color":"red"},{"x":"9","y":"2","type":"1","color":"red"},{"x":"10","y":"2","type":"1","color":"red"},{"x":"11","y":"2","type":"1","color":"red"},{"x":"12","y":"2","type":"1","color":"red"},{"x":"13","y":"2","type":"1","color":"red"},{"x":"1","y":"3","type":"1","color":"blue"},{"x":"2","y":"3","type":"1","color":"blue"},{"x":"3","y":"3","type":"1","color":"blue"},{"x":"4","y":"3","type":"1","color":"blue"},{"x":"5","y":"3","type":"1","color":"blue"},{"x":"6","y":"3","type":"1","color":"blue"},{"x":"7","y":"3","type":"1","color":"blue"},{"x":"8","y":"3","type":"1","color":"blue"},{"x":"9","y":"3","type":"1","color":"blue"},{"x":"10","y":"3","type":"1","color":"blue"},{"x":"11","y":"3","type":"1","color":"blue"},{"x":"12","y":"3","type":"1","color":"blue"},{"x":"13","y":"3","type":"1","color":"blue"},{"x":"1","y":"4","type":"1","color":"orange"},{"x":"2","y":"4","type":"1","color":"orange"},{"x":"3","y":"4","type":"1","color":"orange"},{"x":"4","y":"4","type":"1","color":"orange"},{"x":"5","y":"4","type":"1","color":"orange"},{"x":"6","y":"4","type":"1","color":"orange"},{"x":"7","y":"4","type":"1","color":"orange"},{"x":"8","y":"4","type":"1","color":"orange"},{"x":"9","y":"4","type":"1","color":"orange"},{"x":"10","y":"4","type":"1","color":"orange"},{"x":"11","y":"4","type":"1","color":"orange"},{"x":"12","y":"4","type":"1","color":"orange"},{"x":"13","y":"4","type":"1","color":"orange"}]}]}';
                    
                    var widthToUse = 650;
                    var heightToUse = 480;
                    
                    
                    //nodeToRunOn.hide();
                    nodeToRunOn.width(widthToUse);
                    nodeToRunOn.height(heightToUse);
                    $('html, body').animate({scrollTop: nodeToRunOn.offset().top},1000);

                    var movie = bonsai.run(
                    nodeToRunOn.get(0), 
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


