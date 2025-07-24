const canvas= document.getElementById("canvas1");
const ctx=canvas.getContext("2d");
const canvasWidth= canvas.width;
const canvasHeight= canvas.height;

const symbols = [
    { id:0 , src : "symbols/0.png", srcSprite:"sprites/0.png" ,width: 260, height: 260},
    { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
    // { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},
    // { id:3 , src : "symbols/3.png" ,srcSprite:"sprites/3.png" ,width: 260, height: 260},
    // { id:4 , src : "symbols/4.png" ,srcSprite:"sprites/4.png" ,width: 260, height: 260},
    // { id:5 , src : "symbols/5.png" ,srcSprite:"sprites/5.png" ,width: 260, height: 260},
    // { id:6 , src : "symbols/6.png" ,srcSprite:"sprites/6.png" ,width: 260, height: 260},
    // { id:7 , src : "symbols/7.png" ,srcSprite:"sprites/7.png" ,width: 260, height: 260},
    // { id:8 , src : "symbols/8.png" ,srcSprite:"sprites/8.png" ,width: 260, height: 260},
    // { id:9 , src : "symbols/9.png" ,srcSprite:"sprites/9.png" ,width: 260, height: 260},
    // { id:10 , src : "symbols/10.png" ,srcSprite:"sprites/10.png" ,width: 260, height: 260}
];

 function generateSymbol(){
    const randomIndex= Math.floor(Math.random()*symbols.length);
    return symbols[randomIndex];
}

    

    


function drawSlot(){
    const rows=3;
    const cols=5;
    const symWidth=50;
    const symHeight=50;
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    ctx.fillRect(0,0,1,1);

    drawSymbols = [];
    for(let row=0;row<rows;row++){
        for(let col=0;col<cols;col++){
            const symbol=generateSymbol();
            const img= new Image();
            img.src=symbol.src;
            img.width=260;
            img.height=260;
            const offset= canvasWidth/100;
            

            const x= col * (symWidth+offset*4);
            const y= row * symHeight;
            drawSymbols.push({
                        id: symbol.id
,                       x: x,
                        y: y,
                        src: symbol.srcSprite,
                        srcStatic : symbol.src,
                        width: symWidth,
                        height: symHeight
                    });

            img.onload= function(){
                // if(row===0){
                //     const x= col * symHeight;
                //     const y= offset;
                //     ctx.drawImage(img,0,0,imgWidth,imgHeight, x, y, symWidth, symHeight); 
                //     // ctx.strokeStyle = "red";
                //     // ctx.strokeRect(x, y, symWidth, symHeight);
                // }
                // else if(row === 1 )
                // {
                //     const x= col * (symWidth+offset*4.7);
                //     const y= row * symHeight;
                //     ctx.drawImage(img,0,0,imgWidth,imgHeight, x, y, symWidth, symHeight);
                //     // ctx.strokeStyle = "red";
                //     // ctx.strokeRect(x, y, symWidth, symHeight);
                // }
                // else if (row===2)
                // {
                //     const x= col * (symWidth+offset*4.1);
                //     const y= row * symHeight;
                //     ctx.drawImage(img, x, y, symWidth, symHeight);
                // }
                // else{
                   
                    ctx.drawImage(img, x, y, symWidth, symHeight);

                    //   ctx.strokeStyle = "red";
                    // ctx.strokeRect(x, y, symWidth, symHeight);
                // }
                
            }
           
        }
    }
     console.log(drawSymbols);
}

let dobitneLinije=[];
let loopAnimacija=null;
let currentIndex=0;
let linijezaCrtanje;

function Spoji(){
    let x1;
    let x2;
    let brojac = 0
    let j;
    for (let m = 0;m<3;m++){
        brojac=0;
        x1=drawSymbols[m*5];
        j = m*5+1;
        for (let i=0;i<4;i++){
            x2=drawSymbols[j];
            if(x1.id===x2.id){
                j++;
                brojac++
            }
        }
        console.log("brojac: " + brojac);
        if(brojac >= 2){
            console.log("Imas 3 ili vise simbola spojena");
            ctx.strokeStyle = "red";
            let prom=5*m;
            let startX=drawSymbols[prom].x;
            let startY=drawSymbols[prom].y;
            while(0<=brojac){
                tempSimb=drawSymbols[prom];
                // console.log(tempSimb);
                // tempX=tempSimb.x;
                // tempY=tempSimb.y;
                // symWidth=tempSimb.width;
                // symHeight=tempSimb.height;
                console.log(tempSimb);
                startCanvasAnimation(1500,tempSimb);
                // dobitneLinije.push(tempSimb);
                // ctx.strokeRect(tempX, tempY, symWidth, symHeight);
                prom++;
                brojac--;
                console.log("prom kroz while: " + prom);
                
            }

            //radi ali samo preko i ako ima 2 linije koje spaja ne radi jer prvu samo prepozna ali posle ne :(
            console.log(drawSymbols[prom]);
            symHeight=drawSymbols[0].height;
            symWidth=drawSymbols[0].width;
            
            let endX;
            let endY;
            if(brojac===-1 || prom===15)
            {
               endX=drawSymbols[prom-1].x;
               endY=drawSymbols[prom-1].y;
            }
            else {
               endX=drawSymbols[prom].x;
               endY=drawSymbols[prom].y;
            }
            
            
            
            endY=endY+symHeight/2;
            console.log("Pocetno x:" + startX);
            console.log("Pocetno Y:" + startY);
            console.log("Kraj x:" + endX);
            console.log("Kraj y:" + endY);
            // setTimeout(() => {
            ctx.beginPath();
            ctx.moveTo(startX, endY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = "yellow";
            ctx.lineWidth = 2;
            ctx.stroke();
            let endCanvas=canvasWidth-symWidth/2;
            ctx.moveTo(endX,endY);
            ctx.lineTo(endCanvas,endY);
            ctx.stroke();
            //  }, 1500); // istovremeno kad i animacija prestaje

             
        }
                
        else{
            console.log("nema nista");
        }
        // console.log("J: " + j);
        // console.log("X1: " + x1.id);
        // console.log("X2: " + x2.id);
        
    }
        
    
}

const dugme2 = document.getElementById("button2");
dugme2.addEventListener("click",()=>{Spoji();});

const dugme = document.getElementById("button");

dugme.addEventListener("click",()=>{drawSlot();});


const page= document.getElementById("main-container");

function resize()
{   
    const width = page.clientWidth;
    const height= page.clientHeight;
    if (window.innerWidth <= 1537 && window.innerHeight <= 696) {
        canvas.style.width = (width*0.6)+"px";
        canvas.style.height = (height*0.72)+"px";
        canvas.style.left= "20%";

    } else {
        canvas.style.width= (width*(0.64))+"px";
        canvas.style.height= (height*(0.72))+"px";
        canvas.style.left= "18%";
    }
    
}

function resizeAndLoadEvents(fns){
    fns.forEach(fn=>{
        window.addEventListener("resize",fn);
        window.addEventListener("load",fn);
    });
}
resizeAndLoadEvents([
    resize
]);




    
    const frameInterval = 1000/60;

  


function startCanvasAnimation(duration,symbolObj){
    // console.log(symbolObj);
    const spriteImage = new Image();
    spriteImage.src=symbolObj.src;
    // console.log(spriteImage);
    animationisRunning=true;
    spriteImage.onload = () => {
        const animationFunction = createAnimation(spriteImage,symbolObj);
        animationID=requestAnimationFrame(animationFunction);
    }
    setTimeout(()=>{
        animationisRunning=false;
        cancelAnimationFrame(animationID);
        drawStaticLogo(symbolObj);
    },duration);
}   

function createAnimation(image,symbolData){

    let frameRate = 0;
    let number = 0;
    let diff=null;

    let frameTimer = 0;

    return function animate(timmy){    
        // console.log(symbolData);
        const SpriteWidth=image.width;
        const SpriteHeight= (image.height/24);
        if(timmy){
            diff=timmy-number;
            number=timmy;
        }
        if(!animationisRunning) return false;

        ctx.clearRect(0,0,drawSymbols.width,drawSymbols.height);
        ctx.fillRect(0,0,1,1);

        frameTimer+=diff;
        if(frameTimer>=frameInterval){
            frameRate=(frameRate+1)%24;
            frameTimer=0;
        }
        ctx.drawImage(image,0,frameRate*SpriteHeight,SpriteWidth,SpriteHeight,symbolData.x,symbolData.y,symbolData.width,symbolData.height);

        animationID= requestAnimationFrame(animate);

    }
}

  

function drawStaticLogo(image){
    const simbol= new Image();
    simbol.src=image.srcStatic;
    simbol.onload= () =>{
        ctx.clearRect(image.x,image.y,image.width,image.height);
        ctx.drawImage(simbol,image.x,image.y,image.width,image.height);
    }
}