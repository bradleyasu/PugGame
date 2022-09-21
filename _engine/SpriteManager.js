
class _SpriteManager {

    sprites = new Map();

    constructor() {
    }

    addSprite = (key, sprite) => {
        this.sprites.set(key, sprite);
    }

    getSprite = (key) => {
        console.log(this.sprites);
        return this.sprites.get(key);
    }
}

const SpriteManager = new _SpriteManager();
export default SpriteManager;