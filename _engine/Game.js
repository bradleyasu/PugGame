import ScreenManager from './ScreenManager.js';
import Sample from './../sample_screen.js';
import JUKEBOX from './Jukebox.js';
const game = new Game("game-board");
let start = false;
let tick = 0;


function Game(canvasId) {
    const canvas = document.getElementById(canvasId);
    let ctx = canvas.getContext('2d');
    let thread = undefined;
    JUKEBOX.load('bgsound_1', './audio/bgsound_1.mp3');
    JUKEBOX.load('bgsound_2', './audio/bgsound_2.mp3');
    JUKEBOX.load('bgsound_3', './audio/bgsound_3.mp3');


    ScreenManager.register('test', new Sample(canvas));

    /**
     * Primary game runner/loop
     */
    const gameLoop = () => {
        ScreenManager.render();
        tick += 1;
    }


    const bindKeys = () => {
        document.addEventListener("keydown", function(event) {
            event.preventDefault();
            switch(event.keyCode) {
              case 32:
                break;
            }
            
          });
    }

    this.start = function() {
        console.log("Game Running....");
        if (!thread){ 
            thread = setInterval(gameLoop, 1);
            bindKeys();
        }
    }

}

setTimeout(() => game.start(), 1000);





