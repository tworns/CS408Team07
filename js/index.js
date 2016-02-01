var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var startX = 0;
var startY = 0;
var drawing = false;

canvas.onmousedown = function(event) {
  startX = event.offsetX;
  startY = event.offsetY;
  drawing = true;
};

canvas.onmousemove = function(event) {
  if (drawing) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();

    startX = event.offsetX;
    startY = event.offsetY;
  }
};

canvas.onmouseup = function(event) {
  drawing = false;
};
