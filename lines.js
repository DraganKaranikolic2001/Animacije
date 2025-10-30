function nacrtajLinije2(){
  
     const myResize = resizeToken;
    const mySpin = currentSpinId; 
        let width = dobitneLinije2[0].width;
        let height =  dobitneLinije2[0].height;
        ctxLine.strokeStyle = "yellow";
        ctxLine.lineWidth = debljina;

         ctxFront.strokeStyle = "yellow";
        ctxFront.lineWidth = debljina;

        function crtaj(){
        let x1 = dobitneLinije2[0].x+width/2;
        let x2= dobitneLinije2[2].x+width/2;
        let y1 = dobitneLinije2[0].y+height/2;
        let y2= dobitneLinije2[2].y+height/2;
        // console.log("x1 : " ,x1);
        // console.log("x2 : " ,x2);
        // console.log("y1 : " ,y1);
        // console.log("y2 : " ,y2); 
      
        // console.log("drawSymbols: ",drawSymbols)
        ctxLine.beginPath();
        ctxLine.moveTo(x1, y1);
        ctxLine.lineTo(x2, y2);
        ctxLine.stroke();
        let x11=x2;
        let y11=y2;
        let length = dobitneLinije2.length;
        let y22=dobitneLinije2[length-1].y+height/2;
        let x22=dobitneLinije2[length-1].x+width/2;
        let xEnd = drawSymbols[4].x+width/2;
        let yEnd = drawSymbols[4].y + height/2;
        if(dobitneLinije2.length==5){
              console.log("Uso sam u crtaj 5");
             ctxLine.beginPath();
            ctxLine.moveTo(x11, y11);
            ctxLine.lineTo(x22, y22);
            ctxLine.stroke();
        }
        else if(dobitneLinije2.length==3){
            console.log("Uso sam u crtanje sa 3 ");
            let xTmp = dobitneLinije2[2].x + width+10;
            let yTmp = dobitneLinije2[2].y;
         
            ctxLine.beginPath();
            ctxLine.moveTo(x11,y11);
            ctxLine.lineTo(xTmp,yTmp);
            ctxLine.stroke();

            ctxFront.beginPath()
            ctxFront.moveTo(xTmp,yTmp);
            ctxFront.lineTo(xEnd,yEnd);
            ctxFront.stroke();

        }
        else{
              console.log("Uso sam u crtaj4");
            ctxLine.beginPath();
            ctxLine.moveTo(x11, y11);
            ctxLine.lineTo(x22, y22);
            ctxLine.stroke();
            let xTmp = dobitneLinije2[length-1].x + width+10;
            let yTmp = dobitneLinije2[length-1].y;
            
            ctxLine.beginPath();
            ctxLine.moveTo(x22, y22);
            ctxLine.lineTo(xTmp, yTmp);
            ctxLine.stroke();


            ctxFront.beginPath()
            ctxFront.moveTo(xTmp,yTmp);
            ctxFront.lineTo(xEnd,yEnd);
            ctxFront.stroke();
        }
       
        
        // console.log("x11 : " ,x11);
        // console.log("x22 : " ,x22);
        // console.log("y11 : " ,y11);
        // console.log("y22 : " ,y22);

       

          const sveZavrsene = dobitneLinije2.every(simbol => !simbol._isRunning || simbol._spinId !== mySpin);

         if(!sveZavrsene){
            requestAnimationFrame(crtaj);

        }
        else{
            ctxLine.clearRect(0,0,canvas.width,canvas.height);
            ctxFront.clearRect(0,0,canvas.width,canvas.height);
            // console.log("hej");
        }
        }
        requestAnimationFrame(crtaj);
       
}
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

        const sveZavrsene = grupa.every(simbol => !simbol._isRunning || simbol._spinId != mySpin);
        console.log("sveZavr" , sveZavrsene);
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