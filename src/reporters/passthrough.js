// this is used for testing... best not to actually use

let PassThroughReporter;
const RawReporter = require('./raw');

module.exports = (PassThroughReporter = class PassThroughReporter extends RawReporter {
    print(input) {
        return JSON.parse(input);
    }
});
