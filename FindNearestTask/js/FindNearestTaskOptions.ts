import Mode = require("./DistanceMode");

class FindNearestTaskOptions {
    private _maxFeatures: number;
    private _mode: Mode;

    get maxFeatures(): number {
        return this._maxFeatures;
    }

    set maxFeatures(value: number) {
        this._maxFeatures = value;
    }

    get mode(): Mode {
        return this._mode;
    }

    set mode(value: Mode) {
        this._mode = value;
    }
} 

export = FindNearestTaskOptions;

