
class _ScreenManager {

    screens = new Map();
    current = null;

    constructor() {}

    register = (key, screen) => {
        this.screens.set(key, screen);
        console.log(`Screen registered, ${key}`);
    }

    get = () => {
        if (!this.current) {
            this.current = this.screens.get('test');
        }
        return this.current;
    }

    render = () => {
        this.get().render();
    }
}

const ScreenManager = new _ScreenManager();
export default ScreenManager