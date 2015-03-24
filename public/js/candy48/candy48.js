function drawTextCentered(context, text, x, y, fontHeight, fontName) {
  context.font = fontHeight + 'px ' + fontName;
  var textWidth = context.measureText(text).width;

  var actualX = x - (textWidth / 2);
  var actualY = y - (fontHeight / 2);

  context.fillText(text, actualX, actualY);
}

function drawRect(x, y, w, h, color) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, radius, color) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.fill();
}

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var SCREEN_WIDTH = ctx.canvas.width;
var SCREEN_HEIGHT = ctx.canvas.height;

var shapes = new Grid(5);

var ua = navigator.userAgent.toLowerCase();
var android = ua.indexOf('android') > -1 ? true : false;
var ios = ( ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1  ) ?
true : false;
// this will create some extra space on the
// page, allowing us to scroll past
// the address bar, thus hiding it.
if (android || ios) {
  canvas.style.marginTop = (window.innerHeight + 50) + 'px';
}

// we use a timeout here because some mobile
// browsers don't fire if there is not
// a short delay
window.setTimeout(function() {
  window.scrollTo(0,1);
}, 1);

function draw() {
  ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  ctx.fillStyle = 'white';
  drawTextCentered(ctx, "Score: " + shapes.score, SCREEN_WIDTH/2, 580, 50, 'Ariel');
  for(var i = 0; i < shapes.cells.length; i++) {
    for(var j = 0; j < shapes.cells[i].length; j++) {
      if (shapes.cells[i][j]) {
        var shape = shapes.cells[i][j];
        var img = new Image();
        img.src = "shapes/" + shape.shape + ".png"
        ctx.drawImage(img,shape.xlocation(j,i), shape.ylocation(j,i));
        //drawCircle(shape.xlocation(j,i), shape.ylocation(j,i), shape.radius, shape.color);
      }
    }
  }
}

function tick() {

  shapes.threes();

  if(shapes.available_cells().length === 0){
    ctx.strokeStyle = 'white'
    ctx.fillStyle = 'white';
    drawTextCentered(ctx, "Game Over!", SCREEN_WIDTH/2, SCREEN_HEIGHT/2, 50, 'Ariel');

    return false;
  }
  return true;
}

function loop(time) {
  draw();

  if (tick()) {
    window.requestAnimationFrame(function(time) {
      loop(time);
    });
  }
}

function moveRight () {
  var size = shapes.cells.length;
  for(var i = 0; i < size; i++) {
    var arr1 = [];
    var arr2 = [];
    for(var j = 0; j < size; j++) {
      s = shapes.cells[i].pop()
      if(!s){
        arr1.push(null);
      }
      else {
        arr2.push(s);
      }
    }
    shapes.cells[i] = arr1.concat(arr2.reverse());
  }
  shapes.generate_new_shape();
}

function moveLeft() {
  var size = shapes.cells.length;
  for(var i = 0; i < size; i++) {
    var arr1 = [];
    var arr2 = [];
    for(var j = 0; j < size; j++) {
      s = shapes.cells[i].pop()
      if(!s){
        arr1.push(null);
      }
      else {
        arr2.push(s);
      }
    }
    shapes.cells[i] = arr2.reverse().concat(arr1);
  }
  shapes.generate_new_shape();
}

function moveUp() {
  var size = shapes.cells.length;
  for(var i = 0; i < size; i++) {
    arr1 = [];
    for(var j = 0; j < size; j++) {
      s = shapes.cells[j][i];
      shapes.cells[j][i] = null;
      if(s) {
        arr1.push(s);
      }
    }
    arr1 = arr1.reverse();
    for(var j = 0; j < size; j++) {
      if(arr1.length > 0) {
        shapes.cells[j][i] = arr1.pop();
      }
    }
  }
  shapes.generate_new_shape();
}

function moveDown() {
  var size = shapes.cells.length;
  for(var i = 0; i < size; i++) {
    arr1 = [];
    arr2 = [];
    for(var j = 0; j < size; j++) {
      s = shapes.cells[j][i];
      shapes.cells[j][i] = null;
      if(s) {
        arr1.push(s);
      }
      else {
        arr2.push(null)
      }
    }
    arr1 = arr1.reverse();
    for(var j = 0; j < size; j++) {
      if(arr2.length > 0) {
        shapes.cells[j][i] = arr2.pop();
      }
      else {
        shapes.cells[j][i] = arr1.pop()
      }
    }
  }
  shapes.generate_new_shape();
}


function keyDown(event) {
  var handled = true;

  switch (event.keyCode) {

  case RIGHT_KEY:
    moveRight();
    break;
  case LEFT_KEY:
    moveLeft()
    break;
  case UP_KEY:
    moveUp()
    break;
  case DOWN_KEY:
    moveDown()
    break;
  default:
    handled = false;
    break;
  }

  if (handled) {
    event.preventDefault();
  }
}

function keyUp(event) {
  var handled = true;

  switch (event.keyCode) {

  default:

    break;
  }

  if (handled) {
    event.preventDefault();
  }
}

function swipedetect(el, callback){

  var touchsurface = el,
  swipedir,
  startX,
  startY,
  distX,
  distY,
  threshold = 150, //required min distance traveled to be considered swipe
  restraint = 100, // maximum distance allowed at the same time in perpendicular direction
  allowedTime = 300, // maximum time allowed to travel that distance
  elapsedTime,
  startTime,
  handleswipe = callback || function(swipedir){}

  touchsurface.addEventListener('touchstart', function(e){
    var touchobj = e.changedTouches[0]
    swipedir = 'none'
    dist = 0
    startX = touchobj.pageX
    startY = touchobj.pageY
    startTime = new Date().getTime() // record time when finger first makes contact with surface
    e.preventDefault()
  }, false)

  touchsurface.addEventListener('touchmove', function(e){
    e.preventDefault() // prevent scrolling when inside DIV
  }, false)

  touchsurface.addEventListener('touchend', function(e){
    var touchobj = e.changedTouches[0]
    distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
    distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
    elapsedTime = new Date().getTime() - startTime // get time elapsed
    if (elapsedTime <= allowedTime){ // first condition for awipe met
      if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
        swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
      }
      else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
        swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
      }
    }
    handleswipe(swipedir)
    e.preventDefault()
  }, false)
}

//USAGE:
swipedetect(canvas, function(swipedir){
  switch (swipedir) {

    case 'right':
      moveRight();
      break;
    case 'left':
      moveLeft()
      break;
    case 'up':
      moveUp()
      break;
    case 'down':
      moveDown()
      break;
    default:
      break;
    }
})


function run() {
  window.onkeydown = keyDown;
  window.onkeyup = keyUp;

  window.requestAnimationFrame(function(time) {
    loop(time);
  });
}

run();
