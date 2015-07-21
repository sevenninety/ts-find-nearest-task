define(["require", "exports", "dojo/Deferred", "esri/geometry/Point", "esri/geometry/mathUtils", "./Candidate", "./DistanceMode", "./PathPoint"], function (require, exports, Deferred, Point, mathUtils, Candidate, Mode, PathPoint) {
    var FindNearestTask = (function () {
        function FindNearestTask(options) {
            this._maxFeatures = options.maxFeatures || 10;
            this._mode = options.mode || 0 /* Planar */;
        }
        FindNearestTask.prototype.execute = function (params) {
            var deferred = new Deferred();
            try {
                deferred.resolve(this._getNearestResult(params.point, params.featureSet));
            }
            catch (err) {
                deferred.reject(err, true);
            }
            return deferred.promise;
        };
        FindNearestTask.prototype._getNearestResult = function (point, featureSet) {
            var features = featureSet.features;
            var distance = this._mode == 1 /* Geodesic */ ? this._geodesicDistance : this._planarDistance;
            var candidates = new Array();
            var geometry;
            var result;
            if (featureSet.exceededTransferLimit && featureSet.exceededTransferLimit === true) {
                console.warn("Feature limit reached, the result may not be accurate.");
            }
            if (featureSet.geometryType === "esriGeometryPoint") {
                features.forEach(function (feature) {
                    candidates.push(new Candidate(feature.geometry, feature, distance(point, feature.geometry)));
                });
                result = this._getMin(candidates);
            }
            else if (featureSet.geometryType === "esriGeometryPolygon") {
                features.forEach(function (feature) {
                    geometry = feature.geometry;
                    geometry.rings.forEach(function (ring) {
                        candidates.push(this._getNearest(point, feature, ring));
                    });
                });
                result = this._getMin(candidates);
            }
            else if (featureSet.geometryType === "esriGeometryPolyline") {
                features.forEach(function (feature) {
                    geometry = feature.geometry;
                    geometry.paths.forEach(function (path) {
                        candidates.push(this._getNearest(point, feature, path));
                    });
                });
                result = this._getMin(candidates);
            }
            else {
                result = null;
            }
            return result;
        };
        FindNearestTask.prototype._getMin = function (candidates) {
            var comparator = this._comparator;
            candidates.sort(comparator);
            return candidates.slice(0, this._maxFeatures);
        };
        FindNearestTask.prototype._getNearest = function (point, parentFeature, path) {
            var pathPoints = path.map(function (item) {
                return new PathPoint(item[0], item[1]);
            });
            var fromPoint;
            var toPoint;
            var a;
            var b;
            var distance;
            var minDistance;
            var from;
            var to;
            var i;
            var x;
            var y;
            var dx;
            var dy;
            if (pathPoints.length > 1) {
                for (var n = 1, len = pathPoints.length; n < len; n++) {
                    fromPoint = pathPoints[n - 1];
                    toPoint = pathPoints[n];
                    if (toPoint.x !== fromPoint.x) {
                        a = (toPoint.y - fromPoint.y) / (toPoint.x - fromPoint.x);
                        b = toPoint.y - a * toPoint.x;
                        distance = Math.abs(a * point.x + b - point.y) / Math.sqrt(a * a + 1);
                    }
                    else {
                        distance = Math.abs(point.x - toPoint.x);
                    }
                    var length2 = Math.pow(toPoint.y - fromPoint.y, 2) + Math.pow(toPoint.x - fromPoint.x, 2);
                    var toStart2 = Math.pow(fromPoint.y - point.y, 2) + Math.pow(fromPoint.x - point.x, 2);
                    var toEnd2 = Math.pow(toPoint.y - point.y, 2) + Math.pow(toPoint.x - point.x, 2);
                    var distance2 = Math.pow(distance, 2);
                    var calcLength2 = toEnd2 - distance2 + toStart2 - distance2;
                    if (calcLength2 > length2) {
                        distance = Math.sqrt(Math.min(toEnd2, toStart2));
                    }
                    if (minDistance > distance) {
                        if (calcLength2 > length2) {
                            if (toStart2 < toEnd2) {
                                to = 0;
                                from = 1;
                            }
                            else {
                                from = 0;
                                to = 1;
                            }
                        }
                        else {
                            to = ((Math.sqrt(toStart2 - distance2)) / Math.sqrt(length2));
                            from = ((Math.sqrt(toEnd2 - distance2)) / Math.sqrt(length2));
                        }
                        minDistance = distance;
                        i = n;
                    }
                    dx = pathPoints[i - 1].x - pathPoints[i].x;
                    dy = pathPoints[i - 1].y - pathPoints[i].y;
                    x = pathPoints[i - 1].x - (dx * to);
                    y = pathPoints[i - 1].y - (dy * to);
                }
            }
            return new Candidate(new Point(x, y, point.spatialReference), parentFeature, minDistance);
        };
        FindNearestTask.prototype._planarDistance = function (p1, p2) {
            return mathUtils.getLength(p1, p2);
        };
        FindNearestTask.prototype._geodesicDistance = function (p1, p2) {
            var toRad = this._toRad, radius = 6371, lat1 = toRad(p1.y), lon1 = toRad(p1.x), lat2 = toRad(p2.y), lon2 = toRad(p2.x), dLat = lat2 - lat1, dLon = lon2 - lon1, a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2), c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return radius * c;
        };
        FindNearestTask.prototype._toRad = function (value) {
            return (value * Math.PI) / 180;
        };
        FindNearestTask.prototype._comparator = function (a, b) {
            if (a.distance < b.distance) {
                return -1;
            }
            if (a.distance > b.distance) {
                return 1;
            }
            return 0;
        };
        return FindNearestTask;
    })();
    return FindNearestTask;
});
//# sourceMappingURL=FindNearestTask.js.map