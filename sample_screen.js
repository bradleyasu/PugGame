import Screen from './_engine/Screen.js';
import JUKEBOX from './_engine/Jukebox.js';
import SpriteManager from './_engine/SpriteManager.js';
import Sprite from './_engine/Sprite.js';
import Dimension from './_engine/Dimension.js';
import {PUG} from './sprite_const.js';
import ShadowText from './_engine/effects/text/SadowText.js';

export default class Sample extends Screen {

    video = document.createElement("video");
    frame = null;
    is_jumping = false;
    jump_desc = false;
    intro_over = false;
    pug_y = 0; 
    groundSpeed = 0.40;
    started = false;
    pug_tick = 1;
    
    constructor(canvas) {
        super(canvas);
        this.max_ticks = this.height;
        this.video.src = "./assets/intro.mp4";
        this.video.load();
        this.video.playsInline = true;
        this.bindKeys();
        this.sprite = new Sprite('./sprites/pug.png', new Dimension(80, 80), 12, 12);
        this.tiles = new Sprite('./sprites/tiles.png', new Dimension(128, 128), 12, 22);
        this.background = new Sprite('./assets/bg_1.png', new Dimension(1920, 1080));
        this.max_ticks = 10000;
        this._setup();
    }


    _setup = () => {
        const p = this;
        SpriteManager.addSprite(PUG, this.sprite);
        SpriteManager.addSprite('background', this.background);
        this.sprite.setRow(6, 12, 7);
        this.background.setRow(1,1);
        this.video.addEventListener('ended', () => p.intro_over = true);
        this.tiles.setRow(4, 3);
    }


    bindKeys = () => {
        const p = this;
        this.canvas.addEventListener('click', (e) => {
            if(p.intro_over) {
                if (!p.is_jumping) {
                    p.pug_tick = 1; 
                    p.sprite.setRow(3, 2);
                    p.is_jumping = true;
                }
                if(!p.started) {
                    p.started = true;
                    p.sprite.setRow(3, 2);
                    p.is_jumping = true;
                }
            } else {
                p.video.play();
                JUKEBOX.play('sample');
            }
        });
        document.addEventListener("keydown", function(event) {
            event.preventDefault();
            switch(event.keyCode) {
              case 32:
                p.groundSpeed += 0.10;
                break;
            }
          });
    }

    render = () => {
        // if(this.tick % 10 !== 0) {
        //     this._tick();
        //     return;
        // };
        this.pug_tick++;
        if(this.pug_tick > 1000) this.pug_tick = 1;
        this.ctx.fillStyle = "#00FF00";
        this.ctx.fillRect(0,0, this.width, this.height);
        if(this.is_jumping) {
            if (this.pug_y > 140) this.jump_desc = true;
            if(this.jump_desc && this.pug_y > 0) {
                this.pug_y--;
            } else {
                this.pug_y++;
            }
        }

        if (this.intro_over) {
            this.background.render(this.ctx, 0, 0);
            if (this.is_jumping && this.pug_tick % 140 === 0 || !this.is_jumping && this.pug_tick  % 10 === 0) {
                this.sprite.next(() => {
                    this.is_jumping && this.sprite.setRow(6, 12, 7);
                    this.is_jumping = false;
                    this.jump_desc = false;
                    this.pug_y = 0;
                });
            }
            this.sprite.render(this.ctx, 300, this.height - 280 - this.pug_y, 2);
            let gx =(-1 * this.groundSpeed) * this.tick;
            while (gx < this.width) {
                this.tiles.column = 3;
                this.tiles.render(this.ctx, gx, this.height - this.tiles.dimension.height);
                gx += this.tiles.dimension.width;
            }
        } else {
            this.ctx.drawImage(this.video, 0, 0, this.width, this.height);
        }

        if (!this.started && this.intro_over) {
            this.ctx.fillStyle = "#ff284d";
            this.ctx.font = "80px GameFont";
            const title = "pug";
            const subTitle = "\"a day in the life\"";
            const startText = "TAP TO START / JUMP";
            const tsize = this.ctx.measureText(title);
            new ShadowText(title).draw(this.ctx, this.width / 2 - tsize.width/2, this.height / 2 - 250);
            this.ctx.font = "30px GameFont";
            const tssize = this.ctx.measureText(subTitle);
            new ShadowText(subTitle, 5).draw(this.ctx, this.width / 2 - tssize.width/2, this.height / 2 - 180);
            
            this.ctx.font = "20px GameFont";
            const sttSize = this.ctx.measureText(startText);
            new ShadowText(startText, 4).draw(this.ctx, this.width / 2 - sttSize.width/2, this.height / 2);
        }

        this._tick();
    }
}