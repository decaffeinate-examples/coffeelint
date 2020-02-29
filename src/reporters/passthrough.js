/* eslint-disable
    class-methods-use-this,
    no-multi-assign,
    no-shadow,
    no-unused-vars,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
// this is used for testing... best not to actually use

let PassThroughReporter;
const RawReporter = require('./raw');

module.exports = (PassThroughReporter = class PassThroughReporter extends RawReporter {
    print(input) {
        return JSON.parse(input);
    }
});
