
export default class Sprite {

    // Current sprite row
    row = 1;
    // Current sprite column
    column = 1;

    // Maximum number of rows available in sheet (calculated)
    rowMax = 1;

    //Maximum number of columns available in sheet (calculated)
    columnMax = 1;
    columnMin = 1;
    defaultMax = 1;
    defaultMin = 1;

    constructor(spriteSrc, dimension, sheetRows = 1, sheetColumns = 1) {
        this.dimension = dimension;
        this.sheet = new Image();
        this.sheet.src = spriteSrc;
        this.sheet.onload = this.ready();
        this.columnMax = sheetColumns;
        this.defaultMax = sheetColumns;
        this.rowMax = sheetRows;
    }

    /**
     * Sprite sheet has been loaded and ready for
     * rendering
     */
    ready = () => {
        this.columnMax = this.sheet.width / this.dimension.width;
        this.rowMax = this.sheet.height /this.dimension.height;
    }

    next = (on_reset = () => {}) => {
        this.column += 1;
        if (this.column > this.columnMax){
            this.column = this.columnMin;
            on_reset();
        } 
        return this;
    }

    render = (ctx, x = 20, y = 20, scale = 1) => {
        const sx = ((this.column -1) * this.dimension.width) + this.dimension.spacing + this.dimension.border;
        const sy = ((this.row - 1) * this.dimension.height) + this.dimension.spacing + this.dimension.border;
        ctx.drawImage(this.sheet, sx, sy, this.dimension.width, this.dimension.height, x, y, this.dimension.width * scale, this.dimension.height * scale);
    }

    /**
     * 
     * @param {*} row Index of row on sheet, 1 as min.  Column will be reset to index 1 as well.
     * @param {*} colMax Defaults to whatever was set in the instantiation unless otherwise specified
     * @returns 
     */
    setRow = (row, colMax = -1, colMin = -1) => {
        this.columnMax = colMax === -1 ? this.defaultMax : colMax;
        this.columnMin = colMin === -1 ? this.defaultMin : colMin;
        this.row = row;
        this.column = this.columnMin;
        if (this.row > this.rowMax) this.row = 1;
        if (this.row < 1) this.row = this.rowMax;
        return this;
    }

}