define(["require", "exports"], function (require, exports) {
    var FindNearestTaskOptions = (function () {
        function FindNearestTaskOptions() {
        }
        Object.defineProperty(FindNearestTaskOptions.prototype, "maxFeatures", {
            get: function () {
                return this._maxFeatures;
            },
            set: function (value) {
                this._maxFeatures = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FindNearestTaskOptions.prototype, "mode", {
            get: function () {
                return this._mode;
            },
            set: function (value) {
                this._mode = value;
            },
            enumerable: true,
            configurable: true
        });
        return FindNearestTaskOptions;
    })();
    return FindNearestTaskOptions;
});
//# sourceMappingURL=FindNearestTaskOptions.js.map