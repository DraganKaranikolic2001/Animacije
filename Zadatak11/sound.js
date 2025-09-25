const Sound= Object.freeze({

    BlackButton : {
        id: 'black',
        src : 'sounds/BlackButtonClick.mp3',
        volume: '1.0'
    },
    RedButton : {
        id: 'red',
        src: 'sounds/RedButtonClick.mp3',
        volume: '1.0'
    },
    HelpButton : {
        id : 'help',
        src : 'sounds/ChangeHelp.mp3',
        volume : '1.0'
    },
    Win : {
        id: 'win',
        src : 'sounds/RedBlackWin.mp3',
        volume : '1.0'
    },
    Lose : {
        id: 'lose',
        src : 'sounds/RedBlackLose.mp3',
        volume :'1.0'
    },
    Gif : {
        id: 'gif',
        src : 'sounds/CardsMove.mp3',
        volume : '0.7',
        loop: true
    },
    Take : {
        id : 'take',
        src : 'sounds/ToCredit.mp3',
        volume : '1.0'
    }
});

const AudioHandler = {
    sounds: {},
    mode: "on", // "on" | "half" | "mute"
    volumeIcon: document.getElementById("volume"),

    init() {
        for (let key in Sound) {
            const soundData = Sound[key];
            const audio = new Audio(soundData.src);
            audio.volume = soundData.volume || 0.7;
            audio.loop = soundData.loop;
            this.sounds[soundData.id] = audio;
        }
    },

    play(id) {
        if (this.mode === "mute") return;
        const sound = this.sounds[id];
        if (sound) {
            sound.currentTime = 0;
            sound.play();
        } else {
            console.warn("Zvuk nije pronađen:", id);
        }
    },

    stop(id) {
        const sound = this.sounds[id];
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    },

    setVolume(id, value) {
        const sound = this.sounds[id];
        if (sound) {
            sound.volume = value;
        }
    },

    setMode(mode) {
        let newMode=mode;
        for (let x in Sound) {
            const soundData = Sound[x];
            const sound = this.sounds[soundData.id];
            if (sound) {
                if(newMode==="half")
                {
                    sound.volume=0.3;
                    this.volumeIcon.classList.replace("fa-volume-up", "fa-volume-down");
                }
                else if(newMode==="mute")
                {
                    sound.volume=0;
                    this.volumeIcon.classList.replace("fa-volume-down", "fa-volume-off");
                }
                else{
                    sound.volume=soundData.volume;
                    this.volumeIcon.classList.replace("fa-volume-off", "fa-volume-up");
                    if(soundData.id=='gif')
                        sound.play();
                }
                this.mode=newMode;
            }
        }
    },
    toggleMode() {
        if (this.mode === "on") {
            this.setMode("half");
        } else if (this.mode === "half") {
            this.setMode("mute");
        } else {
            this.setMode("on");
        }
    }
};


