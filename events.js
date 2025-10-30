
// ============================================================
// BET KONTROLE
// ============================================================
function incrementAuto(){
    i1++;
    if(i1>6) i1=0;
    
    if (i1 == 6) {
        document.getElementById("rounds").textContent = "∞";
    } else {
        document.getElementById("rounds").textContent = roundAmount[i1];
    }
}

function decrementAuto(){
    i1--;
    if(i1<0) i1=6;

    if (i1 == 6) {
        document.getElementById("rounds").textContent = "∞";
    } else {
        document.getElementById("rounds").textContent = roundAmount[i1];
    }
}

function increment(){
    i++;
    if(i>4) i=0;
    document.getElementById("bet").textContent=betAmount[i];
    document.getElementById("Totalbet").textContent=(betAmount[i]*5).toFixed(2);
}

function decrement(){
    i--;
    if(i<0) i=4;
    document.getElementById("bet").textContent=betAmount[i];
    document.getElementById("Totalbet").textContent=(betAmount[i]*5).toFixed(2);
}

// ============================================================
// CASH DODAVANJE
// ============================================================
const moneyAdd= document.getElementById("cashAdd");
moneyAdd.addEventListener("click", ()=> {
    if(cashPlayer==0){
        cashPlayer+=500;
        dugme.classList.remove("disabled");
        creditValue.textContent=cashPlayer.toFixed(2);
    } else {
        alert("Kad nemas love tad me klikni");
    }
});

// ============================================================
// FULLSCREEN KONTROLE
// ============================================================
const fullBtn = document.getElementById("fullscreenBtn");
fullBtn.addEventListener("click", () => {
    if(!document.fullscreenElement){
        stopAllAnimationsAndFreeze();
        page.requestFullscreen();
    } else {
        stopAllAnimationsAndFreeze();
        document.exitFullscreen();
    }    
});

// UKLONI fullscreenchange listener - vec je u resize.js!

// ============================================================
// CREDIT/CASH PRIKAZ
// ============================================================
const creditSpan = document.getElementById("creditSpan");
const cashSpan = document.getElementById("cashSpan");
const creditValue= document.getElementById("credit");

cashSpan.addEventListener("click",()=>{
    cashSpan.style.color="white";
    creditSpan.style.color="gray";
    creditValue.innerText=cashPlayer.toFixed(2);
});

creditSpan.addEventListener("click",()=>{
    cashSpan.style.color="gray";
    creditSpan.style.color="white";
    creditValue.innerText=cashPlayer*100;
});

// ============================================================
// INFO/HELP SCREEN
// ============================================================
const infoDiv= document.getElementById("help-screen");
const infoBtn = document.getElementById("infoBtn");
const helpContent = document.getElementById("help-content");
const closeBtn = document.getElementById("close-help-screen");

infoBtn.addEventListener("click", ()=>{
    infoDiv.style.visibility="visible";
});

closeBtn.addEventListener("click",()=>{
    infoDiv.style.visibility="hidden";
});

infoDiv.addEventListener("click",(e)=>{
    if(!helpContent.contains(e.target)){
        infoDiv.style.visibility="hidden";
    }
});

// ============================================================
// AUTO PLAY SCREEN
// ============================================================
const autoDiv = document.getElementById("autoScreen");
const autoscreen = document.getElementById("autoscreen");
const autoGamble = document.getElementById("close-auto-screen");

autoscreen.addEventListener("click",()=>{
    autoDiv.style.visibility="visible";
});

autoGamble.addEventListener("click",()=>{
    autoDiv.style.visibility="hidden";
});


dugme2.addEventListener('click', () => {
    // Proveri da li igrac ima dovoljno novca
    var totalBet = parseInt(document.getElementById("Totalbet").textContent);
    if (cashPlayer < totalBet && !autoMode) {
        alert("Nemas dovoljno kredita za Auto mode!");
        return;
    }
    autoDiv.style.visibility="hidden";
    if (autoMode) {
        stopAutoMode();
    } else {
        startAutoMode();
    }
});