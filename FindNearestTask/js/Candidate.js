define(["require", "exports"], function (require, exports) {
    var Candidate = (function () {
        function Candidate(point, feature, distance) {
            this._point = point;
            this._feature = feature;
            this._distance = distance;
        }
        Object.defineProperty(Candidate.prototype, "point", {
            get: function () {
                return this._point;
            },
            set: function (value) {
                this._point = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Candidate.prototype, "feature", {
            get: function () {
                return this._feature;
            },
            set: function (value) {
                this._feature = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Candidate.prototype, "distance", {
            get: function () {
                return this._distance;
            },
            set: function (value) {
                this._distance = value;
            },
            enumerable: true,
            configurable: true
        });
        return Candidate;
    })();
    return Candidate;
});
//# sourceMappingURL=Candidate.js.map