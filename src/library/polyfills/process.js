module.exports = (function (scope) {

    if (typeof scope["process"] === 'undefined') scope["process"] = {};
    scope["process"].nextTick = scope["process"].nextTick || setImmediate;

    if (typeof scope["process"].env === 'undefined') {
        scope["process"].env = {};
    }

    if (typeof scope["process"].argv === 'undefined') {
        scope["process"].argv = [];
    }
    return scope["process"];
})(typeof process !== 'undefined' && {}.toString.call(process) === '[object process]' ? global : this);