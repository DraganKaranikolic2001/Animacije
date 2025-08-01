
const canvas= document.getElementById("canvas1");
const ctx=canvas.getContext("2d");
// let canvasWidth= canvas.width;
// let canvasHeight= canvas.height;

const AktivneAnimacije = new Map();

const symbols = [
    // { id:0 , src : "symbols/0.png", srcSprite:"sprites/0.png" ,width: 260, height: 260},
    { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
    { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},
    { id:3 , src : "symbols/3.png" ,srcSprite:"sprites/3.png" ,width: 260, height: 260},
    { id:4 , src : "symbols/4.png" ,srcSprite:"sprites/4.png" ,width: 260, height: 260},
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




const page= document.getElementById("main-container");
const dugme = document.getElementById("button");
const dugme2 = document.getElementById("button2");
const dugme3 = document.getElementById("button3");
dugme.addEventListener("click",()=>{drawSlot();});
dugme2.addEventListener("click",()=>{Spoji();});
dugme3.addEventListener("click",()=>{crtajAX();});

function resize()
{   
    // const width = page.clientWidth;
    // const height= page.clientHeight;
    // // if (window.innerWidth <= 1537 && window.innerHeight <= 696) {
    // //     canvas.style.width = (width*0.6)+"px";
    // //     canvas.style.height = (width*0.4)+"px";
    // //     canvas.style.left= "20%";

    // // } else {
    // //     canvas.style.width= (width*(0.64))+"px";
    // //     canvas.style.height= (width*(0.72))+"px";
    // //     canvas.style.left= "18%";
    // // }
    // canvas.style.height=(height*0.74) + "px";
    // canvas.style.width=(width*0.64) + "px";
    // canvas.style.left= "18%";


     // neka pocetna verzija doraditi 

    const bg = document.querySelector(".fullscreen-bg");
    const canvas = document.getElementById("canvas1");

    const rect = bg.getBoundingClientRect();
    

    console.log("rectwidth : " + rect.width);
    console.log("rectheight: " + rect.height);

    // Procenti u odnosu na originalnu sliku (1366x768)
    const dpr = window.devicePixelRatio || 1;
    const topRatio = 73 / 768;
   
    const top = rect.height * topRatio;
    
    canvas.style.top = `${top}px`;
    console.log("dpr : " +  dpr);
    console.log("TOP postavljen na:", canvas.style.top);
 
    if(dpr === 1.5){

    const leftRatio = (250 / 1366);
    const widthRatio = (580 / 1366);
   
    const heightRatio = (370 / 768);
    
    const left = rect.width * leftRatio;
    const width = rect.width * widthRatio;
    const height = rect.height * heightRatio;

    canvas.style.left = `${left}px`;
    const cssW    = rect.width * widthRatio;
    const cssH    = rect.height * heightRatio;

    console.log("left postavljen na:", left);
    // console.log("Stvarna style.top:", canvas.style.top);
    // console.log("canvas width : "  + canvas.width)


    canvas.width = width;
    canvas.height = height;
    
   
  // Unutrašnja rezolucija (bafer)
    canvas.width  = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    console.log("canvas width : "  + canvas.width)
    console.log("canvas height : "  + canvas.height)
    }
    else{
        
    const widthRatio = (442 / 1366);
    const leftRatio = (267 / 1366);
    const heightRatio = (296 / 768);

   
    const width = rect.width * widthRatio;
    const height = rect.height * heightRatio;
    const left = rect.width * leftRatio;
    
    canvas.style.left = `${left}px`;
    const cssW    = rect.width * widthRatio;
    const cssH    = rect.height * heightRatio;
     console.log("left postavljen na:", left);   
    // console.log("Stvarna style.top:", canvas.style.top);
    // console.log("canvas width : "  + canvas.width)

   
    canvas.width = width;
    canvas.height = height;
    
    console.log("dpr : " +  dpr);
  // Unutrašnja rezolucija (bafer)
    canvas.width  = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    console.log("canvas width : "  + canvas.width)
    console.log("canvas height : "  + canvas.height)
    }
    
  // Skaliraj koordinate da 1 logical px ~ 1 CSS px
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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



let drawSymbols;
   let sviSimboli;
let animacijaLoop= false;
function drawSlot(){
    const rows=3;
    const cols=5;

    if(drawSymbols && Array.isArray(drawSymbols)){
        for(let simbol of drawSymbols){
            if(simbol._animationID) cancelAnimationFrame(simbol._animationID);
            simbol._isRunning=false;
        }
    }
    AktivneAnimacije.clear();
    
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillRect(0,0,1,1);
    canvasWidth=canvas.width;
    canvasHeight=canvas.height;
    const offset = (canvasWidth / (window.devicePixelRatio || 1)) / 100;
    const dpr = window.devicePixelRatio || 1;
    let symWidth=(canvasWidth/5)/dpr-(4*offset);
    let symHeight=(canvasHeight/3)/dpr-(2*offset);
    console.log(symHeight);
    console.log(symWidth);
    drawSymbols = [];
   sviSimboli = [];
    for(let row=0;row<rows;row++){
        for(let col=0;col<cols;col++){
            const symbol=generateSymbol();
            const img= new Image();
            img.src=symbol.src;
            img.width=260;
            img.height=260;
            const offset = (canvasWidth / (window.devicePixelRatio || 1)) / 100;
            
            let x;
            let y;

            console.log( "Sirina canvasa : " + canvasWidth);
            console.log( "Visina canvasa : " + canvasHeight);
            if(dpr===1.5){
                 x= col * (symWidth+offset*4.2);
                 y= row * (symHeight+offset*2);
            }
            else{
                 x= col * (symWidth+offset*5);
                 y= row * (symHeight+offset*2);
            }
            

            // console.log("x: " + x);
            // console.log("y: " + y);
            drawSymbols.push({
                        id: symbol.id
,                       x: x,
                        y: y,
                        src: symbol.srcSprite,
                        srcStatic : symbol.src,
                        width: symWidth,
                        height: symHeight,
                        _isRunning: false,
                        _animationID : null
                    });

            sviSimboli.push({
                        id: symbol.id
,                       x: x,
                        y: y,
                        src: symbol.srcSprite,
                        srcStatic : symbol.src,
                        width: symWidth,
                        height: symHeight,
                        _isRunning: false,
                        _animationID : null
                    });                    

            img.onload= function(){
             
                    ctx.drawImage(img, x, y, symWidth, symHeight);
                
            }
           
        }
    }
    animacijaLoop=false;
    if (loopAnimacija) {
    clearTimeout(loopAnimacija);
    loopAnimacija = null;
    }
    dobitneLinije = [];
    setTimeout(()=>{
        Spoji();
    },700);
    

     console.log(drawSymbols);
}

let dobitneLinije=[];
let loopAnimacija=null;
let SviSimboli=[];

function Spoji(){
    console.log("POZVANA FJA");
    let x1;
    let x2;
    let brojac = 0
    let j;
    //Idemo kroz redove 
    for (let m = 0;m<3;m++){
        brojac=0;
        x1=drawSymbols[m*5]; //prvi element za svaki red
        j = m*5+1; // indeks za element nakon prvog u redu
        for (let i=0;i<4;i++){
            x2=drawSymbols[j];
            if(x1.id===x2.id){ // provera da li su isti 
                j++;
                brojac++
            }
        }
        console.log("brojac: " + brojac);
        if(brojac >= 2){
            // console.log("Imas 3 ili vise simbola spojena");
            ctx.strokeStyle = "red";
            let prom=5*m; // indeks za prvi element u nizu 
          
            while(0<=brojac){
                tempSimb=drawSymbols[prom];
                // startCanvasAnimation(1500,tempSimb);
                dobitneLinije.push(tempSimb); // pusujem u niz sve simbole koji su dobitni sa svim atributima {src,x,y,width,height,id}
                prom++; // prelazimo na sledeci koji je dobitan
                brojac--; 
                console.log("prom kroz while: " + prom);
            }

            console.log(dobitneLinije);

            if(dobitneLinije.length>0)
            {
                pokreniAnimacijuSvih();
            }  
        }
        else{
            console.log("nema nista");
        }
  
    }
        
    
}

function pokreniAnimacijuSvih(){
    for(let simbol of dobitneLinije){
        let y= simbol.y;
        let yPoz= y+(simbol.height/2);
        startCanvasAnimation(1800,simbol);
        // nacrtajLinije(simbol.x,canvasWidth-simbol.width/2,yPoz,dobitneLinije);
    }
    setTimeout(()=>{
            pokreniAnimLoop();
    },2600);
}

function pokreniAnimLoop() {
    //  if (loopAnimacija) {
    //     clearTimeout(loopAnimacija);
    //     loopAnimacija = null;
    // }
    // Grupisanje simbola po y vrednosti
    animacijaLoop=true;
    const grupePoY = {}; // pravimo dictionary za sortiranje po y vrednosti

    for (let simbol of dobitneLinije) {
        if (!grupePoY[simbol.y]) {
            grupePoY[simbol.y] = [];
        }

        //kako zna da treba simbol za y= 0 da ubaci u niz recnika grupePoY sa vrednoscu nula
        //Odgovor :  Zato što  eksplicitno se koristi vrednost simbol.y kao ključ u rečniku (grupePoY), i sam odlučuješ gde da ga ubaciš:
        grupePoY[simbol.y].push(simbol);
    }
    // console.log("Grupe po Y" + grupePoY);
    
    // Sortiranje y vrednosti (npr. 0, 50, 100)
    const yRedosled = Object.keys(grupePoY).map(Number).sort((a, b) => a - b);
    
    // console.log("YRedosled : " + yRedosled);
    
    let indeks = 0;

    function animirajSledecuGrupu() {
        
          if (!animacijaLoop || yRedosled.length === 0) return;
        const y = yRedosled[indeks];
        const grupa = grupePoY[y];

        let i =0;

        let duzina = grupa.length; 
        let startX= grupa[0].x; //prva x koordinata
        let endX=grupa[duzina-1].x; // kranja xx koordinata
        let yPoz = y+(grupa[0].height)/2; // sredina y svakog reda za crtanje linije
        // console.log("y : " + y);
        // console.log("yPoz : " + yPoz); 
        // console.log("start x" + startX);
        // console.log("end x" + endX);
        // console.log("ovo je i !!! : " +  i);

        // console.log(ctx.lineWidth);
        
      
        
        // console.log("Y: " + y);
        // console.log("Grupa: " + grupa);

        // Animacija svih simbola u toj grupi
        for (let simbol of grupa) {
            startCanvasAnimation(1800, simbol);
            i++;
        }
        
        // nacrtajLinije(startX,endX,yPoz,grupa);
        
        indeks = (indeks + 1) % yRedosled.length;
        loopAnimacija=setTimeout(animirajSledecuGrupu, 2600); // rekurzivni poziv fje da animira sve ostale grupe po vrednoscu Y 
    }

    animirajSledecuGrupu(); // pokreni prvu grupu
}




const frameInterval = 1000/30;

function startCanvasAnimation(duration,symbolObj){
    // console.log(symbolObj);
     if (!symbolObj || !symbolObj.src) return;
    // console.log("Pozvana startCanvas");
    if(symbolObj._isRunning) return;
    //Kontrola da ne dodje do poklapanja animacija 
    const key = `${symbolObj.x}_${symbolObj.y}`;
    const now = Date.now();
    if (AktivneAnimacije.has(key) && now - AktivneAnimacije.get(key) < 100) return;
    AktivneAnimacije.set(key, now);
    //
    if(symbolObj._animationID){
        cancelAnimationFrame(symbolObj._animationID);
        symbolObj._isRunning=false;
    }

    const spriteImage = new Image();
    spriteImage.src=symbolObj.src;
    // console.log(spriteImage);
    symbolObj._isRunning=true;
    spriteImage.onload = () => {
        const animationFunction = createAnimation(spriteImage,symbolObj);
        symbolObj._animationID=requestAnimationFrame(animationFunction);
    }
    setTimeout(()=>{
        symbolObj._isRunning=false;
        if(symbolObj._animationID){
            cancelAnimationFrame(symbolObj._animationID);
        }
        drawStaticLogo(symbolObj);
        AktivneAnimacije.delete(key);
    },duration);
}   

function createAnimation(image,symbolData){

    let frameRate = 0;
    let number = 0;
    let diff=0;
    let frameTimer = 0;
    // console.log("Pozvana createAnimation");


    let firstCall = true;
    return function animate(timmy){    
        // console.log(symbolData);
         if (!symbolData._isRunning) return;

        if(firstCall){
            number=timmy;
            firstCall=false;
        }
        
        if(timmy){
            diff=timmy-number;
            number=timmy;
        }
       diff = Math.max(10, Math.min(diff, 40));
        
        const SpriteWidth=image.width;
        const SpriteHeight= (image.height/24);

       if (frameRate === 0 && frameTimer === 0) {
        console.log("Diff: " + diff);
        }
        ctx.clearRect(symbolData.x, symbolData.y, symbolData.width, symbolData.height);

        // ctx.fillRect(0,0,1,1);

        frameTimer+=diff;
        if(frameTimer>=frameInterval){
            frameRate=(frameRate+1)%24;
            frameTimer-=frameInterval;
            // console.log("frameRate:", frameRate);
        }
        ctx.drawImage(image,0,frameRate*SpriteHeight,SpriteWidth,SpriteHeight,symbolData.x,symbolData.y,symbolData.width,symbolData.height);

        symbolData._animationID = requestAnimationFrame(animate);

    }
}

 const KesiraneSlike = new Map(); 

function drawStaticLogo(image){
    // console.log("Pozvana Static");
    ctx.clearRect(image.x, image.y, image.width, image.height);

    const kljuc = image.srcStatic;

    if (KesiraneSlike.has(kljuc)) {
        const keširanaSlika = KesiraneSlike.get(kljuc);
        ctx.drawImage(keširanaSlika, image.x, image.y, image.width, image.height);
    } else {
        const novaSlika = new Image();
        novaSlika.src = kljuc;

        novaSlika.onload = () => {
            KesiraneSlike.set(kljuc, novaSlika);
            ctx.drawImage(novaSlika, image.x, image.y, image.width, image.height);
        };
    }
    
}

// const endCanvas=(canvas.width)-symWidth/2;
let debljina = 2;
let increase = true;

function nacrtajLinije(startX , endX, y, grupa){
    
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = debljina;
    // const startTime = performance.now();
    // const trajanjeAnimacije= 1800;

    function crtaj(){
        // const proteklo= vreme-startTime;

         ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();
        ctx.moveTo(endX,y);
        ctx.lineTo(endCanvas,y);
        ctx.stroke();

        const sveZavrsene = grupa.every(simbol => !simbol._isRunning);

        if (sveZavrsene) {
            ctx.clearRect(startX, y - ctx.lineWidth / 2, (endCanvas - startX), ctx.lineWidth);

            for (let simbol of sviSimboli) {
                if (!simbol._isRunning) drawStaticLogo(simbol);
            }
        } else {
            requestAnimationFrame(crtaj);
        }
    }

    requestAnimationFrame(crtaj);
    
     
    

    // console.log("POZVANA FJA");
}

// function nacrtajLinije(startX, endX, y) {
//     let debljina = 2;
//     let increase = true;
//     const trajanjeAnimacije = 1800;
//     const startTime = performance.now();

//     function animacijaLinije(vreme) {
//         const proteklo = vreme - startTime;

        
//         ctx.clearRect(startX, y - 10, (endCanvas - startX), 20); // šire brišemo radi pulsa

    
//         ctx.beginPath();
//         ctx.strokeStyle = "yellow";
//         ctx.lineWidth = debljina;
//         ctx.moveTo(startX, y);
//         ctx.lineTo(endX, y);
//         ctx.stroke();
        
//         ctx.moveTo(endX, y);
//         ctx.lineTo(endCanvas, y);
//         ctx.stroke();

        
//         if (increase) {
//             debljina += 0.3;
//             if (debljina >= 4) increase = false;
//         } else {
//             debljina -= 0.3;
//             if (debljina <= 2) increase = true;
//         }

        
    
        
//         if (proteklo < trajanjeAnimacije) {
//             requestAnimationFrame(animacijaLinije);
//         } else {
//             // Očisti liniju kad animacija završi
//             ctx.clearRect(startX, y - 10, (endCanvas - startX), 20);
//             for (let simbol of sviSimboli) {
//                 drawStaticLogo(simbol);
//             }
//         }
//     }

//     requestAnimationFrame(animacijaLinije);
// }


// function crtajAX(){

//     ctx.strokeStyle = "yellow";
//     ctx.lineWidth = debljina;
//     ctx.moveTo(0,125);
//     ctx.lineTo(200,125);
//     ctx.stroke();

// }

// function crtajSvesimbole(){

//     for (let simbol of sviSimboli)
//             {
//                 drawStaticLogo(simbol);
//             }

// }


//canvas uvek da prati reelove, nakon sto bude pratio reelove racunacu 
// fja window.devicePixelRatio istraziti preko nje cu namestiti canvasa njima je zakucana 1.5

// dinamcki 16:9 za canvas ,  da se ne brisu simboli kad se resizuje , linije animacija kad treba 
// start , autoplay i ostale dugmice iz UI dodati 