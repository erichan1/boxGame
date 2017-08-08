/*This is boxgame. There will be a red box on a white background. Walls will move from the right side towards the left. The box can be moved in any direction. If it collides with a box */

var myBox; //equivalent to myGamePiece in the tutorial.
var myObstacles;
var myWalls; 
var myScore;
var interval;
var intervaltwo;

//makes a stopWatch.
function stopWatch(initTime) {
    var self = this;
    this.interval;
    this.time=initTime;
    this.running=false;
    
    this.start = function() {
        this.running=true;
        printOne("Time: " + this.time);
        this.interval = setInterval(this.increment,1000);  
    }
    this.increment = function(){
        self.time+=1;
        printOne("Time: " + self.time);
    }
}

//MAIN: starts the game. Calls start() function in myGameArea. Creates a box, walls, stopwatch, and obstacles.
function startGame() {
    myWatch = new stopWatch(0);
    myWatch.start();
    myGameArea.start();
    myBox = new component(30,30,"red",10,120);
    myWalls = [new component(5,myGameArea.canvas.width,"orange",0,0), //top wall
               new component(myGameArea.canvas.height,5,"orange",0,0), //left wall
               new component(5,myGameArea.canvas.width,"orange",0,myGameArea.canvas.height-5), //bottom wall
               new component(myGameArea.canvas.height,5,"orange",myGameArea.canvas.width-5,0)]; //right wall
    myObstacles = [];
}

//VAR: creates the gamearea, which is a canvas.
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

//CLASS: constructor of objects(components) in canvas.
function component(height,width,color,x,y) {
    this.width=width;
    this.height=height;
    this.x=x;
    this.y=y;
    this.speedX=0;
    this.speedY=0;
    this.accelUpdate;
    this.wallsPassed = 0;//the variable used to update acceleration methods
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

//STATIC METHOD: handles collision with walls. Takes two components. 
function wallColHandle(myComponent){
    if(wallColDetect(myComponent)=='vertical') { 
        myComponent.x-=myComponent.speedX; //stops box right and left
    }
    if(wallColDetect(myComponent)=='horizontal'){
        myComponent.y-=myComponent.speedY; //stops box top and bottom
    }
}

//STATIC METHOD: detects collision with walls. returns string that indicates if it's the top/bottom or left/right walls. 
function wallColDetect(myComponent){
    if(myComponent.x+myComponent.width>=myGameArea.canvas.width || myComponent.x<=0) { 
        return 'vertical'; //if collided with side walls, then this is returned.
    }
    if(myComponent.y<=0 || myComponent.y+myComponent.height>=myGameArea.canvas.height){
        return 'horizontal'; //if collided with top or bottom, then this is returned.
    }
}

//STATIC METHOD: handles collision with components. Takes two components. 
function componentColHandle(myComponent,myComponent2){
     if(componentColDetect(myComponent,myComponent2)) { 
            myComponent.x-=myComponent.speedX;
            myComponent.y-=myComponent.speedY;//stops box right and left
    }
}

//STATIC METHOD: returns boolean if collision between components occurs
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

//STATIC METHOD: checks how many obstacles are on screen. Goes through myObstacles array. 
function numObstaclesOnScreen() {
    var numOnScreen=0;
    for(i=0;i<myObstacles.length;i++) {
        if(componentColDetect(myObstacles[i],myWalls[0]) || componentColDetect(myObstacles[i],myWalls[2])) {
            numOnScreen++;
        }
    }
    return numOnScreen;
}

//STATIC METHOD: returns random # between min and max. not sure if inclusive. 
function getRandomBetween(min,max) {
    return Math.random() * (max-min)+min;
}

/*
STATIC METHOD: 
interfaces the component with the keyboard. relies on window.addEventListener in myGameArea. 
sets speed when keyboard is pressed
*/ 
function keyboard(myComponent) {
    if(myGameArea.keys && myGameArea.keys[39]) {
            myComponent.setSpeedX(1); //makes box go right   
    }
    if(myGameArea.keys && myGameArea.keys[37]) {
            myComponent.setSpeedX(-1); //makes box go left
    }
    if(myGameArea.keys && myGameArea.keys[38]) {
            myComponent.setSpeedY(-1); //makes box go up
    }
    if(myGameArea.keys && myGameArea.keys[40]) {
            myComponent.setSpeedY(1); //makes box go down.
    }
}

//STATIC METHOD: updates game area. interval shown in var myGameArea.
function updateGameArea() {
    myGameArea.clear(); //clears game area
    
    myBox.setSpeedX(0); //sets speeds to 0
    myBox.setSpeedY(0);
    keyboard(myBox); //sets speed according to keyboard
    
    if(numObstaclesOnScreen()<1){
        gapPos = getRandomBetween(60,myGameArea.canvas.height);
        myObstacles.push(new component(myGameArea.canvas.height-gapPos,30,"green",myGameArea.canvas.width,0));
        myObstacles.push(new component(myGameArea.canvas.height,30,"green",myGameArea.canvas.width,myGameArea.canvas.height-gapPos+60));
        myBox.wallsPassed++;
        printTwo("Walls Passed: " + myBox.wallsPassed);
    }
    for(i=0;i<myObstacles.length;i++) {
        myObstacles[i].setSpeedX(-3);
        myObstacles[i].newPos();
        myObstacles[i].update();
    }
    
    for(i=0;i<myWalls.length;i++) {
        myWalls[i].update();
    }
    
    myBox.newPos(); //shifts x and y based on speed.
    myBox.update(); //draws myBox in the changed x and y position
    
    for(i=0;i<myWalls.length;i++) {
        componentColHandle(myBox,myWalls[i]);
    }
    wallColHandle(myBox); //pushes myBox out of walls 
    if(componentColDetect(myBox,myObstacles[myObstacles.length-1]) 
       || componentColDetect(myBox,myObstacles[myObstacles.length-2])) {
       window.alert('You lost!');
       clearInterval(myGameArea.interval);
       clearInterval(myWatch.interval);
    }
}

//STATIC METHOD: alters the HTML element jsprintOne with inputed string
function printOne(string) {
    document.getElementById("jsprintOne").innerHTML = string;
}

//STATIC METHOD: alters the HTML element jsprintOne with inputed string
function printTwo(string) {
    document.getElementById("jsprintTwo").innerHTML = string;
}





