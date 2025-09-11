// const { StrictMode } = require("react");

const AktivneAnimacije = new Map();
//Globalni ID spina i set za tajmere
let currentSpinId = 0;
let resizeToken = 0;
const pendingTimers = new Set();
let hardStop = false;          // globalni kill-switch
let startLoopTimer = null;     // tajmer iz pokreniAnimacijuSvih()
let autoMode = false;
let autoTimer = null;


const symbols = [
    // { id:0 , src : "symbols/0.png", srcSprite:"sprites/0.png" ,width: 260, height: 260},
    { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",value:1},
    { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png",value:2 },
    { id:3 , src : "symbols/3.png" ,srcSprite:"sprites/3.png" ,value:2},
    { id:4 , src : "symbols/4.png" ,srcSprite:"sprites/4.png" ,value:3},
    { id:5 , src : "symbols/5.png" ,srcSprite:"sprites/5.png",value:4},
    { id:6 , src : "symbols/6.png" ,srcSprite:"sprites/6.png" ,value:4},
    { id:7 , src : "symbols/7.png" ,srcSprite:"sprites/7.png" ,value:4},
    { id:8 , src : "symbols/8.png" ,srcSprite:"sprites/8.png" ,value:4},
    // { id:9 , src : "symbols/9.png" ,srcSprite:"sprites/9.png" ,width: 260, height: 260},
    // { id:10 , src : "symbols/10.png" ,srcSprite:"sprites/10.png" ,width: 260, height: 260}
];

 function generateSymbol(){
    const randomIndex= Math.floor(Math.random()*symbols.length);
    return symbols[randomIndex];
}
//------------------------------------------------------------------
let cashPlayer=500.00;
let i =0;
const betAmount = [1,2,5,10,20];
var betText = parseFloat(betAmount[i]);
function increment(){
    i++;
    if(i>4)
        i=0;
    document.getElementById("bet").textContent=betAmount[i];
    document.getElementById("Totalbet").textContent=(betAmount[i]*5).toFixed(2);
}
function decrement(){
    i--;
    if(i<0)
        i=4;

     document.getElementById("bet").textContent=betAmount[i];
     document.getElementById("Totalbet").textContent=(betAmount[i]*5).toFixed(2);
}


window.addEventListener('DOMContentLoaded', function(){
  document.getElementById("bet").textContent=betAmount[i];
  document.getElementById("Totalbet").textContent=(betAmount[i]*5).toFixed(2);
  document.getElementById("credit").textContent=cashPlayer.toFixed(2);
  setButtonStart();
})

const page= document.getElementById("main-container");
const dugme = document.getElementById("button");
const dugme2 = document.getElementById("button2");

// dugme.addEventListener("click",()=>{drawSlot();});

document.addEventListener('keydown', function(event){
    if(event.code==="Space")
        drawSlot()
})

//Za info hub dugmici , akcije 
const fullBtn = document.getElementById("fullscreenBtn");
fullBtn.addEventListener("click", () => {
    if(!document.fullscreenElement){
        stopAllAnimationsAndFreeze();
        page.requestFullscreen();
    }
    else{
        stopAllAnimationsAndFreeze();
        document.exitFullscreen();
    }    
})
document.addEventListener('fullscreenchange', () => {
  resizeToken++;
  resize();
  rescaleAndreDraw();
});
const creditSpan = document.getElementById("creditSpan");
const cashSpan = document.getElementById("cashSpan");
const creditValue= document.getElementById("credit");
const winText = document.getElementById("win");
cashSpan.addEventListener("click",()=>{
    cashSpan.style.color="white";
    creditSpan.style.color="gray";
    creditValue.innerText="5000.00";
})
creditSpan.addEventListener("click",()=>{
    cashSpan.style.color="gray";
    creditSpan.style.color="white";
    creditValue.innerText="500000";
})
//--------------------------------------------------------------


const infoDiv= document.getElementById("help-screen");
const infoBtn = document.getElementById("infoBtn");
const helpContent = document.getElementById("help-content");

infoBtn.addEventListener("click", ()=>{

    infoDiv.style.visibility="visible";
})
const closeBtn = document.getElementById("close-help-screen");
closeBtn.addEventListener("click",()=>{
    infoDiv.style.visibility="hidden";
    // console.log("Klik");
})

infoDiv.addEventListener("click",(e)=>{
    if(!helpContent.contains(e.target) ){
        infoDiv.style.visibility="hidden";
    }
})
//-----------------------------------------------------------------------------------------

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const canvasLine= document.getElementById("canvas2");
const ctxLine= canvasLine.getContext("2d");
const canvasFront = document.getElementById("canvas3");
const ctxFront = canvasFront.getContext("2d");
function resize() {
  const container = document.getElementById("main-container");
  const dpr = window.devicePixelRatio || 1;

  // Dimenzije pozadinske slike 
  const DESIGN_W = 1366;
  const DESIGN_H = 768;

  //Koordinate “reels” okvira unutar te slike (u pikselima fajla)
  
  const REELS = {
    left: 168,
    top:  68,
    width: 1035,
    height: 565
  };

  const PANEL = {
    left : 0,
    top: 670,
    width: 1365,
    height: 100
  }

  
  const contW = container.clientWidth;
  const contH = container.clientHeight;

  const scale = Math.min(contW / DESIGN_W, contH / DESIGN_H);
  const renderedW = DESIGN_W * scale;
  const renderedH = DESIGN_H * scale;

  // “Letterbox” ofseti 
  const offX = (contW - renderedW) * 0.5;
  const offY = (contH - renderedH) * 0.5;

  //Iz toga dobijemo tačne CSS dimenzije i poziciju canvasa
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

  //Za linije iza simbola
  const canvasLine= document.getElementById("canvas2");
  canvasLine.style.left   = cssLeft + "px";
  canvasLine.style.top    = cssTop + "px";
  canvasLine.style.width  = cssWidth + "px";
  canvasLine.style.height = cssHeight + "px";

  //Za linije ispred simbola 
  const canvasFront=document.getElementById("canvas3");
  canvasFront.style.left   = cssLeft + "px";
  canvasFront.style.top    = cssTop + "px";
  canvasFront.style.width  = cssWidth + "px";
  canvasFront.style.height = cssHeight + "px";


  // Podesi unutrašnju rezoluciju canvasa (oštrina na svim DPR)
  canvas.width  = Math.round(cssWidth  * dpr);
  canvas.height = Math.round(cssHeight * dpr);

  canvasLine.width  = Math.round(cssWidth  * dpr);
  canvasLine.height = Math.round(cssHeight * dpr);

  canvasFront.width  = Math.round(cssWidth  * dpr);
  canvasFront.height = Math.round(cssHeight * dpr);

  const ctxFront=canvasFront.getContext("2d");
  ctxFront.setTransform(dpr,0,0,dpr,0,0);

  const ctxLine=canvasLine.getContext("2d");
  ctxLine.setTransform(dpr,0,0,dpr,0,0);

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const info = document.querySelector(".info");
  const pLeft   = offX + PANEL.left   * scale;
  const pTop    = offY + PANEL.top    * scale;
  const pWidth  = PANEL.width  * scale;
  const pHeight = PANEL.height * scale;

  info.style.left   = pLeft + "px";
  info.style.top    = pTop + "px";
  info.style.width  = pWidth + "px";
  info.style.height = pHeight + "px";

  //Elementi u info delu

  const span =document.querySelector(".info-labels");


  const scaleLabel = Math.min(contW*0.4,contH*0.4);
  span.style.fontSize =(scaleLabel*0.065)+ "px";
//   console.log(span.style.fontSize+"px");

  const buttonDiv= document.querySelectorAll(".buttonGamble");
  buttonDiv.forEach(x=>{
        x.style.width=(scaleLabel*0.34) + "px";
        x.style.height=(scaleLabel*0.17) + "px";
        x.style.fontSize=(scaleLabel*0.08) + "px";
  })

  const infoBet = document.querySelectorAll(".infoBet");
  infoBet.forEach(x=>{
        x.style.width=(scaleLabel*0.25) + "px";
        x.style.height=(scaleLabel*0.1) + "px";
        x.style.fontSize=(scaleLabel*0.01) + "px";
  })
  const valueforBet = document.querySelectorAll(".forBet");
  valueforBet.forEach(x=>{
        x.style.fontSize=(scaleLabel*0.08) + "px";
  })

  const textInfoForBet = document.querySelector(".textInfo");
  const childerText = textInfoForBet.querySelectorAll("div");
  childerText.forEach(x=>{
    x.style.fontSize=(scaleLabel*0.04) + "px";
  })
  const divZaIkone = document.querySelector(".info-wrapper");
  const ikone = divZaIkone.querySelectorAll("div");
  ikone.forEach(x=>{
    x.style.fontSize=(scaleLabel*0.065) + "px";
    x.style.color="white";
  })

}

function rescaleAndreDraw(){
    if(!drawSymbols || drawSymbols.length===0) return;

    stopAllAnimationsAndFreeze(); // prekid svih animacija da ne bi se videli pri resizu window-a

    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    ctx.clearRect(0, 0, cssW, cssH);

    for (const s of drawSymbols){
        if(s._spinId!== currentSpinId) continue;

        s.x=s.nx*cssW; // vracanje u normalnih koordinata radi iscrtavanja simbola 
        s.y=s.ny*cssH;
        s.width=s.nw*cssW;
        s.height=s.nh*cssH;

        drawStaticLogo(s);
    }
    dugme2.classList.remove("active");
    console.log("Uso si u fju");
}
function handleResizeChange() {
  resizeToken++;     // invalidiraj stare callback-ove
  resize();          // podesi canvas (atribute + DPR)
  rescaleAndreDraw();// preračunaj x/y/width/height i iscrtaj
}
// novi handleri umesto gore navedenih
window.addEventListener('resize', handleResizeChange);
window.addEventListener('orientationchange', handleResizeChange);
document.addEventListener('fullscreenchange', handleResizeChange);

window.addEventListener('load', () => {
  resize();
  rescaleAndreDraw();
});

//-------------------------------------------------------------------


// const simboli = [
//                   { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
//                    { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},
//                   { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
//                   { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
//                   { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
//                      { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},
//                     { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},
//                      { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},
//                      { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},
//                      { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},
//                     { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},
//                     { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},
//                     { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},
//                     { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
//                     { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},   
               
//             ];
let drawSymbols;
let animacijaLoop= false;
function drawSlot(){
    if(cashPlayer<=0){
        alert("Nemas vise kredita, ubaci jos novca");
        dugme.classList.add("disabled");
        return;
    }
        
    
    currentSpinId++;
    hardStop=false;
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
    
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctxLine.clearRect(0, 0, canvasLine.width, canvasLine.height);
    ctxFront.clearRect(0, 0, canvasFront.width, canvasFront.height);
    ctx.fillRect(0,0,1,1);
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    const offset = cssW / 100;
    let symWidth  = (cssW / 5) - (4 * offset);
    let symHeight = (cssH / 3) - (2 * offset);
    // console.log(symHeight);
    // console.log("Sirina canvasa" + canvas.width);
    // console.log(symWidth);
    drawSymbols = [];
    let i=0;
    for(let row=0;row<rows;row++){
        for(let col=0;col<cols;col++){
            const symbol=generateSymbol();
            // console.log(symbol);
            let x;
            let y;
            const Column_fact = [null,5.5,4.8,4.7,4.6] 
            x= (col==0)
                ? offset
                : col*(symWidth+offset*(Column_fact[col] ?? 4.7))
            if(row==0)
                y=offset;
            else{
                y= row * (symHeight+offset*2.5);
            }
            //Pamcenje css piksela za kasnije resize za simbole 
            const nx= x/cssW;
            const ny= y/cssH;
            const nw=symWidth/cssW;
            const nh= symHeight/cssH;
                        drawSymbols.push({
                        id: symbol.id
,                       x: x,
                        y: y,
                        nx: nx,
                        ny : ny,
                        nw: nw,
                        nh : nh,
                        src: symbol.srcSprite,
                        srcStatic : symbol.src,
                        width: symWidth,
                        height: symHeight,
                        _isRunning: false,
                        _animationID : null,
                        _timeoutId: null,
                        _spinId: currentSpinId,
                        value: symbol.value
                    });
               
           drawStaticLogo(drawSymbols[drawSymbols.length - 1]);
           i++;
        }
    }
    animacijaLoop=false;
    if (loopAnimacija) {
    clearTimeout(loopAnimacija);
    loopAnimacija = null;
    }
    dobitneLinije = [];
    console.log(dobitneLinije); 

    setTimeout(()=>{
        Spoji();
    },200);
    //  console.log(drawSymbols);
}

let dobitneLinije=[];
let loopAnimacija=null;


function Spoji(){
    // console.log("POZVANA FJA");
     const mySpin = currentSpinId;
    let x1;
    let x2;
    let brojac = 0
    let j;
    //Idemo kroz redove 
    for (let m = 0;m<3;m++){
        if (mySpin !== currentSpinId) return;
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
            if (mySpin !== currentSpinId) return;
            let prom=5*m; // indeks za prvi element u nizu 
          
            while(0<=brojac){
                tempSimb=drawSymbols[prom];
                // startCanvasAnimation(1500,tempSimb);
                dobitneLinije.push(tempSimb); // pusujem u niz sve simbole koji su dobitni sa svim atributima {src,x,y,width,height,id}
                prom++; // prelazimo na sledeci koji je dobitan
                brojac--; 
                // console.log("prom kroz while: " + prom);
            }
            // console.log(dobitneLinije);           
        }
        else{
            // console.log("nema nista");
        }
  
    }
    if (mySpin !== currentSpinId) return;
    var totalBet =parseInt(document.getElementById("Totalbet").textContent);
    var win=0;
     if(dobitneLinije.length>0)
            {
                console.log("uso sam u granu za dobitne linije");
                const grupa={}
                for(let simbol of dobitneLinije)
                {
                    let y=simbol.y;
                    let yPoz= y+(simbol.height/2);
                    if(!grupa[yPoz]){
                        grupa[yPoz]=[];
                    }
                    grupa[yPoz].push(simbol);
                }
                
                // console.log(grupa);
                for(let yPoz in grupa)
                {
                    var wintmp=0;
                    tmp=grupa[yPoz];
                    let x= tmp.length;

                    switch(tmp[0].value){
                        case 1:
                            switch(x){
                                case 3 :
                                    wintmp=totalBet*10;
                                    break;
                                case 4: 
                                    wintmp=totalBet*40;
                                    break;
                                case 5:
                                    wintmp=totalBet*600;
                                    break;
                                default:
                                    wintmp=0;
                                    break;    
                            }
                        break;
                        case 2:
                            switch(x){
                                case 3 :
                                    wintmp=totalBet*8;
                                    break;
                                case 4: 
                                    wintmp=totalBet*20;
                                    break;
                                case 5:
                                    wintmp=totalBet*100;
                                    break;
                                default:
                                    wintmp=0;
                                    break;    
                            }
                        break;
                        case 3: 
                            switch(x){
                                case 3 :
                                    wintmp=totalBet*4;
                                    break;
                                case 4: 
                                    wintmp=totalBet*10;
                                    break;
                                case 5:
                                    wintmp=totalBet*40;
                                    break;
                                default:
                                    wintmp=0;
                                    break;        
                            }
                        break;   
                        case 4:
                            switch(x){
                                case 3 :
                                    wintmp=totalBet*2;
                                    break;
                                case 4: 
                                    wintmp=totalBet*6;
                                    break;
                                case 5:
                                    wintmp=totalBet*20;
                                    break;
                                default:
                                    wintmp=0;
                                    break;    
                            }
                        break;
                        default:
                            wintmp=0;
                    }
                    win+=wintmp;
                }
            console.log("Win:" + win); 
           
            
            document.getElementById("win").textContent=win.toFixed(2);    
             if(trigger==true)
                {
                  MoneyTransfer(win);  
                }   
            else{
                setButtonTakeWin(win);
            }    
                pokreniAnimacijuSvih();
            }
      else{
        cashPlayer-=totalBet;
        creditValue.textContent=cashPlayer.toFixed(2);
      } 
           
        
    
}
function setButtonStart(){
    dugme.textContent="Start";
    dugme.classList.remove("takeWin");
    dugme.onclick=()=> drawSlot();
    console.log("Novac koji imas:" + cashPlayer);
}
let isPayingOut = false;
// function setButtonTakeWin(amount){
//     dugme.textContent="Take Win";
//     dugme.classList.add("takeWin");
//     dugme.onclick = () =>{
//         for(let i =0;i<amount;i++)
//         {
//             cashPlayer+=1;
//             winText.textContent-=1;
//         }
//         creditValue.textContent=cashPlayer.toFixed(2);
        
//         stopAllAnimationsAndFreeze();
//         setButtonStart();

//     }
// }
function setButtonTakeWin(amount) {
  dugme.textContent = "Take Win";
  dugme.classList.add("takeWin");       
  dugme.onclick = () => MoneyTransfer(amount);
}
function MoneyTransfer(amount)
{
     if (isPayingOut) return;
    isPayingOut = true;

  
    stopAllAnimationsAndFreeze();

    dugme.classList.add("disabled");    
    const winEl    = winText;           
    const creditEl = creditValue;       

    const win0   = Math.min(amount,(Number(winEl.textContent)   || 0));  // polazni win
    const cash0  = Number(creditEl.textContent) || 0; // polazni kredit
    const target =  (Number(amount) || 0); // koliko isplaćujemo

    const DURATION = 900;                      // trajanje animacije u ms (~0.9s)
    const start    = performance.now();

    function tick(t) {
      const p      = Math.min(1, (t - start) / DURATION);   //Izracunavnja progresa    
      const moved  = Math.round(target * p * 100) / 100;    //Prebacen novac u decimalama         
      const newWin = (win0  - moved);
      const newBal = (cash0 + moved);

      winEl.textContent    = newWin.toFixed(2);
      creditEl.textContent = newBal.toFixed(2);

      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        //sigurnost da je tacno prebacen novac
        winEl.textContent    = (win0  - target).toFixed(2);
        creditEl.textContent = (cash0 + target).toFixed(2);
        cashPlayer+=amount;
        console.log("Haha");
        dugme.classList.remove("disabled");
        isPayingOut = false;
        if(trigger==false)
        {
            setButtonStart();
        }
          
      }
    }

    requestAnimationFrame(tick);
}


