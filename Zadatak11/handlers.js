//Handler za modalni prozor
const modalWindow={
    magic : document.querySelector(".info-button"),
    modal : document.querySelector(".modal"),
    x : document.querySelector(".x"),
    overlay : document.querySelector(".overlay"),

    open(){
        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');
        AudioHandler.play('help');
        AudioHandler.stop('gif');
    },
    close(){
        modal.classList.add('hidden');
        overlay.classList.add('hidden');
        AudioHandler.play("gif");
    },
    Events(){
        this.magic.addEventListener('click',()=>this.open());
        this.x.addEventListener('click',()=>this.close());
        this.overlay.addEventListener('click', ()=>this.close());
    }
}
//-----------------------------------------------------------------
//Prozor za zvuk na pocetku ucitavanja igrice(handler)
const introHandler={
    doc1 : document.querySelector(".intro-button-yes"),
    doc2 : document.querySelector(".intro-button-no"),
    intro : document.querySelector('.intro'),
    volumeIcon: document.getElementById("volume"),
    yesSound() {
        this.intro.style.display="none";
        AudioHandler.setMode("on");
     },
    noSound () {
        this.intro.style.display="none";
    },
    introEvents(){
        this.doc1.addEventListener("click",()=>this.yesSound());
        this.doc2.addEventListener("click",()=>this.noSound());
    } 

}
//-------------------------------------------------
const ModalSetting = { 
    modalSettings : document.getElementById('myModal'),
    openBtn : document.getElementById('settingsBtn'),
    closeBtn : document.querySelector('.closeSettings'),

    close() {
        this.modalSettings.classList.add("hidden");
    },
    open(){
        this.modalSettings.classList.remove('hidden');
            if((window.innerWidth/window.innerHeight)>1)
                {
                    setTimeout(() => {
                    resizeLandscape(); // sad ima dimenzije
                    }, 10);
                //Da nismo dodali setTimeout ne bi radilo jer kad on ucita stranicu 
                // Modal nema vrednost jer je display none i ne renderuje ga, a posto
                // smo stavili timeout on ima vremena da procita vrednosti i da ga resize-uje
                }
            else{
                        setTimeout(() => {
                        resizePortrait(); // sad ima dimenzije
                    }, 10);
                }
    },
    Events(){
        this.openBtn.addEventListener("click",()=>this.open());
        this.closeBtn.addEventListener("click",()=>this.close());
        window.addEventListener("click",(e)=>{
            if(e.target==this.modalSettings)
                this.close();
        })
    }
}