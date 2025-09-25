let animationRunning=false;
let animationID=null;

const canvas= document.getElementById("canvas1");
const ctx=canvas.getContext('2d');

const SpriteImage= new Image();

SpriteImage.src="images/sprite.png";

canvas.width=890;
canvas.height=100;

const CANVAS_WIDTH=canvas.width;
const CANVAS_HEIGHT=canvas.height;

console.log("canvas width:",canvas.width);
console.log(CANVAS_WIDTH);


const SpriteWidth=SpriteImage.width;
const SpriteHeight=SpriteImage.height/30;
let frameRate=0;
let gameFrame=0;
let number = 0;
const staggerFrame=3;
let diff=null;
let x = 0;
let frameTimer = 0; // piksela u sekundi
const frameInterval= 1000/30;

function animate(timmy){
    if(timmy){
       diff = timmy-number;
        // console.log("frame",diff);
        number=timmy;
    }
    if(!animationRunning)return false;
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    ctx.fillRect(0,0,1,1);
    //ctx.drawImage(SpriteImage,sx,sy,sw,sh,dx,dy,dw,dh);
    console.log(SpriteWidth);
    console.log(SpriteHeight);
    console.log("canvas"+CANVAS_WIDTH);
    console.log("canvas heighy"+CANVAS_HEIGHT);
  
    frameTimer += diff;
    if (frameTimer >= frameInterval) {
        frameRate = (frameRate + 1) % 30; 
        // console.log(frameTimer);
        frameTimer = 0;
        
    }
    ctx.drawImage(SpriteImage,0,frameRate*SpriteHeight,SpriteWidth,SpriteHeight,0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    
  
    // if (gameFrame % staggerFrame === 1) {
    //     frameRate = (frameRate + 1) % 30; 
    // }
    // gameFrame++;
    
    animationID=requestAnimationFrame(animate);
}
 
function startCanvasAnimation(duration) {
    animationRunning = true;
    animate(); 

    setTimeout(() => {
        animationRunning = false;
        cancelAnimationFrame(animationID);
        drawStaticLogo(); 
    }, duration); 
}

// animate();
 function drawStaticLogo() {
    const logoImg = new Image();
    logoImg.src = "images/static.png";
    logoImg.onload = () => {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.drawImage(logoImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        console.log(logoImg.width);
        console.log(logoImg.height);
    };
}


// function animate(timmy){
//     if(timmy){
//        diff = timmy-number;
//         // console.log("frame",diff);
//         number=timmy;
//     }
//     if(!animationRunning)return false;
//     ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
//     ctx.fillRect(0,0,1,1);
//     //ctx.drawImage(SpriteImage,sx,sy,sw,sh,dx,dy,dw,dh);
//     // console.log(SpriteWidth);
//     // console.log(SpriteHeight);
//     // console.log("canvas"+CANVAS_WIDTH);
//     // console.log("canvas heighy"+CANVAS_HEIGHT);
//     // update(diff);
//     console.log(diff);
//     ctx.drawImage(SpriteImage,0,frameRate*SpriteHeight,SpriteWidth,SpriteHeight,0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    
  
//     if (gameFrame % staggerFrame === 2) {
//         frameRate = (frameRate + 1) % 30; // animacija ima 30 frame-ova
//     }
//     gameFrame++;
    
//     animationID=requestAnimationFrame(animate);
// }