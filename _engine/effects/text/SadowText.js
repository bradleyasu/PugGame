export default class ShadowText {

    constructor(text, shadow = 10, shadowColor = "rgba(0,0,0,0.4)") {
        this.text = text;
        this.shadow = shadow;
        this.shadowColor = shadowColor;
    }

    draw = (ctx, cx, cy) => {
        const c = ctx.fillStyle;
        ctx.fillStyle = this.shadowColor;
        ctx.fillText(this.text, cx + this.shadow, cy + this.shadow);
        ctx.fillStyle = c;
        ctx.fillText(this.text, cx, cy);
    }
}