
// const canvas= document.getElementById("canvas1");
// const ctx=canvas.getContext("2d");
// let canvasWidth= canvas.width;
// let canvasHeight= canvas.height;

const AktivneAnimacije = new Map();

// [DODATO] Globalni ID spina i set za tajmere
let currentSpinId = 0;
const pendingTimers = new Set();


const symbols = [
    // { id:0 , src : "symbols/0.png", srcSprite:"sprites/0.png" ,width: 260, height: 260},
    { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
    { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},
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




const page= document.getElementById("main-container");
const dugme = document.getElementById("button");
const dugme2 = document.getElementById("button2");

dugme.addEventListener("click",()=>{drawSlot();});
dugme2.addEventListener("click",()=>{Spoji();});


const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

function resize() {
  const container = document.getElementById("main-container");
  const dpr = window.devicePixelRatio || 1;

  // Dimenzije pozadinske slike (pikseli fajla)
  const DESIGN_W = 1366;
  const DESIGN_H = 768;

  // 2) Koordinate “reels” okvira unutar te slike (u pikselima fajla)
  // OVO SU TVOJE VREDNOSTI IZ RANIJE VERZIJE:
  const REELS = {
    left: 175,
    top:  75,
    width: 1035,
    height: 570
  };

  // 3) Koliko je slika zaista velika na ekranu (object-fit: contain)
  const contW = container.clientWidth;
  const contH = container.clientHeight;

  const scale = Math.min(contW / DESIGN_W, contH / DESIGN_H);
  const renderedW = DESIGN_W * scale;
  const renderedH = DESIGN_H * scale;

  // “Letterbox” ofseti (crne trake)
  const offX = (contW - renderedW) * 0.5;
  const offY = (contH - renderedH) * 0.5;

  // 4) Iz toga dobijemo tačne CSS dimenzije i poziciju canvasa
  const cssLeft   = offX + REELS.left   * scale;
  const cssTop    = offY + REELS.top    * scale;
  const cssWidth  = REELS.width  * scale;
  const cssHeight = REELS.height * scale;

  // Postavi CSS (vidljive mere)
  const canvas = document.getElementById("canvas1");
  canvas.style.left   = cssLeft + "px";
  canvas.style.top    = cssTop + "px";
  canvas.style.width  = cssWidth + "px";
  canvas.style.height = cssHeight + "px";

  // 5) Podesi “unutrašnju” rezoluciju canvasa (oštrina na svim DPR)
  canvas.width  = Math.round(cssWidth  * dpr);
  canvas.height = Math.round(cssHeight * dpr);

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
    resize,
    
]);



let drawSymbols;
let sviSimboli;
let animacijaLoop= false;
function drawSlot(){
    // [DODATO] Novi spin: invalidiraj sve prethodne callback-ove
    currentSpinId++;
    for (const t of pendingTimers) clearTimeout(t);
    pendingTimers.clear();

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
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    const offset = cssW / 100;
    let symWidth  = (cssW / 5) - (4 * offset);
    let symHeight = (cssH / 3) - (2 * offset);
    // console.log(symHeight);
    console.log("Sirina canvasa" + canvas.width);
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
            let x;
            let y;
             x= col * (symWidth+offset*4.2);
             y= row * (symHeight+offset*2);
           
            drawSymbols.push({
                        id: symbol.id
,                       x: x,
                        y: y,
                        src: symbol.srcSprite,
                        srcStatic : symbol.src,
                        width: symWidth,
                        height: symHeight,
                        _isRunning: false,
                        _animationID : null,
                        _timeoutId: null,
                        _spinId: currentSpinId // [DODATO] vezivanje za aktivni spin
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
                        _animationID : null,
                        _timeoutId: null,
                        _spinId: currentSpinId // [DODATO] vezivanje za aktivni spin
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
    // console.log("POZVANA FJA");
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
        // console.log("brojac: " + brojac);
        if(brojac >= 2){
            let prom=5*m; // indeks za prvi element u nizu 
          
            while(0<=brojac){
                tempSimb=drawSymbols[prom];
                // startCanvasAnimation(1500,tempSimb);
                dobitneLinije.push(tempSimb); // pusujem u niz sve simbole koji su dobitni sa svim atributima {src,x,y,width,height,id}
                prom++; // prelazimo na sledeci koji je dobitan
                brojac--; 
                // console.log("prom kroz while: " + prom);
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
    const cssW = canvas.clientWidth;
    for(let simbol of dobitneLinije){
        let y= simbol.y;
        let yPoz= y+(simbol.height/2);

        startCanvasAnimation(1800,simbol);
        nacrtajLinije(simbol.x,cssW-simbol.width/2,yPoz,dobitneLinije);
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
        // console.log("ENDY" + endY);
        // console.log("endy" + grupa[0].width/2);
        // // console.log("y : " + y);
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
        
        nacrtajLinije(startX,endX,yPoz,grupa);
        
        indeks = (indeks + 1) % yRedosled.length;
        loopAnimacija=setTimeout(animirajSledecuGrupu, 2600); // rekurzivni poziv fje da animira sve ostale grupe po vrednoscu Y 
    }

    animirajSledecuGrupu(); // pokreni prvu grupu
}


// function Auto(){
//     drawSlot();
//     Spoji()
//     pokreniAnimacijuSvih();
//     animirajSledecuGrupu();
// }

const frameInterval = 1000/30;


function startCanvasAnimation(duration,symbolObj){
    if (!symbolObj || !symbolObj.src) return;

    const mySpin = symbolObj._spinId || currentSpinId; // [DODATO] vezivanje na spin
    if (mySpin !== currentSpinId) return;

    if (symbolObj._isRunning) return;

    // [DODATO] Anti-overlap na istom polju
    const key = `${symbolObj.x}_${symbolObj.y}`;
    const now = Date.now();
    if (AktivneAnimacije.has(key) && now - AktivneAnimacije.get(key) < 80) return;
    AktivneAnimacije.set(key, now);

    if (symbolObj._animationID) {
        cancelAnimationFrame(symbolObj._animationID);
        symbolObj._animationID = null;
    }

    const spriteImage = new Image();
    spriteImage.src = symbolObj.src;

    symbolObj._isRunning = true;

    spriteImage.onload = () => {
        if (mySpin !== currentSpinId || !symbolObj._isRunning) return;
        const animationFunction = createAnimation(spriteImage, symbolObj, mySpin);
        symbolObj._animationID = requestAnimationFrame(animationFunction);
    };

    // [DODATO] Ako je već keširano
    if (spriteImage.complete) {
        spriteImage.onload();
    }

    const tid = setTimeout(() => {
        if (mySpin !== currentSpinId) return;
        symbolObj._isRunning = false;
        if (symbolObj._animationID) cancelAnimationFrame(symbolObj._animationID);
        drawStaticLogo(symbolObj);
        AktivneAnimacije.delete(key);
    }, duration);
    symbolObj._timeoutId = tid;
    pendingTimers.add(tid);
}
   


function createAnimation(image, symbolData, mySpin){
    let frameRate = 0;
    let number = 0;
    let diff = 0;
    let frameTimer = 0;
    let firstCall = true;

    return function animate(timmy){
        if (mySpin !== currentSpinId || !symbolData._isRunning) return;

        if (firstCall){
            number = timmy || 0;
            firstCall = false;
        }
        if (typeof timmy === "number"){
            diff = timmy - number;
            number = timmy;
        }
        // clamp diff to avoid jumps
        if (!(diff > 0 && diff < 100)) diff = 16;

        const SpriteWidth = image.width;
        const SpriteHeight = (image.height / 24);

        // očisti isključivo region simbola
        ctx.clearRect(symbolData.x, symbolData.y, symbolData.width, symbolData.height);

        frameTimer += diff;
        if (frameTimer >= 1000/30) {
            frameRate = (frameRate + 1) % 24;
            frameTimer -= 1000/30;
        }

        ctx.drawImage(image, 0, frameRate * SpriteHeight, SpriteWidth, SpriteHeight,
                      symbolData.x, symbolData.y, symbolData.width, symbolData.height);

        symbolData._animationID = requestAnimationFrame(animate);
    }
}


 const KesiraneSlike = new Map(); 


function drawStaticLogo(image){
    if (image && image._spinId !== undefined && image._spinId !== currentSpinId) return; // [DODATO]
    ctx.clearRect(image.x, image.y, image.width, image.height);

    const kljuc = image.srcStatic;

    if (KesiraneSlike.has(kljuc)) {
        const k = KesiraneSlike.get(kljuc);
        if (image._spinId !== currentSpinId) return;
        ctx.drawImage(k, image.x, image.y, image.width, image.height);
    } else {
        const novaSlika = new Image();
        novaSlika.src = kljuc;

        novaSlika.onload = () => {
            if (image._spinId !== currentSpinId) return;
            KesiraneSlike.set(kljuc, novaSlika);
            ctx.drawImage(novaSlika, image.x, image.y, image.width, image.height);
        };
        if (novaSlika.complete) {
            if (image._spinId !== currentSpinId) return;
            KesiraneSlike.set(kljuc, novaSlika);
            ctx.drawImage(novaSlika, image.x, image.y, image.width, image.height);
        }
    }
}


let debljina = 2;
let increase = true;


function nacrtajLinije(startX , endX, y, grupa){
    const mySpin = currentSpinId; // [DODATO]
    const cssW = canvas.clientWidth;
    const endX2 = cssW - grupa[0].width / 2;
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = debljina;

    function crtaj(){
        if (mySpin !== currentSpinId) return;

        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();
        ctx.moveTo(endX,y);
        ctx.lineTo(endX2,y);
        ctx.stroke();

        const sveZavrsene = grupa.every(simbol => !simbol._isRunning || simbol._spinId !== mySpin);

        if (sveZavrsene) {
            const pad = 2;
            ctx.clearRect(Math.floor(startX), Math.floor(y - ctx.lineWidth / 2),
                          Math.ceil(endX2 - startX) + pad, Math.ceil(ctx.lineWidth) + pad);

            for (let simbol of sviSimboli) {
                if (simbol._spinId === mySpin && !simbol._isRunning) drawStaticLogo(simbol);
            }
        } else {
            requestAnimationFrame(crtaj);
        }
    }
    requestAnimationFrame(crtaj);
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