var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var startX = 0;
var startY = 0;
var drawing = false;

canvas.onmousedown = function(event) {
  startX = event.x;
  startY = event.y;
  drawing = true;
  console.log(event);
};

canvas.onmousemove = function(event) {
  if (drawing) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(event.x, event.y);
    ctx.stroke();

    startX = event.x;
    startY = event.y;
  }
};

canvas.onmouseup = function(event) {
  drawing = false;
};
