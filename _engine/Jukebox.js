
class Jukebox {

    AUDIO_TYPES = { TRACK: 0, SOUND_EFFECT: 1};

    tracks = new Map();
    soundeffects = new Map();

    trackPlayer = new Audio('');
    soundeffectPlayer = new Audio('');

    playingTrack = '';
    playingSE = '';

    constructor() {

    }


    play = (key, loop = true) => {
        if (this.soundeffects.has(key)) {
            if(this.playingSE === key) return;
            this._load_and_play(this.soundeffectPlayer, this.soundeffects.get(key), loop);
            this.playingSE = key;
        } else if (this.tracks.has(key)) {
            if(this.playingTrack === key) return;
            this._load_and_play(this.trackPlayer, this.tracks.get(key), loop);
            this.playingTrack = key;
        } else {
            throw Error("Could not load audio.  Not a known track or sound effect, ", key);
        }
    }

    stop = (type = this.AUDIO_TYPES.TRACK) => {
        switch(type) {
            case this.AUDIO_TYPES.TRACK:
                this.trackPlayer.pause();
                this.trackPlayer.currentTime = 0;
                break;
            case this.AUDIO_TYPES.SOUND_EFFECT:
                this.soundeffectPlayer.pause();
                this.soundeffectPlayer.currentTime = 0;
                break;
        }
    }

    _load_and_play = (_audioObj, src, loop = true) => {
        _audioObj.src = src;
        _audioObj.load();
        _audioObj.currentTime = 0;
        _audioObj.play();
        _audioObj.loop = loop;
    }

    load = (key, src, type = this.AUDIO_TYPES.TRACK) => {
        switch(type) {
            case this.AUDIO_TYPES.TRACK:
                this.tracks.set(key, src);
                break;
            case this.AUDIO_TYPES.SOUND_EFFECT:
                this.soundeffects.set(key, src);
                break;
            default:
                throw Error("Cannot load source file for unknown Audio Type: ", type);
        }
    }
}

const JUKEBOX = new Jukebox();
export default JUKEBOX;