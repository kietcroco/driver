if (typeof process === 'undefined') process = {};
process.nextTick = setImmediate;

if (typeof process.env === 'undefined') {
    process.env = {};
}

if (typeof process.argv === 'undefined') {
    process.argv = [];
}
this.process = process;
module.exports = process;