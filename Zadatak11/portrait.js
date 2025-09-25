    function resizePortrait(){
    const glavniEl= document.getElementById("main-page");
    let width= window.innerWidth;
    let height= window.innerHeight;

    const modalWrapper= document.querySelector(".modal-wrapper");
    const modal = document.getElementById('modal');
    const modalStn = document.getElementById("myModal");
    const modal1 = document.querySelector(".modal-content");    
    const ratio=9/16;

    if(width/height>ratio)
    {
        glavniEl.style.height=height+"px";
        glavniEl.style.width=(height*ratio)+"px";

        modalWrapper.style.height=height+"px";
        modalWrapper.style.width=(height*ratio)+"px";

        modalStn.style.height=height+"px";
        modalStn.style.width=(height*ratio)+"px";
    }
    else{
        glavniEl.style.width=width+"px";
        glavniEl.style.height=(width/ratio)+"px";
        
        modalWrapper.style.width=width+"px";
        modalWrapper.style.height=(width/ratio)+"px";

        modalStn.style.width=width+"px";
        modalStn.style.height=(width/ratio)+"px";
    }
    
    modal.style.width=(modalWrapper.clientWidth*0.8 )+ "px";
    modal.style.maxHeight=(modalWrapper.clientHeight*0.7)+"px";

    modal1.style.maxWidth=(modalStn.clientWidth*0.8 )+ "px";
    modal1.style.maxHeight=(modalStn.clientHeight*0.7)+"px";    
    if((window.innerWidth/window.innerHeight)<=1)
    {
        document.getElementById("win-button").classList.remove("hidden");
    }
    

    const baseForAll= glavniEl.clientWidth;
    const baseForModal= modalWrapper.clientWidth;
    const titleModal= document.getElementById("titleModal");
    const paraModal= document.querySelectorAll("p");
    const buttonModal= document.querySelector('.x');

    titleModal.style.fontSize=(baseForModal*0.04)+ "px";
    paraModal.forEach( e=>{
        e.style.fontSize=(baseForModal*0.04)+"px";
    })
    buttonModal.style.fontSize=(baseForModal*0.04)+"px";
    buttonModal.style.padding= (baseForModal*0.01)+"px"+ (baseForModal*0.015)+"px";
    //Dugmici take,red,black
    const buttonsEl=document.querySelectorAll(".button");
    buttonsEl.forEach(e=>{
        e.style.fontSize=(baseForAll*0.04)+"px";
    })
    const buttonUpDown=document.querySelectorAll(".buttonGamble");
    buttonUpDown.forEach(e=>{
        e.style.fontSize=(baseForAll*0.05)+"px";
    })
    //History
    const historyEl= document.getElementById("history");
    historyEl.style.fontSize=(baseForAll*0.05)+"px";
    //Info , setting i volume dugmici

    const infoBtn= document.getElementById("magic-button");
    const muteBtn=document.getElementById("mutebtn");
    const IconElementsI=document.querySelectorAll("i");
    const IconSize=baseForAll*0.09;
    const settingsBtn = document.getElementById("settingsBtn");

    IconElementsI.forEach(e=>{
        e.style.fontSize=(baseForAll*0.05)+"px";
    })

    muteBtn.style.width=IconSize+"px";
    muteBtn.style.height=IconSize+"px";

    settingsBtn.style.width=IconSize+"px";
    settingsBtn.style.height=IconSize+"px";

    infoBtn.style.width=IconSize+"px";
    infoBtn.style.height=IconSize+"px";
    
    //Labela za jezik kao i select opcija 
    const labelSettings = document.getElementById("labelModal");
    labelSettings.style.fontSize= (baseForAll*0.03)+"px";
    const selectSettings= document.getElementById("language");
    selectSettings.style.width=(baseForAll*0.15)+"px";
    selectSettings.style.height=(baseForAll*0.05)+"px";

    //Div-ovi sa informacijama za gamble amount i ostalo
    const AmountLabelEl= document.querySelectorAll(".gamble-info-label");
    const AmountValueEl= document.querySelectorAll(".gamble-info-amount");

    AmountLabelEl.forEach(e=>{
        e.style.fontSize=(baseForAll*0.03)+"px";
    })
    AmountValueEl.forEach(e=>{
        e.style.fontSize=(baseForAll*0.03)+"px";
    })


const amountEl = document.querySelector(".gamble-amount");
amountEl.style.fontSize = (baseForAll * 0.035) + "px";

}


//Mora se srediti za modal podesavanja kako se racuna za label i za option za jezik kao i u css
// definisati max width i max height tacnije sta treba