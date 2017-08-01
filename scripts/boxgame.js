/*This is boxgame. There will be a red box on a white background. Walls will move from the right side towards the left. The box can be moved in any direction. If it collides with a box */

var myBox; //equivalent to myGamePiece in the tutorial.
var myObstacles;
var myObstacle;
var myScore;

//starts the game. Calls start() function in myGameArea. Creates a new box. 
function startGame() {
    myGameArea.start();
    myBox = new component(30,30,"red",10,120);
    myObstacle = new component(120,30,"green",120,90);
}

//creates the gamearea, which is a canvas.
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval=setInterval(updateGameArea, 10); 
        
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
    this.accelUpdate; //the variable used to update acceleration methods
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
    this.incrementSpeedX = function(increment) {
        this.speedX+=increment;
    }
    this.incrementSpeedY = function(increment) {
        this.speedY+=increment;
    }
    this.setSpeedZero = function() {
        clearInterval(this.accelUpdate);
        this.speedX = 0;
        this.speedY = 0;
    }
    //accelerates box up. sets the global variable accelUpdate to set an interval that calls moveUp every second. this increases speedY by -1. 
    this.setAccelX = function(xIncrement,time) {
        accelUpdate=setInterval(this.speedX+=xIncrement,time);
    }
    this.setAccelY = function(yIncrement,time) {
        accelUpdate=setInterval(this.speedY+=yIncrement,time);
    }
}
//controlled by a bunch of different things. in html, can update game area thru buttons. here, using keyboard. can also use touch screen and mouse. 

//handles collision with walls. Takes two components. 
function wallColHandle(myComponent){
    if(myComponent.x+myComponent.width>=myGameArea.canvas.width || myComponent.x<=0) { 
        myComponent.x-=myComponent.speedX; //stops box right and left
    }
    if(myComponent.y<=0 || myComponent.y+myComponent.height>=myGameArea.canvas.height){
        myComponent.y-=myComponent.speedY; //stops box top and bottom
    }
}

function componentColHandle(myComponent,myComponent2){
     if(componentColDetect(myComponent,myComponent2)) { 
            myComponent.x-=myComponent.speedX;
            myComponent.y-=myComponent.speedY;//stops box right and left
    }
} 

function componentColDetect(myComponent,myComponent2){
     if(myComponent.x+myComponent.width>=myComponent2.x 
        && myComponent.y+myComponent.height>=myComponent2.y 
        && myComponent.x<=myComponent2.x+myComponent2.width
        && myComponent.y<=myComponent2.y+myComponent2.height) { 
        return true;
    }
    else {
        return false;
    }
} 
     


function updateGameArea() {
    myGameArea.clear();
    myBox.setSpeedX(0);
    myBox.setSpeedY(0);
    
    if(myGameArea.keys && myGameArea.keys[39]) {
            //myBox.incrementSpeedX(4);
            //myBox.setAccelX(4,50);
            myBox.setSpeedX(1); //makes box go right   
    }
    if(myGameArea.keys && myGameArea.keys[37]) {
            //myBox.incrementSpeedX(-4);
            myBox.setSpeedX(-1); //makes box go left
    }
    if(myGameArea.keys && myGameArea.keys[38]) {
            //myBox.incrementSpeedY(-4);
            myBox.setSpeedY(-1); //makes box go up
    }
    if(myGameArea.keys && myGameArea.keys[40]) {
            //myBox.incrementSpeedY(4);
            myBox.setSpeedY(1); //makes box go down.
    }
    myBox.newPos();
    myBox.update();
    myObstacle.update();
    wallColHandle(myBox);
    componentColHandle(myBox,myObstacle);
}

function print() {
    return document.body.childNodes.length;
}





