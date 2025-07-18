const canvas= document.getElementById("canvas1");
const ctx=canvas.getContext("2d");
const canvasWidth= canvas.width;
const canvasHeight= canvas.height;

const symbols = [
    { id:0 , src : "symbols/0.png" ,width: 260, height: 260},
    { id:1 , src : "symbols/1.png" ,width: 260, height: 260},
    // { id:2 , src : "symbols/2.png" ,width: 260, height: 260},
    // { id:3 , src : "symbols/3.png" ,width: 260, height: 260},
    // { id:4 , src : "symbols/4.png" ,width: 260, height: 260},
    // { id:5 , src : "symbols/5.png" ,width: 260, height: 260},
    // { id:6 , src : "symbols/6.png" ,width: 260, height: 260},
    // { id:7 , src : "symbols/7.png" ,width: 260, height: 260},
    // { id:8 , src : "symbols/8.png" ,width: 260, height: 260},
    // { id:9 , src : "symbols/9.png" ,width: 260, height: 260},
    // { id:10 , src : "symbols/10.png" ,width: 260, height: 260}
];

 function generateSymbol(){
    const randomIndex= Math.floor(Math.random()*symbols.length);
    return symbols[randomIndex];
}



function drawSlot(){
    const rows=2
    const cols=2;
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
            const imgWidth=img.width;
            const imgHeight=img.height;
            console.log(offset);

            drawSymbols.push({id: symbol.id});

            img.onload= function(){
                if(row===0){
                    const x= offset;
                    const y= col * symHeight;
                    ctx.drawImage(img,0,0,imgWidth,imgHeight, x, y, symWidth, symHeight); 
                    // ctx.strokeStyle = "red";
                    // ctx.strokeRect(x, y, symWidth, symHeight);
                }
                else if(row === 1 )
                {
                    const x= row * (symWidth+offset*4.7);
                    const y= col * symHeight;
                    ctx.drawImage(img,0,0,imgWidth,imgHeight, x, y, symWidth, symHeight);
                    // ctx.strokeStyle = "red";
                    // ctx.strokeRect(x, y, symWidth, symHeight);
                }
                else if (row===2)
                {
                    const x= row * (symWidth+offset*4.1);
                    const y= col * symHeight;
                    ctx.drawImage(img, x, y, symWidth, symHeight);
                }
                else{
                    const x= row * (symWidth+offset*4);
                    const y= col * symHeight;
                    ctx.drawImage(img, x, y, symWidth, symHeight);
                    //   ctx.strokeStyle = "red";
                    // ctx.strokeRect(x, y, symWidth, symHeight);
                }
                
            }
            console.log(drawSymbols);
        }
    }
}

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
