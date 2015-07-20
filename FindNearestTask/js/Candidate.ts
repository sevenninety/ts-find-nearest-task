import Point = require("esri/geometry/Point");
import Graphic = require("esri/graphic");

class Candidate {
    private _point: Point;
    private _feature: Graphic;
    private _distance: number;

    constructor(point: Point, feature: Graphic, distance: number) {
        this._point = point;
        this._feature = feature;
        this._distance = distance;
    }

    get point(): Point {
        return this._point;
    }

    set point(value: Point) {
        this._point = value;
    }

    get feature(): Graphic {
        return this._feature;
    }

    set feature(value: Graphic) {
        this._feature = value;
    }

    get distance(): number {
        return this._distance;
    }

    set distance(value: number) {
        this._distance = value;
    }
} 

export = Candidate;