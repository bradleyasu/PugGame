export default class Screen {

    tick = 0;
    max_ticks = 60;
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }


    render = () => {
        this.ctx.fillStyle = "#0000FF";
        this.ctx.fillRect(0,0, this.width, this.height);
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.font = '14px GameFont';
        this.ctx.fillText('Override render function for screen', 50+this.tick, 50+this.tick);
        this._tick();
    }

    _tick = () => {
        this.tick++;
        if (this.tick >= this.max_ticks) {
            this.tick = 0;
        }
    }
}