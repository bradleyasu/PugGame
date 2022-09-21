import Screen from './_engine/Screen.js';
import JUKEBOX from './_engine/Jukebox.js';
import SpriteManager from './_engine/SpriteManager.js';
import Sprite from './_engine/Sprite.js';
import Dimension from './_engine/Dimension.js';
import {PUG} from './sprite_const.js';

export default class Sample extends Screen {

    video = document.createElement("video");
    frame = null;
    is_jumping = false;


    constructor(canvas) {
        super(canvas);
        this.max_ticks = this.height;
        this.video.src = "./assets/intro.mp4";
        this.video.load();
        this.bindKeys();
        this.sprite = new Sprite('./sprites/pug.png', new Dimension(80, 80), 12, 12);
        this._setup();
    }


    _setup = () => {
        SpriteManager.addSprite(PUG, this.sprite);
        this.sprite.setRow(10, 12);
    }


    bindKeys = () => {
        const p = this;
        this.canvas.addEventListener('click', (e) => {
            p.video.play();
            JUKEBOX.play('sample');
        });
        document.addEventListener("keydown", function(event) {
            event.preventDefault();
            switch(event.keyCode) {
              case 32:
                if (!p.is_jumping) {
                    p.sprite.setRow(3, 3);
                    p.is_jumping = true;
                }
                break;
            }
            
          });
    }

    render = () => {
        if(this.tick % 10 !== 0) {
            this._tick();
            return;
        };
        this.max_ticks = 10000;
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0,0, this.width, this.height);
        this.ctx.drawImage(this.video, 0, 0, this.width, this.height);
        if (this.is_jumping && this.tick % 250 === 0 || !this.is_jumping && this.tick % 10 === 0) {
            this.sprite.next(() => {
                this.is_jumping && this.sprite.setRow(10, 12);
                this.is_jumping = false;
            });
        }
        this.sprite.render(this.ctx, 300, this.height - 300, 2);
        this._tick();
    }
}