function pokreniAnimacijuSvih(){ // ovo radi  
    const mySpin = currentSpinId;
    if (mySpin !== currentSpinId) return;
    const cssW = canvas.clientWidth;
    // 1. Grupisanje simbola po yPoz
const grupe = {};
for (let simbol of dobitneLinije) {
    let y = simbol.y;
    let yPoz = y + (simbol.height / 2);

    if (!grupe[yPoz]) {
        grupe[yPoz] = [];
    }
    grupe[yPoz].push(simbol);
}
    
// 2. Iteracija kroz grupe
for (let yPoz in grupe) {
    let grupa = grupe[yPoz];
    let tag =false;
    // uzmi zadnji simbol u toj grupi
    let poslednji = grupa[grupa.length - 1];
    let endX;
    let x;
    if(grupa.length===5){
        endX = poslednji.x + poslednji.width / 1.5;
        x=endX;
        tag=true;
    }
    else{
        endX = poslednji.x + poslednji.width / 1.2;
        x = cssW - poslednji.width / 2 - grupa[0].x - 10;
    }
    // računanje na osnovu zadnjeg
    // console.log(grupa);
    // crtanje svih linija u toj grupi
    for (let simbol of grupa) {
        // console.log("simbol " + simbol.src);

        startCanvasAnimation(1800, simbol);

        nacrtajLinije(
            simbol.x + 20, // startX
            endX,
            x,
            Number(yPoz), // mora biti broj jer je key string
            dobitneLinije,
            tag
        );
    }
}

    if (startLoopTimer) { clearTimeout(startLoopTimer); startLoopTimer = null; }
        startLoopTimer = setTimeout(() => {
    if (!hardStop && mySpin === currentSpinId) {
        pokreniAnimLoop();
        }
    }, 2600);
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
        
          if (!animacijaLoop  || yRedosled.length === 0) return;
        const y = yRedosled[indeks];
        const grupa = grupePoY[y];
        let tag = false;
        let i =0;
        const cssW=canvas.clientWidth;
        let duzina = grupa.length;
        // console.log(duzina); 
        let startX= grupa[0].x+20; //prva x koordinata
        let endX; // kranja xx koordinata
        let yPoz = y+(grupa[0].height)/2; // sredina y svakog reda za crtanje linije
        let x;
        if(grupa.length===5){
            endX=grupa[duzina-1].x+grupa[0].width/2;
            x=endX;
            tag=true;
            console.log("USO SAM");
        }
        else{
             x= cssW-grupa[0].width/2-grupa[0].x;
            endX=grupa[duzina-1].x+grupa[0].width;
        }
        
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
        
        nacrtajLinije(startX,endX,x,yPoz,grupa,tag);
        
        indeks = (indeks + 1) % yRedosled.length;
        loopAnimacija=setTimeout(animirajSledecuGrupu, 2600); // rekurzivni poziv fje da animira sve ostale grupe po vrednoscu Y 
    }

    animirajSledecuGrupu(); // pokreni prvu grupu
}

