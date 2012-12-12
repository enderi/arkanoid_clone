/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function(){
    var context = $("#gamearea")[0].getContext("2d");
    context.clearRect(0,0,640,480);
    context.fillStyle = "rgb(60,60,60)";
    context.fillRect(0,0,640,480);
    context.clearRect(21,21,598,450);
    context.fillStyle = "rgb(0,230,0)";
    for(var i=21;i<598;i=i+46){
        context.fillStyle = "rgb(0,0,0)";
        context.fillRect(i,100,46,25);
        context.fillStyle = "rgb(0,230,0)";
        context.fillRect(i+1,101,44,23);
    }
});



Blocks = Backbone.Model.extend({
    initialize: function(){
        // blocks:
        
    }
});