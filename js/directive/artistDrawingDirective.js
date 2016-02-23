angular.module('yoodle')

.directive("artistDrawing", function(){
  var newX;
  var newY;
  var oldX;
  var oldY;
  var drawingCallback= function(){};
  return{
  
    draw(oldX,oldY,newX,newY);
  };

});
