define(["require", "exports"], function (require, exports) {
    var PathPoint = (function () {
        function PathPoint(x, y) {
            this._x = x;
            this._y = y;
        }
        Object.defineProperty(PathPoint.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (value) {
                this._x = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PathPoint.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (value) {
                this._y = value;
            },
            enumerable: true,
            configurable: true
        });
        return PathPoint;
    })();
    return PathPoint;
});
//# sourceMappingURL=PathPoint.js.map