/*This is boxgame. There will be a red box on a white background. Walls will move from the right side towards the left. The box can be moved in any direction. If it collides with a box */

var myBox; //equivalent to myGamePiece in the tutorial.
var myObstacles;
var myScore;
var accelUpdate;

//starts the game. Calls start() function in myGameArea. Creates a new box. 
function startGame() {
    myGameArea.start();
    myBox = new component(30,30,"red",10,120);
}

//creates the gamearea, which is a canvas.
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval=setInterval(updateGameArea, 20); 
        
        window.addEventListener('keydown',function(e) {
            myGameArea.keys= (myGameArea.keys || [] );
            myGameArea.keys[e.keyCode] = true; 
        })
        window.addEventListener('keyup',function(e) {
            myGameArea.keys[e.keyCode]=false;
        })
    },
    clear: function() {
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    }
}

//constructor of objects(components) in canvas.
function component(height,width,color,x,y) {
    this.width=width;
    this.height=height;
    this.x=x;
    this.y=y;
    this.speedX=0;
    this.speedY=0;
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle=color;
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }  
    this.newPos = function() {
        this.x+=this.speedX;
        this.y+=this.speedY;
    }
    this.setSpeedY = function(speedY) {
        this.speedY = speedY;
    }
    this.setSpeedX = function(speedX) {
        this.speedX = speedX;
    }  
}
//controlled by a bunch of different things. in html, can update game area thru buttons. here, using keyboard. can also use touch screen and mouse. 
function updateGameArea() {
    myGameArea.clear();
    myBox.setSpeedX(0);
    myBox.setSpeedY(0);
    if(myGameArea.keys && myGameArea.keys[39]) {
        myBox.setSpeedX(1); //makes box go right
    }
    if(myGameArea.keys && myGameArea.keys[37]) {
        myBox.setSpeedX(-1); //makes box go left
    }
    if(myGameArea.keys && myGameArea.keys[38]) {
        myBox.setSpeedY(-1); //makes box go up
    }
    if(myGameArea.keys && myGameArea.keys[40]) {
        myBox.setSpeedY(1); //makes box go down
    }
    /*
    if(myBox.x==myGameArea.width || myBox.y==myGameArea.length){
       myBox.stopMove();
       }
    */
    myBox.newPos();
    myBox.update();
}

//stops movement of the box when you let go of mouse. still need to code that in. the clearInterval part clears the acceleration if buttons accelerate the box. kinda messy though. 
function stopMove() {
    clearInterval(accelUpdate);
    this.speedX = 0;
    this.speedY = 0;
}



//accelerates box up. sets the global variable accelUpdate to set an interval that calls moveUp every second. this increases speedY by -1. 
function accelUp() {
    accelUpdate=setInterval(moveUp,1000);
}
function accelDown() {
    accelUpdate=setInterval(moveDown,1000);
}
function accelLeft() {
    accelUpdate=setInterval(moveLeft,1000);
}
function accelRight() {
    accelUpdate=setInterval(moveRight,1000);
}

function print() {
    return document.body.childNodes.length;
}





