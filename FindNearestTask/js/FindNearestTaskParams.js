define(["require", "exports"], function (require, exports) {
    var FindNearestTaskParams = (function () {
        function FindNearestTaskParams() {
        }
        Object.defineProperty(FindNearestTaskParams.prototype, "point", {
            get: function () {
                return this._point;
            },
            set: function (value) {
                this._point = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FindNearestTaskParams.prototype, "featureSet", {
            get: function () {
                return this._featureSet;
            },
            set: function (value) {
                this._featureSet = value;
            },
            enumerable: true,
            configurable: true
        });
        return FindNearestTaskParams;
    })();
    return FindNearestTaskParams;
});
//# sourceMappingURL=FindNearestTaskParams.js.map