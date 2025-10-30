// const { StrictMode } = require("react");
// === Clear sessionStorage samo na REFRESH (pre svega ostalog!) ===
(() => {
  const n = performance.getEntriesByType?.('navigation')?.[0];
  if ((n && n.type === 'reload') || (!n && performance?.navigation?.type === 1)) {
    sessionStorage.clear();
  }
})();   
const AktivneAnimacije = new Map();
//Globalni ID spina i set za tajmere
let currentSpinId = 0;
let resizeToken = 0;
const pendingTimers = new Set();
let hardStop = false;          // globalni kill-switch
let startLoopTimer = null;     // tajmer iz pokreniAnimacijuSvih()
let autoMode = false;
let autoTimer = null;
let maxAutoRounds = 0;        
let currentAutoRound = 0; 
let maxMoney=0 ;
let trigger=false;
let timer = null;
let isPayingOut = false;
let moneyTrigger = false
let drawSymbols;
let animacijaLoop= false;
let symbolIndex = 0;
let dobitneLinije=[];
let loopAnimacija=null;
let dobitneLinije2=[]
let debljina = 2;
let increase = true;
const page= document.getElementById("main-container");
const dugme = document.getElementById("button");
const dugme2 = document.getElementById("button2");
const gambleBtn = document.getElementById("gambleBtn");
const winText = document.getElementById("win");
const symbols = [
    // { id:0 , src : "symbols/0.png", srcSprite:"sprites/0.png" ,width: 260, height: 260},
    { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",value:1},
    // { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png",value:2 },
    // { id:3 , src : "symbols/3.png" ,srcSprite:"sprites/3.png" ,value:2},
    // { id:4 , src : "symbols/4.png" ,srcSprite:"sprites/4.png" ,value:3},
    // { id:5 , src : "symbols/5.png" ,srcSprite:"sprites/5.png",value:4},
    // { id:6 , src : "symbols/6.png" ,srcSprite:"sprites/6.png" ,value:4},
    // { id:7 , src : "symbols/7.png" ,srcSprite:"sprites/7.png" ,value:4},
    // { id:8 , src : "symbols/8.png" ,srcSprite:"sprites/8.png" ,value:4},
    // { id:9 , src : "symbols/9.png" ,srcSprite:"sprites/9.png" ,width: 260, height: 260},
    // { id:10 , src : "symbols/10.png" ,srcSprite:"sprites/10.png" ,width: 260, height: 260}
];

 function generateSymbol(){
    const randomIndex= Math.floor(Math.random()*symbols.length);
    return symbols[randomIndex];
}
//------------------------------------------------------------------
//Sve za cash
const CASH_PLAYER_KEY = 'slot:cashplayer';
const RET_KEY = 'slot:returnTo';
const BET_KEY = 'slot:betlines';
const SYMBOL_KEY= 'slot:symbols';
function loadBalance_Bet(){
    const s = sessionStorage.getItem(CASH_PLAYER_KEY);
    if(s!=null) cashPlayer=Number(s);
    const b = sessionStorage.getItem(BET_KEY);
    if(b!=null) i=Number(b);
    const raw = sessionStorage.getItem(SYMBOL_KEY);
    if(!raw)
    {
        drawSymbols=[]
        return;
    }
    const symb =JSON.parse(raw); 
    drawSymbols= symb.map(s=>({
        id: s.id,
    x: Number(s.x),
    y: Number(s.y),
    nx: Number(s.nx),
    ny: Number(s.ny),
    nw: Number(s.nw),
    nh: Number(s.nh),
    src: s.src,               
    srcStatic: s.srcStatic,   
    width: Number(s.width),
    height: Number(s.height),
    value: s.value,
    _isRunning: false,
    _animationID: null,
    _timeoutId: null,
    _spinId: currentSpinId 
    }));
}
function saveBalance_Bet(){
    sessionStorage.setItem(CASH_PLAYER_KEY,String(cashPlayer));
    sessionStorage.setItem(BET_KEY,String(i));
    sessionStorage.setItem(SYMBOL_KEY,JSON.stringify(drawSymbols));
}

let cashPlayer=500.00;
let gambleLimit = 2000.00;
let i =0;
const betAmount = [1,2,5,10,20];
var betText = parseFloat(betAmount[i]);
let i1=0;
const roundAmount = [5,10,25,50,100,1000,Infinity];
var roundText = parseFloat(roundAmount[i1]);

//-----------------------------------------------------------------------------------------
//Canvasi
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const canvasLine= document.getElementById("canvas2");
const ctxLine= canvasLine.getContext("2d");
const canvasFront = document.getElementById("canvas3");
const ctxFront = canvasFront.getContext("2d");
//-------------------------------------------------------------------
// const simboli = [
//                   { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
//                   { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
//                   { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
//                    { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},
//                 { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},
//                      { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
//                 { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
//                      { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
//                     { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},
//                      { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},
//                    { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
//                   { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
//                   { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
//                      { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},
//                     { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},   
               
//             ];
            // const simboli = [
            //       { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
            //       { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
            //       { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
            //       { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
            //       { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
            //          { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
            //     { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
            //          { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
            //         { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
            //          { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},
            //        { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},
            //       { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
            //       { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
            //          { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},
            //         { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},   
               
            // ];
            // const simboli = [
            //       { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
            //       { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
            //       { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
            //        { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},
            //     { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},
            //          { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
            //     { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
            //          { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
            //         { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},
            //          { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},
            //        { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
            //       { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
            //       { id:1 , src : "symbols/1.png" , srcSprite:"sprites/1.png",width: 260, height: 260},
            //          { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},
            //         { id:2 , src : "symbols/2.png" ,srcSprite:"sprites/2.png" ,width: 260, height: 260},   
               
            // ];

function drawSlot(){
    if(cashPlayer<=0){
        alert("Nemas vise kredita, ubaci jos novca");
        dugme.classList.add("disabled");
        return;
    }
    var totalBet = parseInt(document.getElementById("Totalbet").textContent);
     if(cashPlayer<totalBet){
        alert("Nemas dovoljno novca, smanji bet");
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
            // const symbol =simboli[symbolIndex]
            // symbolIndex++;
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
    dobitneLinije2=[];
    // console.log(dobitneLinije); 

    setTimeout(()=>{
        Spoji();
    },200);
    //  console.log(drawSymbols);
}
function Spoji(){
    const mySpin = currentSpinId;
    let x1;
    let x2;
    let brojac = 0;
    let j;
    // console.log(`Dobitne Linije:`, dobitneLinije);
    // console.log(dobitneLinije);
    //Idemo kroz redove 
    for (let m = 0; m < 3; m++){
        if (mySpin !== currentSpinId) return;
        brojac = 0;
        x1 = drawSymbols[m*5];
        // console.log('x1:', x1); //prvi element za svaki red
        j = m*5+1; // indeks za element nakon prvog u redu
        for (let i = 0; i < 4; i++){
            x2 = drawSymbols[j];
            if(x1.id === x2.id){ // provera da li su isti 
                j++;
                brojac++;
            }
        }
        
        if(brojac >= 2){
            if (mySpin !== currentSpinId) return;
            let prom = 5*m; // indeks za prvi element u nizu 
          
            while(0 <= brojac){
                
                tempSimb = drawSymbols[prom];
                // console.log("TempSimb: ",tempSimb);
                dobitneLinije.push(tempSimb);
                prom++; 
                brojac--; 
            }           
        }
    }
    console.log("DrawSymbol : ",drawSymbols);
    //Druga Linija spajanja
    let y1;
    let y2;
    let brojac1 = 0;
    let i1 = 0;
    // while(i1<3){
        y1=drawSymbols[0];
        dobitneLinije2.push(y1);
        console.log("y1",y1)
        for(let x = 1;x<3;x++)
        {
            y2=drawSymbols[x*6];
            // console.log("y2",y2);
            if(y1.id==y2.id)
            {
                
                brojac1++
                dobitneLinije2.push(y2);                
            }
            else{
                break;
            }

        }
        if(brojac1==2)
        {
            for(let x = 2;x>0;x--)
            {
                y2=drawSymbols[x*4]
                console.log("y2",y2);
                if(y1.id==y2.id)
                {
                    brojac1++
                    dobitneLinije2.push(y2);
                }
                else{
                    break
                }
            }
        }
        if(brojac1>=2)
        {
            console.log("ALOOOO");
        }
        // console.log(brojac1);
        // console.log("Dobitne2: " , dobitneLinije2);
//---------------------------------------------------
    // }
    
    if (mySpin !== currentSpinId) return;
    var totalBet = parseInt(document.getElementById("Totalbet").textContent);
    var win = 0;
   
    // Prvo uvek oduzmi bet
    cashPlayer -= totalBet;
    creditValue.textContent = cashPlayer.toFixed(2);
    
   
    if(dobitneLinije.length > 0 || dobitneLinije2.length>2) {
        // console.log("Pronadjena dobitna linija");
        // trigger=false;
        const grupa = {};
        for(let simbol of dobitneLinije) {
            let y = simbol.y;
            let yPoz = y + (simbol.height / 2);
            if(!grupa[yPoz]) {
                grupa[yPoz] = [];
            }
            grupa[yPoz].push(simbol);
        }
        
        // Racunanje dobitka
        for(let yPoz in grupa) {
            var wintmp = 0;
            let tmp = grupa[yPoz];
            let x = tmp.length;
            console.log("tmp u dobitku: " ,tmp);

            switch(tmp[0].value) {
                case 1:
                    switch(x) {
                        case 3: wintmp = totalBet * 10; break;
                        case 4: wintmp = totalBet * 40; break;
                        case 5: wintmp = totalBet * 600; break;
                        default: wintmp = 0; break;    
                    }
                    break;
                case 2:
                    switch(x) {
                        case 3: wintmp = totalBet * 8; break;
                        case 4: wintmp = totalBet * 20; break;
                        case 5: wintmp = totalBet * 100; break;
                        default: wintmp = 0; break;    
                    }
                    break;
                case 3: 
                    switch(x) {
                        case 3: wintmp = totalBet * 4; break;
                        case 4: wintmp = totalBet * 10; break;
                        case 5: wintmp = totalBet * 40; break;
                        default: wintmp = 0; break;        
                    }
                    break;   
                case 4:
                    switch(x) {
                        case 3: wintmp = totalBet * 2; break;
                        case 4: wintmp = totalBet * 6; break;
                        case 5: wintmp = totalBet * 20; break;
                        default: wintmp = 0; break;    
                    }
                    break;
                default:
                    wintmp = 0;
            }
            win += wintmp;
        }
        //Dobitak za nakrivo liniju(4linija)
        let wintmp1 =0
        let tmp1 = dobitneLinije2.length;
        switch(dobitneLinije2[0].value) {
                case 1:
                    switch(tmp1) {
                        case 3: wintmp1 = totalBet * 10; break;
                        case 4: wintmp1 = totalBet * 40; break;
                        case 5: wintmp1 = totalBet * 600; break;
                        default: wintmp1 = 0; break;    
                    }
                    break;
                case 2:
                    switch(tmp1) {
                        case 3: wintmp1 = totalBet * 8; break;
                        case 4: wintmp1 = totalBet * 20; break;
                        case 5: wintmp1 = totalBet * 100; break;
                        default: wintmp1 = 0; break;    
                    }
                    break;
                case 3: 
                    switch(tmp1) {
                        case 3: wintmp1 = totalBet * 4; break;
                        case 4: wintmp1 = totalBet * 10; break;
                        case 5: wintmp1 = totalBet * 40; break;
                        default: wintmp1 = 0; break;        
                    }
                    break;   
                case 4:
                    switch(tmp1) {
                        case 3: wintmp1 = totalBet * 2; break;
                        case 4: wintmp1 = totalBet * 6; break;
                        case 5: wintmp1 = totalBet * 20; break;
                        default: wintmp1 = 0; break;    
                    }
                    break;
                default:
                    wintmp1 = 0;
            }
            win += wintmp1;
        
        // console.log("Win:" + win); 
        document.getElementById("win").textContent = win.toFixed(2);
        dugme.classList.add("disabled");
        // Pokreni animacije svih dobitnih simbola odjednom
        pokreniAnimacijuSvih();
        
            setTimeout(() => {
               
            if (autoMode) {
                MoneyTransferAuto(win);
            } else {
                if(win<=gambleLimit){
                    gambleBtn.classList.remove("disabled");
                }
                setButtonTakeWin(win);
            }
        }, 2800); // Ceka da se zavrse pocetne animacije
        console.log(win);
        gambleBtn.addEventListener('click', ()=>{
            saveBalance_Bet();
            sessionStorage.setItem(RET_KEY,location.href);
            const stake = win;
            const url = new URL('/Zadatak11/zadatak.html',location.origin);
            url.searchParams.set('stake',String(stake));

            location.href=url.toString();
        })

        
        
        // Zakazuj transfer novca nakon sto se zavrse animacije
                
    } else {
        // Nema dobitnih linija
        // console.log("Nema dobitnih linija");
        

        if (autoMode) {
            scheduleNextAutoSpin(0,0); // 0 = nema dobitnih linija
        }
    }
}
function setButtonStart(){
    stopAllAnimationsAndFreeze();
    dugme.textContent="Start";
    dugme.classList.remove("takeWin");
    dugme.onclick=()=> drawSlot();
    console.log("Novac koji imas:" + cashPlayer);
}
function setButtonTakeWin(amount) {
  dugme.classList.remove("disabled");
  dugme.textContent = "Take Win";
  dugme.classList.add("takeWin"); 


  dugme.onclick = () => {
    MoneyTransfer(amount)
    gambleBtn.classList.add("disabled");
};
}
function MoneyTransfer(amount,callback)
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
        // console.log("Haha");
        dugme.classList.remove("disabled");
        isPayingOut = false;
            setButtonStart();
         if (callback && typeof callback === 'function') {
                callback();
            }
          
      }
    }
    requestAnimationFrame(tick);
}
//-------------------------------------------------------------
//Animacije i linije


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

document.addEventListener('DOMContentLoaded', () => {
    loadBalance_Bet();
    document.getElementById("rounds").textContent=roundAmount[i1];
    document.getElementById("bet").textContent=betAmount[i];
    document.getElementById("Totalbet").textContent=(betAmount[i]*5).toFixed(2);
    document.getElementById("credit").textContent=cashPlayer.toFixed(2);
    console.log(drawSymbols);
    resize();
    if(Array.isArray(drawSymbols) && drawSymbols.length){
        rescaleAndreDraw();
    }
  
    setButtonStart();
    console.log(i);
  });
//-----------------------------------------------------------------
// Modifikovan stopAllAnimationsAndFreeze da radi sa auto modom

// da li u toku padanja reeelova on vec spoji sta treba i zato odmah spaja kod veryHot 5???

//ako je gamble limit za winove ako osvojimo 2000 ne moze gamble  : dodato 
//Auto play mode , koliko rundi uz to dodati opcije kao checkbox : stopOnWin , limitPotrosenogNovca nakog koga se autoplay prekida