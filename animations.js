const frameInterval = 1000/30;
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
function stopAllAnimationsAndFreeze() {
    hardStop = true;
    
    // Ne zaustavljaj auto mode osim ako nije eksplicitno zaustavljeno
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

    // Nacrtaj staticne slike preko svih trenutnih simbola
    if (drawSymbols && Array.isArray(drawSymbols)) {
        for (const simbol of drawSymbols) {
            drawStaticLogo(simbol);
        }
    }
    
    // Resetuj hardStop nakon kratke pauze
    setTimeout(() => {
        hardStop = false;
    }, 100);
}

function pokreniAnimacijuSvih(){ 
    
    const mySpin = currentSpinId;
    if (mySpin !== currentSpinId) return;
    const cssW = canvas.clientWidth;
    
    // Grupisanje simbola po yPoz
    const grupe = {};
    for (let simbol of dobitneLinije) {
        let y = simbol.y;
        let yPoz = y + (simbol.height / 2);

        if (!grupe[yPoz]) {
            grupe[yPoz] = [];
        }
        grupe[yPoz].push(simbol);
    }
    
    // Pokretanje animacija za sve simbole odjednom
    for (let yPoz in grupe) {
        let grupa = grupe[yPoz];
        let tag = false;
        let poslednji = grupa[grupa.length - 1];
        let endX;
        let x;
        
        if(grupa.length === 5){
            endX = poslednji.x + poslednji.width / 2;
            x = endX;
            tag = true;
        } else {
            endX = poslednji.x + poslednji.width;
            x = cssW - poslednji.width / 2 - grupa[0].x-7; // 7 je dodata kako bi se preklopila 4 linija sa 1 linijom
        }
        // Animacije simbola u ovoj grupi
        for (let simbol of grupa) {
            startCanvasAnimation(1800, simbol);
        }
        
        // Crtanje linija
        nacrtajLinije(
            grupa[0].x + 20,endX,x,Number(yPoz),grupa,tag
        );
    }
    if(dobitneLinije2.length>2)
    {
        nacrtajLinije2();
        for(let simbol of dobitneLinije2){
        startCanvasAnimation(1800,simbol);
        }
        

    }
    
    

    // Pokreni loop animacije (1 po 1 red) nakon pocetnih animacija
    if (startLoopTimer) { 
        clearTimeout(startLoopTimer); 
        startLoopTimer = null; 
    }
    
    startLoopTimer = setTimeout(() => {
        if (!hardStop && mySpin === currentSpinId && (dobitneLinije.length > 0 || dobitneLinije2.length>2)) {
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
    // console.log("yRedosled",yRedosled.length);
    
    let indeks = 0;

    function animirajSledecuGrupu() {
        
          if (!animacijaLoop  || yRedosled.length === 0) return;
          if(indeks==yRedosled.length){
             for(let simbol of dobitneLinije2)
            {
                startCanvasAnimation(1800,simbol);
            }
            nacrtajLinije2()
          }
        else{
        // console.log("Indeks",indeks);
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
            endX=grupa[duzina-1].x+grupa[0].width/2.2;
            x=endX;
            tag=true;
            // console.log("USO SAM");
        }
        else{
             x= cssW-grupa[0].width/2-grupa[0].x;
            endX=grupa[duzina-1].x+grupa[0].width-20;
        }

        // Animacija svih simbola u toj grupi
        for (let simbol of grupa) {
            startCanvasAnimation(1800, simbol);
            i++;
        }
        
        nacrtajLinije(startX,endX,x,yPoz,grupa,tag);
        }          
        
        // if(indeks==3){
        //    
        // }
      
        if(dobitneLinije2.length>2)
        {
            indeks = (indeks + 1) % (yRedosled.length+1);
        }
        else{
            indeks = (indeks + 1) % (yRedosled.length);
        }
        
        // console.log(indeks);
        // console.log(yRedosled.length);
        // if(indeks == yRedosled.length-1)
        // {
        //     for(let simbol of dobitneLinije2){
        // startCanvasAnimation(1800,simbol);
        // }
        // }
        loopAnimacija=setTimeout(animirajSledecuGrupu, 2600); // rekurzivni poziv fje da animira sve ostale grupe po vrednoscu Y 
    }
    


    animirajSledecuGrupu(); // pokreni prvu grupu
}

