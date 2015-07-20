import Point = require("esri/geometry/Point");
import FeatureSet = require("esri/tasks/FeatureSet");

class FindNearestTaskParams {
    private _point: Point;
    private _featureSet: FeatureSet;

    get point(): Point {
        return this._point;
    }

    set point(value: Point) {
        this._point = value;
    }

    get featureSet(): FeatureSet {
        return this._featureSet;
    }

    set featureSet(value: FeatureSet) {
        this._featureSet = value;
    }
} 

export = FindNearestTaskParams;

