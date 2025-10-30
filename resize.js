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
  gambleBtn.style.fontSize=(scaleLabel*0.07) + "px";

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

    setTimeout(()=>{
        stopAllAnimationsAndFreeze();
    },1000)
     // prekid svih animacija da ne bi se videli pri resizu window-a

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
    stopAutoMode();
    console.log("Uso si u fju");
 }
function handleResizeChange() {
  resizeToken++;     // invalidiraj stare callback-ove
  resize();          // podesi canvas (atribute + DPR)
  rescaleAndreDraw();// preračunaj x/y/width/height i iscrtaj
}
// novi handleri umesto gore navedenih 
window.addEventListener('resize', handleResizeChange);
// window.addEventListener('orientationchange', handleResizeChange);
document.addEventListener('fullscreenchange', handleResizeChange);

window.addEventListener('load', () => {
  resize();
  rescaleAndreDraw();
});