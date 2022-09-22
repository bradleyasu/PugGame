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
    obstacles = [];
    obstacle_count = 3;
    seed = Math.floor(Math.random() * (3 - 0) + 0);
    score = 0;
    
    constructor(canvas) {
        super(canvas);
        this.max_ticks = this.height;
        this.video.src = "./assets/intro.mp4";
        this.video.load();
        this.video.playsInline = true;
        this.sprite = new Sprite('./sprites/pug.png', new Dimension(80, 80), 12, 12);
        this.tiles = new Sprite('./sprites/tiles.png', new Dimension(128, 128), 12, 22);
        this.max_ticks = 10000;
        this._setup();
        this.bindKeys();
    }


    _setup = () => {
        const p = this;
        const r = this.seed;
        SpriteManager.addSprite(PUG, this.sprite);
        SpriteManager.addSprite('background', this.background);
        this.sprite.setRow(6, 12, 7);
        this.video.addEventListener('ended', () => p.intro_over = true);
        const rr = r * 3 + 1;
        this.tiles.setRow(rr, 3);
        this.background = new Sprite('./assets/bg_'+(r + 1)+'.png', new Dimension(1920, 1080));
        this.background.setRow(1,1);
        setInterval(() => {
            if(p.started) p.groundSpeed += 0.10;
        }, 10000);
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
                JUKEBOX.play('bgsound_'+(p.seed+1));
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

    _obstacle_generator = () => {
        if(this.obstacles.length >= this.obstacle_count) {
            return;
        }
        let offset = 0;
        while(this.obstacles.length < this.obstacle_count) {
            let min = this.width + offset;
            let max = min + this.width/4;
            let randomOffset = Math.floor(Math.random() * (max - min) + min);
            this.obstacles.push({
                tile: Math.floor(Math.random() * (13 - 10) + 10),
                x: randomOffset
            });
            offset = randomOffset + 200;
        }
    }

    render = () => {
        if(this.started && this.tick % 500 !== 0) {
            this._obstacle_generator();
        };
        this.pug_tick++;
        if(this.pug_tick > 1000) this.pug_tick = 1;
        this.ctx.fillStyle = "#00FF00";
        this.ctx.fillRect(0,0, this.width, this.height);
        if(this.is_jumping) {
            if (this.pug_y > 300) this.jump_desc = true;
            if(this.jump_desc && this.pug_y > 0) {
                this.pug_y--;
            } else {
                this.pug_y++;
            }
        }

        if (this.intro_over) {
            this.background.render(this.ctx, 0, 0, this.background.src.indexOf('_2') === -1 ? 1.5 : 1);
            if (this.is_jumping && this.pug_tick % 300 === 0 || !this.is_jumping && this.pug_tick  % 10 === 0) {
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
            const title = "chloe";
            const subTitle = "\"a pug's life\"";
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

        // obstacles
        for(let i in this.obstacles) {
            const ob = this.obstacles[i];
            if(ob) {
                this.tiles.column = ob.tile;
                this.tiles.render(this.ctx, ob.x, this.height - (this.tiles.dimension.height * 2));
                ob.x = ob.x - (1 * this.groundSpeed);
                this.obstacles = this.obstacles.filter(x => x.x > 0 - this.tiles.dimension.width);
            }
        }

        // score
        if (this.started && this.intro_over) {
            this.score++;
            this.ctx.fillStyle = "#ff284d";
            this.ctx.font = "20px GameFont";
            new ShadowText("SPEED: "+Math.round(this.groundSpeed*10)/10 + " MPH", 3).draw(this.ctx, 20, 50);
            new ShadowText("SCORE: "+this.score, 3).draw(this.ctx, 20, 90);
        }

        this._tick();
    }
}