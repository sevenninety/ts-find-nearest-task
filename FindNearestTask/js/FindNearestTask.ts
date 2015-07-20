/// <reference path="dojo.d.ts" />
/// <reference path="arcgis-js-api.d.ts" />

import Deferred = require("dojo/Deferred");
import array = require("dojo/_base/array");
import Point = require("esri/geometry/Point");
import Geometry = require("esri/geometry/Geometry");
import FeatureSet = require("esri/tasks/FeatureSet");
import mathUtils = require("esri/geometry/mathUtils");
import Graphic = require("esri/graphic");

import FindNearestTaskOptions = require("./FindNearestTaskOptions");
import FindNearestTaskParams = require("./FindNearestTaskParams");
import Candidate = require("./Candidate");
import Mode = require("./DistanceMode");
import PathPoint = require("./PathPoint");

class FindNearestTask {
    private _maxFeatures: number;
    private _mode: Mode;

    constructor(options: FindNearestTaskOptions) {
        this._maxFeatures = options.maxFeatures || 10;
        this._mode = options.mode || Mode.Planar;
    }

    execute(params: FindNearestTaskParams): dojo.promise.Promise {
        var deferred = new Deferred();

        try {
            deferred.resolve(this._getNearestResult(params.point, params.featureSet));
        } catch (err) {
            deferred.reject(err, true);
        }

        return deferred.promise;
    }

    private _getNearestResult(point: Point, featureSet: FeatureSet) {
        var features: Graphic[] = featureSet.features;
        var distance = this._mode == Mode.Geodesic ? this._greatCircleDistance : this._euclidianDistance;
        var candidates: Array<Candidate> = new Array<Candidate>();
        var geometry;
        var result;

        // Supported in 10.1 or greater
        if (featureSet.exceededTransferLimit && featureSet.exceededTransferLimit === true) {
            console.warn("Feature limit reached, the result may not be accurate.");
        }

        // Calculate distance for each feature
        if (featureSet.geometryType === "esriGeometryPoint") {
            features.forEach(function (feature: Graphic) {
                candidates.push(new Candidate(
                    <Point> feature.geometry,
                    feature,
                    distance(point, <Point> feature.geometry)
                    ));
            });

            result = this._getMin(candidates);
        } else if (featureSet.geometryType === "esriGeometryPolygon") {
            features.forEach(function (feature) {
                geometry = feature.geometry;

                geometry.rings.forEach(function (ring) {
                    candidates.push(this._getNearest(point, feature, ring));
                });
            });

            result = this._getMin(candidates);
        } else if (featureSet.geometryType === "esriGeometryPolyline") {
            features.forEach(function (feature) {
                geometry = feature.geometry;

                geometry.paths.forEach(function (path) {
                    candidates.push(this._getNearest(point, feature, path));
                });
            });

            result = this._getMin(candidates);
        } else {
            // Not supported
            result = null;
        }

        return result;
    }

    private _getMin(candidates: Array<Candidate>): Candidate[] {
        var comparator = this._comparator;

        // Sort the features
        candidates.sort(comparator);

        // Return the first 'n' features
        return candidates.slice(0, this._maxFeatures);
    }

    private _getNearest(point: Point, parentFeature: Graphic, path: Number[]): Candidate {
        var pathPoints = path.map(function (item) {
            return new PathPoint(item[0], item[1]);
        });

        var fromPoint: PathPoint;
        var toPoint: PathPoint;
        var a: number;
        var b: number;
        var distance: number;
        var minDistance: number;
        var from: number;
        var to: number;
        var i: number;
        var x: number;
        var y: number;
        var dx: number;
        var dy: number;

        if (pathPoints.length > 1) {
            for (var n: number = 1, len: number = pathPoints.length; n < len; n++) {
                // Get segment from points
                fromPoint = pathPoints[n - 1];
                toPoint = pathPoints[n];

                if (toPoint.x !== fromPoint.x) {
                    a = (toPoint.y - fromPoint.y) / (toPoint.x - fromPoint.x);
                    b = toPoint.y - a * toPoint.x;
                    distance = Math.abs(a * point.x + b - point.y) / Math.sqrt(a * a + 1);
                } else {
                    distance = Math.abs(point.x - toPoint.x);
                }

                // Length squared of the line segment 
                var length2: number = Math.pow(toPoint.y - fromPoint.y, 2) + Math.pow(toPoint.x - fromPoint.x, 2);
                
                // Distance squared of point to the start of the line segment
                var toStart2: number = Math.pow(fromPoint.y - point.y, 2) + Math.pow(fromPoint.x - point.x, 2);
                
                // Distance squared of point to end of the line segment
                var toEnd2: number = Math.pow(toPoint.y - point.y, 2) + Math.pow(toPoint.x - point.x, 2);
                
                // Minimum distance squared of the point to the infinite line
                var distance2: number = Math.pow(distance, 2);
                
                // Calculated length squared of the line segment
                var calcLength2: number = toEnd2 - distance2 + toStart2 - distance2;

                // Redefine minimum distance to line segment (not infinite line) if necessary
                if (calcLength2 > length2) {
                    distance = Math.sqrt(Math.min(toEnd2, toStart2));
                }

                if (minDistance > distance) {
                    if (calcLength2 > length2) {
                        if (toStart2 < toEnd2) {
                            to = 0; // Nearer to previous point
                            from = 1;
                        } else {
                            from = 0; // Nearer to current point
                            to = 1;
                        }
                    } else {
                        // perpendicular from point intersects line segment
                        to = ((Math.sqrt(toStart2 - distance2)) / Math.sqrt(length2));
                        from = ((Math.sqrt(toEnd2 - distance2)) / Math.sqrt(length2));
                    }

                    minDistance = distance;
                    i = n;
                }

                // Calculate coordinates
                dx = pathPoints[i - 1].x - pathPoints[i].x;
                dy = pathPoints[i - 1].y - pathPoints[i].y;
                x = pathPoints[i - 1].x - (dx * to);
                y = pathPoints[i - 1].y - (dy * to);
            }
        }

        // Return feature
        return new Candidate(new Point(x, y, point.spatialReference), parentFeature, minDistance);
    }

    private _euclidianDistance(p1: Point, p2: Point): number {
        return mathUtils.getLength(p1, p2);
    }

    private _greatCircleDistance(p1: Point, p2: Point): number {
        // Haversine formula (http://www.movable-type.co.uk/scripts/latlong.html)
        var toRad = this._toRad,
            radius = 6371, // Earth's mean radius in km
            lat1 = toRad(p1.y),
            lon1 = toRad(p1.x),
            lat2 = toRad(p2.y),
            lon2 = toRad(p2.x),
            dLat = lat2 - lat1,
            dLon = lon2 - lon1,
            a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2),
            c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return radius * c; // Length in km			
    }

    private _toRad(value: number): number {
        return (value * Math.PI) / 180;
    }

    private _comparator(a, b): number {
        if (a.distance < b.distance) {
            return -1;
        }

        if (a.distance > b.distance) {
            return 1;
        }

        return 0;
    }
}

export = FindNearestTask;
