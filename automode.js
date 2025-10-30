
function MoneyTransferAuto(amount) {
    if (isPayingOut) return;
    isPayingOut = true;
    num1=dobitneLinije.length;
    num2=dobitneLinije2.length;
    const check = document.getElementById("checkbox");
    console.log(check.checked);
    if(check.checked && (num1>0 || num2>2)){
        isPayingOut = false;
        stopAutoMode();
        dugme.classList.remove("disabled");
        
        // Ako je dobitak u limitu, omogući gamble
        if(amount <= gambleLimit) {
            gambleBtn.classList.remove("disabled");
        }
        
        // Postavi dugme na "Take Win"
        setButtonTakeWin(amount);
        
        return; // Izađi iz funkcije - NE prebacuj novac automatski
    }
    
    // console.log("Auto transfer pocinje za iznos: " + amount);
    
    const winEl = winText;           
    const creditEl = creditValue;       

    const win0 = Math.min(amount, (Number(winEl.textContent) || 0));
    const cash0 = Number(creditEl.textContent) || 0;
    const target = Number(amount) || 0;

    const DURATION = 900;
    const start = performance.now();

    function tick(t) {
        if (!autoMode && !isPayingOut) return; 
        
        const p = Math.min(1, (t - start) / DURATION);
        const moved = Math.round(target * p * 100) / 100;
        const newWin = (win0 - moved);
        const newBal = (cash0 + moved);

        winEl.textContent = newWin.toFixed(2);
        creditEl.textContent = newBal.toFixed(2);

        if (p < 1) {
            requestAnimationFrame(tick);
        } else {
            // Zavrsi transfer
            winEl.textContent = (win0 - target).toFixed(2);
            creditEl.textContent = (cash0 + target).toFixed(2);
            cashPlayer += amount;
            console.log("Auto transfer zavrsen");
            
            isPayingOut = false;
            
            // Zakazuj sledeci auto spin
            if (autoMode) {
                scheduleNextAutoSpin(dobitneLinije.length,dobitneLinije2.length);
            }
        }
    }

    requestAnimationFrame(tick);
}
// Funkcija za zakazivanje sledeceg auto spina
function scheduleNextAutoSpin(num1,num2) {
    if (!autoMode) return;
    // console.log(numWinningLines);
    // Proveri da li igrac ima dovoljno novca za sledeci bet
       const check = document.getElementById("checkbox");
    var totalBet = parseInt(document.getElementById("Totalbet").textContent);
    if (cashPlayer < totalBet) {
        console.log("Nema dovoljno novca, zaustavljam auto mode");
        stopAutoMode();
        alert("Nemas vise kredita!");
        return;
    }
    
    if(maxMoney>0)
    {
        maxMoney-=betAmount[i]*5;
    }
    if(maxMoney==0 && moneyTrigger==true){
        stopAutoMode();
        alert("Prosao si limit novca sto si zadao")
    }
    console.log("U Schedule: ",maxMoney);
   
        currentAutoRound++;
        console.log(`Runda ${currentAutoRound} od ${maxAutoRounds}`);
    
        if (currentAutoRound >= maxAutoRounds && moneyTrigger==false && !check.checked) {
        // console.log("Dostignut maksimalan broj rundi!");
        stopAutoMode();
        alert(`Zavrsene auto runde!`);
        return;
        }
    
    
     const grupePoY = {}; 

    for (let simbol of dobitneLinije) {
        if (!grupePoY[simbol.y]) {
            grupePoY[simbol.y] = [];
        }

       
        grupePoY[simbol.y].push(simbol);
    }

    
    // Sortiranje y vrednosti (npr. 0, 50, 100)
    const yRedosled = Object.keys(grupePoY).map(Number).sort((a, b) => a - b);

    //Mora da se resi kad ima manje od 15 a ima 4 linije za spajanje 
    let delay;
    
    if(num2<=2){
        if(num1 == 0)
        {
            delay = 1300; 
        }
        else if (num1 <=5 )
        {
            delay = 1500; // 1 dobitna linija
        }
        else if (num1 <=10)
        {
            delay=3350  //2 dobitne linije
        }
        else{
            delay = 6500 // 3 dobitne linije
        }

    }
    else {
        if(num1 == 0)
        {
            delay=1500; // 1 dobitna samo kosa
        }
        else if (num1 <=5)
        {
            delay = 3350; // 2 dobitne kosa i 1 ravna
        }
        else if (num1<=10 && yRedosled.length!=3) // slucaj 3 3 4 (ravne) i 3 kosa 
        {
            delay = 6500; // 3 dobitne kosa i 2 ravne 
        }
        else {
            delay = 9300;
        }

    }
    console.log(i);
    autoTimer = setTimeout(() => {
        if (autoMode) {
            console.log("Pokretam sledeci auto spin");
            drawSlot();
        }
    }, delay);
}
// Funkcija za pokretanje auto mode-a
function startAutoMode() {
    maxAutoRounds = roundAmount[i1];
    console.log(maxAutoRounds);
    maxMoney=document.getElementById("moneyLimit").value;
    console.log("U startAuto: ",maxMoney);
    if(maxMoney>0)
    {
        moneyTrigger=true;
        maxMoney-=betAmount[i]*5;    
    }
    currentAutoRound = 0;
    let amount = document.getElementById("win").textContent;
   if(amount > 0) {
        // Prvo prebaci win u cash, PA TEK ONDA pokreni auto
        MoneyTransfer(amount, () => {
            // Ovaj kod se izvršava NAKON što se transfer završi
            autoMode = true;
            dugme.classList.add("disabled");
            dugme2.classList.add("active");
            gambleBtn.classList.add("disabled");
            // Pokreni prvi spin
            drawSlot();
        });
    } else {
        // Nema dobitka, odmah pokreni auto
        autoMode = true;
        dugme.classList.add("disabled");
        dugme2.classList.add("active");
        gambleBtn.classList.add("disabled");
        drawSlot();
    }
}
// Funkcija za zaustavljanje auto mode-a
function stopAutoMode() {
    console.log("Zaustavljam auto mode...");
    autoMode = false;
    dugme2.classList.remove("active");
    dugme.classList.remove("disabled");
    let amount = document.getElementById("win").value;
    currentAutoRound = 0;
    maxAutoRounds = 0;
    maxMoney=0;
    moneyTrigger=false;
    console.log(amount);
    if(amount<=gambleLimit)
    {
         gambleBtn.classList.remove("disabled");
    }
    // Ocisti sve auto tajmere
    if (autoTimer) {
        clearTimeout(autoTimer);
        autoTimer = null;
    }
    
    // Zaustavi sve animacije ako je potrebno
    animacijaLoop = false;
    if (loopAnimacija) {
        clearTimeout(loopAnimacija);
        loopAnimacija = null;
    }
    
    setButtonStart();
}

