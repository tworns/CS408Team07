var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var startX = 0;
var startY = 0;
var drawing = false;

canvas.onmousedown = function(event) {
  startX = event.offsetX-45;
  startY = event.offsetY-45;
  drawing = true;
};

canvas.onmousemove = function(event) {
  if (drawing) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(event.offsetX-45, event.offsetY-45);
    ctx.stroke();

    startX = event.offsetX-45;
    startY = event.offsetY-45;
  }
};

canvas.onmouseup = function(event) {
  drawing = false;
};
