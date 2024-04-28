/* constants :) */
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var dx = 0; // ghost initial velocity
var dy = 0;
var ghostSpeed = 2;

var ghostSize = .6; 
var bgSize = .5;

var level = 0;
var levelChangeInterval = 300; // The time interval at which opacity changes (in milliseconds)
var levelMax = 4;
var levelMin = 0;   

/* load images!*/
// GHOST
var ghostImage = createImage('./art/ghost1.png');
var ghostX, ghostY;
// Set the initial x and y coordinates inside the onload event
ghostImage.onload = function() {
    ghostX = (canvas.width / 2) - ghostSize*(ghostImage.width / 2);
    ghostY = (canvas.height*.66) - ghostSize*(ghostImage.height / 2);
};

// BG
var bg = [new Image(), new Image(), new Image(), new Image()]; // bg
for (var i = 0; i < bg.length; i++) {
    var letter = String.fromCharCode(65 + i); // 65 is the ASCII value for 'A'
    bg[i].src = './art/atmo1-bg ' + letter + '.png';
}
var bgBase = createImage('./art/atmo1-bg.png');
var bgTop = createImage('./art/atmo1-bg fg.png');




/* draw images!*/
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // canvas
    ctx.drawImage(bgBase, 0, 0, bgSize*bgBase.width, bgSize*bgBase.height)

    /* BG BEFORE GHOST */
    for (var i = bg.length - 1; i >= level; i--) {
        if (bg[i]) {
            ctx.drawImage(bg[i], 0, 0, bgSize*bg[i].width, bgSize*bg[i].height);
        }    
    }

    /* GHOST */     
    ctx.drawImage(ghostImage, ghostX, ghostY, ghostSize*ghostImage.width, ghostSize*ghostImage.height); // Draw the ghost
    
    ghostX += dx; // move ghost if needed
    ghostY += dy;

    /* BG AFTER GHOST */
    for (var i = level; i >= 0; i--) {
        if (bg[i]) {
            ctx.drawImage(bg[i], 0, 0, bgSize*bg[i].width, bgSize*bg[i].height);
        }    }
    
    ctx.drawImage(bgTop, 0, 0, bgSize*bgTop.width, bgSize*bgTop.height)
    
    // Inside your draw function:
    ctx.font = '20px Arial'; // Set the font size and family
    ctx.fillStyle = 'black'; // Set the text color
    ctx.fillText('level: ' + level, 10, 50); // Draw the text on the canvas */

}
setInterval(draw, 10);

/* listen for user input!*/
var keyDownTime = null;
document.onkeydown = function(e) {
    var shiftPressed = e.shiftKey; // Check if the shift key is pressed
    switch (e.keyCode) {
        case 37:
            dx = -ghostSpeed;
            dy = 0;
            break;
        case 38:
            if (shiftPressed) {
                dy = -ghostSpeed;
            
            } else {
                dx = 0;
                dy = 0;
                if (keyDownTime === null && level <= levelMax) {
                    keyDownTime = Date.now();
                    increaseLevel(); // Call increaseLevel when the up key is pressed
            }
        }
            break;
        case 39:
            dx = ghostSpeed;
            dy = 0;
            break;
        case 40:
            if (shiftPressed) {
                dy = ghostSpeed;
            } else {
                dx = 0;
                dy = 0;
                if (keyDownTime === null && level >= levelMin) {
                    keyDownTime = Date.now();
                    decreaseLevel(); // Call decreaseLevel when the down key is pressed
                }
        }
            break;
    }
};

document.onkeyup = function(e) {
    dx = 0;
    dy = 0;
    keyDownTime = null;
};

function decreaseLevel() {
    if (level <= levelMin) { // If level is already at the minimum, return without changing level
        return;
    }
    if (keyDownTime !== null && level <= levelMax) {
        level -= 1;
        setTimeout(decreaseLevel, levelChangeInterval);
    }
}

function increaseLevel() {
    if (level >= levelMax) { // If level is already at the maximum, return without changing level
        return;
    }
    if (keyDownTime !== null && level >= levelMin) {
        level += 1;
        setTimeout(increaseLevel, levelChangeInterval);
    }
}

function createImage(src) {
    var img = new Image();
    img.src = src;
    return img;
}