function startCanvasAnimation(duration,symbolObj){
    //Provera da li ima simbola ili putanje do slike 
    if (!symbolObj || !symbolObj.src) return;
    //Provera spina, tacnije da li je animaciju u tom spinu ukoliko nije tacnije ako je kreiran novi niz elementa povecava se broj tr. spina i ne dozvoljava se animacija 
    const mySpin = symbolObj._spinId || currentSpinId; // [DODATO] vezivanje na spin
    if (mySpin !== currentSpinId) return;
    //Ako je simbol vec u animaciji 
    if (symbolObj._isRunning) return;

    // Anti-overlap na istom polju
    const key = `${symbolObj.x}_${symbolObj.y}`; //pravljenje kljuca za svaki simbol na reelovima
    const now = performance.now();
    if (AktivneAnimacije.has(key) && now - AktivneAnimacije.get(key) < 80) return; //provera da li je proslo 80ms izmedju animacija da se ne bi preklopile 
    AktivneAnimacije.set(key, now); //ako nisu dodaj u mapu kljuc i trenutak animacije 

    //Osigurava da se ugasi prethodni loop animacija ukoliko su neke ostale aktivne 
    if (symbolObj._animationID) {
        cancelAnimationFrame(symbolObj._animationID);
        symbolObj._animationID = null;
    }
    const myResize = resizeToken;
    const spriteImage = new Image();
    spriteImage.src = symbolObj.src;

    symbolObj._isRunning = true;
    //Pokretanje animacija 
    spriteImage.onload = () => {
        if (mySpin !== currentSpinId || myResize!==resizeToken || !symbolObj._isRunning) return;
        const animationFunction = createAnimation(spriteImage, symbolObj, mySpin,myResize);
        symbolObj._animationID = requestAnimationFrame(animationFunction);
    };

    //Ako je već keširano
    if (spriteImage.complete) {
        spriteImage.onload();
    }
    //Prekidanje animacije 
    const tid = setTimeout(() => {
        if (mySpin !== currentSpinId || myResize!==resizeToken) return;
        symbolObj._isRunning = false;
        if (symbolObj._animationID) cancelAnimationFrame(symbolObj._animationID);
        drawStaticLogo(symbolObj);
        AktivneAnimacije.delete(key);
        pendingTimers.delete(tid);//  ovo dodajemo ako koristimo stopandFreezeAnimation()
    }, duration);
    symbolObj._timeoutId = tid;
    pendingTimers.add(tid);
}
   
