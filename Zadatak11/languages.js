let data = {
    en: {
        redButton: "RED",
        blackButton: "BLACK",
        winButton: "TAKE WIN",
        attempts : "ATTEMPTS",
        total : "TOTAL",
        gambleToWin: "GAMBLE TO WIN",
        earnings : "EARNINGS",
        gamble: "GAMBLE",
        label: "Choose language:",
        history : "HISTORY",
       p1: "-After each win in the base game, the player gets a chance to <strong>double the winnings</strong> through the \"Red or Black\" mini-game.",
       p2: "-The player chooses whether the card will be <strong>red (hearts/diamonds)</strong> or <strong>black (spades/clubs)</strong>.",
       p3: "-If the guess is correct, the winnings are <strong>doubled</strong> and the player can try again.",
       p4: "-If the guess is <strong>wrong</strong>, the player loses <strong>the entire winnings</strong> from the previous game.",
       p5: "-A maximum of <strong>5 successful doubling attempts</strong> is allowed per single win.",
       p6: "-The player can choose to stop and keep the current winnings at any time.",
       p7: "<em>Play responsibly. One wrong guess means losing the entire winnings.</em>",
       h2: "Game Rules - Double or Nothing: Red or Black"
    

    },
    sr: {
        redButton: "CRVENO",
        blackButton: "CRNO",
        winButton: "KASIRAJ",
        attempts : "POKUSAJI",
        total : "UKUPNO",
        gambleToWin: "KOCKAJ DUPLO",
        earnings : "ZARADA",
        gamble: "KOCKAJ",
        label: "Izaberi jezik:",
        history: "ISTORIJA",
        p1: "-Nakon svake pobede u osnovnoj igri, igrač dobija priliku da <strong>duplira dobitak</strong> kroz mini-igru \"Crvena ili Crna\".",
        p2: "-Igrač bira da li će karta biti <strong>crvena (herc/karo)</strong> ili <strong>crna (pik/tref)</strong>.",
        p3: "-Ako pogodi boju, dobitak se <strong>udvostručuje</strong> i može pokušati ponovo.",
        p4: "-Ako <strong>promaši</strong>, gubi <strong>ceo dobitak</strong> iz prethodne igre.",
        p5: "-Maksimalno <strong>5 uspešnih pokušaja</strong> duplanja po jednom dobitku.",
        p6: "-Igrač može odustati i zadržati trenutni dobitak u bilo kom trenutku.",
        p7: "<em>Igrajte odgovorno. Jedan pogrešan pokušaj znači gubitak kompletnog dobitka.</em>",
        h2: "Pravila igre - Duplo ili ništa: Crveno ili crno"

    }
}

let langs = document.getElementById("language");
    redButton= document.getElementById("red-button");
    blackButton= document.getElementById("black-button");
    winButton = document.getElementById("win-button");
    attempts = document.getElementById("attempts-lang");
    total = document.getElementById("gamble-total-lang");
    gambleToWin= document.getElementById("gamble-win-lang");
    earnings=document.getElementById("gamble-win-text");
    gambleText=document.getElementById("gamble-text");
    languageLabel = document.getElementById("labelModal");
    historyDiv= document.getElementById("history");
    p1=document.getElementById("p1");
    p2=document.getElementById("p2");
    p3=document.getElementById("p3");
    p4=document.getElementById("p4");
    p5=document.getElementById("p5");
    p6=document.getElementById("p6");
    p7=document.getElementById("p7");
    h2=document.getElementById("titleModal");

langs.addEventListener("change",() =>{
    let selectLang= langs.value;

    console.log(document.getElementById("gamble-text"));
    console.log(gamble);// ovo nije moglo jer poziva fju
    redButton.textContent=data[selectLang].redButton;
    blackButton.textContent=data[selectLang].blackButton;
    winButton.textContent=data[selectLang].winButton;
    attempts.textContent=data[selectLang].attempts;
    total.textContent=data[selectLang].total;
    gambleToWin.textContent=data[selectLang].gambleToWin;
    earnings.textContent=data[selectLang].earnings;
    gambleText.textContent=data[selectLang].gamble;
    languageLabel.textContent=data[selectLang].label;
    historyDiv.textContent=data[selectLang].history;
    p1.innerHTML=data[selectLang].p1;
    p2.innerHTML=data[selectLang].p2;
    p3.innerHTML=data[selectLang].p3;
    p4.innerHTML=data[selectLang].p4;
    p5.innerHTML=data[selectLang].p5;
    p6.innerHTML=data[selectLang].p6;
    p7.innerHTML=data[selectLang].p7;
    h2.innerHTML=data[selectLang].h2;
    // for (let i = 1; i <= 7; i++) {
    // const element = document.getElementById("p" + i);
    // const key = "p" + i;

    // // Obrati pažnju na grešku u originalu: p5 dobija p6 — to ispravljamo ovde
    // if (element && data[selectLang][key]) {
    //     element.innerHTML = data[selectLang][key];
    // }
}

)