const frameInterval = 1000/30;
function createAnimation(image, symbolData, mySpin, myResize){
    let frameRate = 0;
    let number = 0;
    let diff = 0;
    let frameTimer = 0;
    let firstCall = true;

    return function animate(timmy){
        if (mySpin !== currentSpinId || myResize!==resizeToken || !symbolData._isRunning) return;

        if (firstCall){
            number = timmy || 0;
            firstCall = false;
        }
        if (timmy){
            diff = timmy - number;
            number = timmy;
        }
        // clamp diff to avoid jumps
        if (!(diff > 0 && diff < 100)) diff = 30;

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
    if (image && image._spinId !== undefined && image._spinId !== currentSpinId) return; // Provera da li spinID simbola odgovara globalnom spinu za taj sablon simbola, sprecava da 
                                                                                         // stari simbol upadne u novi spin 
    ctx.clearRect(image.x, image.y, image.width, image.height);

    const kljuc = image.srcStatic;

    if (KesiraneSlike.has(kljuc)) { // Kesiramo slike zbog animacija , kako se iz animaraju svi simboli mora se vratiti staticna slika pa je lakse pamtiti u cache nego crtati opet nove 
        const k = KesiraneSlike.get(kljuc);
        if (image._spinId !== currentSpinId) return; // Provera da li spinID simbola odgovara globalnom spinu za taj sablon simbola
        ctx.drawImage(k, image.x, image.y, image.width, image.height);
    } else {
        const novaSlika = new Image();
        novaSlika.src = kljuc;

        novaSlika.onload = () => {
            if (image._spinId !== currentSpinId) return;
            KesiraneSlike.set(kljuc, novaSlika); // Prilikom iscrtavanja simbola na pocetku runde , pamtimo te slike u cache 
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
function nacrtajLinije(startX , endX,endX2, y, grupa,tag){
    const myResize = resizeToken;
    const mySpin = currentSpinId; 
    const cssW = canvasFront.clientWidth;

    
    ctxLine.strokeStyle = "yellow";
    ctxLine.lineWidth = debljina;
    ctxFront.strokeStyle="yellow";
    ctxFront.lineWidth=debljina;

    function crtaj(){
        if (hardStop || mySpin !== currentSpinId || myResize!==resizeToken) {
      
        ctxLine.clearRect(0, 0, canvasLine.width, canvasLine.height);
        ctxFront.clearRect(0, 0, canvasFront.width, canvasFront.height);
        return;
    }
        // console.log("Start X: " + startX);
        // console.log("End X: " + endX);
        // console.log("End X2: " + endX2);
        // console.log("Y: " + y);
            if(tag){   
                ctxLine.beginPath();
                ctxLine.moveTo(startX, y);
                ctxLine.lineTo(endX, y);
                ctxLine.stroke(); 
            }
            else{
                ctxLine.beginPath();
                ctxLine.moveTo(startX, y);
                ctxLine.lineTo(endX, y);
                ctxLine.stroke(); 

                ctxFront.beginPath()
                ctxFront.moveTo(endX,y);
                ctxFront.lineTo(endX2,y);
                ctxFront.stroke();
            }            

             
        
        

       
   

        const sveZavrsene = grupa.every(simbol => !simbol._isRunning || simbol._spinId !== mySpin);

        if (sveZavrsene) {
            const pad = 2;


        const yTopLine   = Math.floor(y - (ctxLine.lineWidth / 2) - pad);
        const hLine      = Math.ceil(ctxLine.lineWidth) + pad*2;
        ctxLine.clearRect(
        Math.floor(startX) - pad,
        yTopLine,
        Math.ceil(endX - startX) + pad*2,
        hLine
        );

        const yTopFront  = Math.floor(y - (ctxFront.lineWidth / 2) - pad);
        const hFront     = Math.ceil(ctxFront.lineWidth) + pad*2;
        if(hardStop){

        }
        ctxFront.clearRect(
        Math.floor(endX) - pad,
        yTopFront,
        Math.ceil(endX2 - endX) + pad*2,
        hFront  
        )
            for (let simbol of drawSymbols) {
                if (simbol._spinId === mySpin && !simbol._isRunning) drawStaticLogo(simbol);
            }
        } else {
            requestAnimationFrame(crtaj);
        }
    }
    requestAnimationFrame(crtaj);
}
let trigger=false;
let timer = null;

dugme2.addEventListener('click',()=>{
    dugme2.classList.toggle("active");
    if(trigger){
        stopAllAnimationsAndFreeze();
        dugme.classList.remove("disabled");
    }
    else{
        trigger=true;
        Auto();
        dugme.classList.add("disabled");
    }
});
//takodje moze se otici u minus ukoliko imam tipa jos 25credita a ja gemblujem 100 , on ce odrati igru i ucicem u minus 75
// Mora da se menja jer sam dodao win , nesto ga blokira da se pokrene 
function Auto(){
    if(!trigger) return;
    drawSlot();
    
    setTimeout(() => {
        const n = dobitneLinije.length; // sada je realna dužina
        // console.log("Dužina dobitneLinije:", n);
        // console.log("Aktivne animacije " + AktivneAnimacije);
        if (n <= 5 && n>0) {
            timer = setTimeout(Auto, 5000);
            console.log("Ima 1 linija");
        } else if (n > 5 && n <=10) {
            timer = setTimeout( );
            console.log("Ima 2 linije");
        } else if (n > 10) {
            timer = setTimeout(Auto, 10200);
            console.log("Ima 3 linije");
        } else {
            timer = setTimeout(Auto, 1000);
            console.log("Nema linije");
        }
    }, 800);
    
}

//canvas uvek da prati reelove, nakon sto bude pratio reelove racunacu 

//Prekini sve animacije i ostavi statičnu sliku

function stopAllAnimationsAndFreeze() {
  // Zaustavi Auto petlju i grupne loop-ove
  hardStop = true;
  trigger = false;
  if (timer) { clearTimeout(timer); timer = null; }
  animacijaLoop = false;
  if (loopAnimacija) { clearTimeout(loopAnimacija); loopAnimacija = null; }

  // Prekini sve pending setTimeout-ove iz animacija
  for (const t of pendingTimers) clearTimeout(t);
  pendingTimers.clear();

  // Prekini sve rAF animacije po simbolima
  if (drawSymbols && Array.isArray(drawSymbols)) {
    for (const simbol of drawSymbols) {
      simbol._isRunning = false;
      if (simbol._animationID) {
        cancelAnimationFrame(simbol._animationID);
        simbol._animationID = null;
      }
    }
  }
  AktivneAnimacije.clear();

  //Zacrataj statične slike preko svih trenutnih simbola
  if (drawSymbols && Array.isArray(drawSymbols)) {
    for (const simbol of drawSymbols) {
      drawStaticLogo(simbol); // koristi postojeću funkciju
    }
  }
}


//logika racunanja za dobitak i info deo za igraca i za auto broj rundi kao na html5


// da li u toku padanja reeelova on vec spoji sta treba i zato odmah spaja kod veryHot 5???


// // ===== ZAMENITE drawSlot FUNKCIJU =====
// function drawSlot(){
//     if(cashPlayer==0){
//         alert("Nemas vise kredita, ubaci jos novca");
//         dugme.classList.add("disabled");
//         return;
//     }
    
//     // Proveri da li ima dovoljno novca za bet (bez oduzimanja)
//     var totalBet = parseInt(document.getElementById("Totalbet").textContent);
//     if(cashPlayer < totalBet){
//         alert("Nemas dovoljno kredita za ovaj bet");
//         if(autoMode) {
//             stopAutoMode();
//         }
//         return;
//     }
        
//     currentSpinId++;
//     hardStop=false;
//     for (const t of pendingTimers) clearTimeout(t);
//     pendingTimers.clear();

//     const rows=3;
//     const cols=5;

//     if(drawSymbols && Array.isArray(drawSymbols)){
//         for(let simbol of drawSymbols){
//             if(simbol._animationID) cancelAnimationFrame(simbol._animationID);
//             simbol._isRunning=false;
//         }
//     }
//     AktivneAnimacije.clear();
    
//     ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
//     ctxLine.clearRect(0, 0, canvasLine.width, canvasLine.height);
//     ctxFront.clearRect(0, 0, canvasFront.width, canvasFront.height);
//     ctx.fillRect(0,0,1,1);
//     const cssW = canvas.clientWidth;
//     const cssH = canvas.clientHeight;
//     const offset = cssW / 100;
//     let symWidth  = (cssW / 5) - (4 * offset);
//     let symHeight = (cssH / 3) - (2 * offset);
    
//     drawSymbols = [];
//     let i=0;
//     for(let row=0;row<rows;row++){
//         for(let col=0;col<cols;col++){
//             const symbol=generateSymbol();
//             let x;
//             let y;
//             const Column_fact = [null,5.5,4.8,4.7,4.6] 
//             x= (col==0)
//                 ? offset
//                 : col*(symWidth+offset*(Column_fact[col] ?? 4.7))
//             if(row==0)
//                 y=offset;
//             else{
//                 y= row * (symHeight+offset*2.5);
//             }
//             //Pamcenje css piksela za kasnije resize za simbole 
//             const nx= x/cssW;
//             const ny= y/cssH;
//             const nw=symWidth/cssW;
//             const nh= symHeight/cssH;
//                         drawSymbols.push({
//                         id: symbol.id,
//                         x: x,
//                         y: y,
//                         nx: nx,
//                         ny : ny,
//                         nw: nw,
//                         nh : nh,
//                         src: symbol.srcSprite,
//                         srcStatic : symbol.src,
//                         width: symWidth,
//                         height: symHeight,
//                         _isRunning: false,
//                         _animationID : null,
//                         _timeoutId: null,
//                         _spinId: currentSpinId,
//                         value: symbol.value
//                     });
               
//            drawStaticLogo(drawSymbols[drawSymbols.length - 1]);
//            i++;
//         }
//     }
//     animacijaLoop=false;
//     if (loopAnimacija) {
//     clearTimeout(loopAnimacija);
//     loopAnimacija = null;
//     }
//     dobitneLinije = [];
//     console.log(dobitneLinije); 

//     setTimeout(()=>{
//         Spoji();
//     },200);
// }

// // ===== ZAMENITE Spoji FUNKCIJU =====
// function Spoji(){
//     const mySpin = currentSpinId;
//     let x1;
//     let x2;
//     let brojac = 0
//     let j;
//     //Idemo kroz redove 
//     for (let m = 0;m<3;m++){
//         if (mySpin !== currentSpinId) return;
//         brojac=0;
//         x1=drawSymbols[m*5]; //prvi element za svaki red
//         j = m*5+1; // indeks za element nakon prvog u redu
//         for (let i=0;i<4;i++){
//             x2=drawSymbols[j];
//             if(x1.id===x2.id){ // provera da li su isti 
//                 j++;
//                 brojac++
//             }
//         }
        
//         if(brojac >= 2){
//             if (mySpin !== currentSpinId) return;
//             let prom=5*m; // indeks za prvi element u nizu 
          
//             while(0<=brojac){
//                 tempSimb=drawSymbols[prom];
//                 dobitneLinije.push(tempSimb);
//                 prom++; 
//                 brojac--; 
//             }           
//         }
//     }
    
//     if (mySpin !== currentSpinId) return;
//     var totalBet = parseInt(document.getElementById("Totalbet").textContent);
//     var win = 0;
    
//     if(dobitneLinije.length > 0) {
//         console.log("uso sam u granu za dobitne linije");
//         const grupa = {};
//         for(let simbol of dobitneLinije) {
//             let y = simbol.y;
//             let yPoz = y + (simbol.height / 2);
//             if(!grupa[yPoz]) {
//                 grupa[yPoz] = [];
//             }
//             grupa[yPoz].push(simbol);
//         }
        
//         for(let yPoz in grupa) {
//             var wintmp = 0;
//             tmp = grupa[yPoz];
//             let x = tmp.length;

//             switch(tmp[0].value) {
//                 case 1:
//                     switch(x) {
//                         case 3: wintmp = totalBet * 10; break;
//                         case 4: wintmp = totalBet * 40; break;
//                         case 5: wintmp = totalBet * 600; break;
//                         default: wintmp = 0; break;    
//                     }
//                     break;
//                 case 2:
//                     switch(x) {
//                         case 3: wintmp = totalBet * 8; break;
//                         case 4: wintmp = totalBet * 20; break;
//                         case 5: wintmp = totalBet * 100; break;
//                         default: wintmp = 0; break;    
//                     }
//                     break;
//                 case 3: 
//                     switch(x) {
//                         case 3: wintmp = totalBet * 4; break;
//                         case 4: wintmp = totalBet * 10; break;
//                         case 5: wintmp = totalBet * 40; break;
//                         default: wintmp = 0; break;        
//                     }
//                     break;   
//                 case 4:
//                     switch(x) {
//                         case 3: wintmp = totalBet * 2; break;
//                         case 4: wintmp = totalBet * 6; break;
//                         case 5: wintmp = totalBet * 20; break;
//                         default: wintmp = 0; break;    
//                     }
//                     break;
//                 default:
//                     wintmp = 0;
//             }
//             win += wintmp;
//         }
        
//         console.log("Win:" + win); 
//         document.getElementById("win").textContent = win.toFixed(2);
        
//         // ODUZMI BET TEK KADA ZNAŠ DA IMAŠ DOBITAK
//         cashPlayer -= totalBet;
//         creditValue.textContent = cashPlayer.toFixed(2);
        
//         if(autoMode) {
//             // U auto mode-u odmah transferiši novac
//             MoneyTransfer(win, () => {
//                 // Callback nakon transfera - nastavi auto mode
//                 console.log("Transfer završen, nastavljam auto mode");
//             });  
//         } else {
//             setButtonTakeWin(win);
//         }
        
//         pokreniAnimacijuSvih();
        
//     } else {
//         // NEMA DOBITNIH LINIJA - ODUZMI NOVAC TEK SADA
//         cashPlayer -= totalBet;
//         creditValue.textContent = cashPlayer.toFixed(2);
        
//         // Proveri da li ima dovoljno novca za sledeći spin u auto mode
//         if (autoMode && cashPlayer < totalBet) {
//             setTimeout(() => {
//                 if(autoMode) {
//                     alert("Nemaš više kredita!");
//                     stopAutoMode();
//                 }
//             }, 1000);
//         }
//     }
// }

// // ===== MODIFIKOVANA MoneyTransfer FUNKCIJA =====
// function MoneyTransfer(amount, callback) {
//     if (isPayingOut) return;
//     isPayingOut = true;

//     // Ne prekidaj animacije ako je auto mode aktivan
//     if (!autoMode) {
//         stopAllAnimationsAndFreeze();
//     }

//     dugme.classList.add("disabled");    
//     const winEl = winText;           
//     const creditEl = creditValue;       

//     const win0 = Math.min(amount, (Number(winEl.textContent) || 0));
//     const cash0 = Number(creditEl.textContent) || 0;
//     const target = Number(amount) || 0;

//     const DURATION = 900;
//     const start = performance.now();

//     function tick(t) {
//         if(hardStop && !autoMode) return;
        
//         const p = Math.min(1, (t - start) / DURATION);
//         const moved = Math.round(target * p * 100) / 100;
//         const newWin = (win0 - moved);
//         const newBal = (cash0 + moved);

//         winEl.textContent = newWin.toFixed(2);
//         creditEl.textContent = newBal.toFixed(2);

//         if (p < 1) {
//             requestAnimationFrame(tick);
//         } else {
//             // Završi transfer
//             winEl.textContent = (win0 - target).toFixed(2);
//             creditEl.textContent = (cash0 + target).toFixed(2);
//             cashPlayer += amount;
//             console.log("MoneyTransfer završen");
            
//             if (!autoMode) {
//                 dugme.classList.remove("disabled");
//                 setButtonStart();
//             }
//             isPayingOut = false;
            
//             if (callback && typeof callback === 'function') {
//                 callback();
//             }
//         }
//     }

//     requestAnimationFrame(tick);
// }

// // ===== DODAJTE OVE NOVE FUNKCIJE =====
// function startAutoMode() {
//     if (!autoMode) return;
    
//     // Proveri da li ima dovoljno novca
//     var totalBet = parseInt(document.getElementById("Totalbet").textContent);
//     if (cashPlayer < totalBet) {
//         alert("Nemaš dovoljno kredita!");
//         stopAutoMode();
//         return;
//     }
    
//     console.log("Pokretam auto spin...");
//     drawSlot();
    
//     // Sačekaj da se završe animacije i logika
//     setTimeout(() => {
//         if (!autoMode) return;
        
//         const numWinningLines = dobitneLinije.length;
//         let delay;
        
//         // Odredi delay na osnovu broja dobitnih linija
//         if (numWinningLines === 0) {
//             delay = 1500; // Nema dobitnih linija
//         } else if (numWinningLines <= 5) {
//             delay = 6000; // 1 linija dobitna
//         } else if (numWinningLines <= 10) {
//             delay = 8000; // 2 linije dobitne  
//         } else {
//             delay = 11000; // 3+ linije dobitne
//         }
        
//         console.log(`Čekam ${delay}ms pre sledećeg spina...`);
        
//         // Zakaži sledeći spin
//         autoTimer = setTimeout(() => {
//             if (autoMode) {
//                 startAutoMode(); // Rekurzivni poziv
//             }
//         }, delay);
        
//     }, 1000);
// }

// function stopAutoMode() {
//     console.log("Zaustavljam auto mode...");
//     autoMode = false;
//     dugme2.classList.remove("active");
    
//     // Očisti auto timer
//     if (autoTimer) {
//         clearTimeout(autoTimer);
//         autoTimer = null;
//     }
    
//     // Vrati dugmad u normalno stanje
//     dugme.classList.remove("disabled");
// }

// // ===== ZAMENITE EVENT LISTENER ZA dugme2 =====
// // UKLONITE POSTOJEĆI dugme2.addEventListener I DODAJTE OVAJ:
// dugme2.addEventListener('click', () => {
//     // Proveri da li ima dovoljno novca
//     var totalBet = parseInt(document.getElementById("Totalbet").textContent);
//     if (cashPlayer < totalBet) {
//         alert("Nemaš dovoljno novca za Auto mode");
//         return;
//     }
    
//     // Toggle auto mode
//     autoMode = !autoMode;
//     dugme2.classList.toggle("active");
    
//     if (autoMode) {
//         console.log("Uključujem Auto mode...");
//         dugme.classList.add("disabled");
//         startAutoMode();
//     } else {
//         console.log("Isključujem Auto mode...");
//         stopAllAnimationsAndFreeze();
//         stopAutoMode();
//     }
// });

// // ===== MODIFIKOVANA stopAllAnimationsAndFreeze FUNKCIJA =====
// function stopAllAnimationsAndFreeze() {
//     hardStop = true;
    
//     // Ne prekidaj auto mode osim ako nije eksplicitno zaustavljeno
//     if (!autoMode) {
//         trigger = false;
//     }
    
//     if (timer) { clearTimeout(timer); timer = null; }
//     animacijaLoop = false;
//     if (loopAnimacija) { clearTimeout(loopAnimacija); loopAnimacija = null; }

//     // Prekini sve pending setTimeout-ove iz animacija
//     for (const t of pendingTimers) clearTimeout(t);
//     pendingTimers.clear();

//     // Prekini sve rAF animacije po simbolima
//     if (drawSymbols && Array.isArray(drawSymbols)) {
//         for (const simbol of drawSymbols) {
//             simbol._isRunning = false;
//             if (simbol._animationID) {
//                 cancelAnimationFrame(simbol._animationID);
//                 simbol._animationID = null;
//             }
//         }
//     }
//     AktivneAnimacije.clear();

//     // Nacrtaj statične slike preko svih trenutnih simbola
//     if (drawSymbols && Array.isArray(drawSymbols)) {
//         for (const simbol of drawSymbols) {
//             drawStaticLogo(simbol);
//         }
//     }
// }