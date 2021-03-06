/* eslint-disable
    class-methods-use-this,
    guard-for-in,
    no-console,
    no-multi-assign,
    no-param-reassign,
    no-restricted-syntax,
    no-shadow,
    no-unused-vars,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let RawReporter;
module.exports = (RawReporter = class RawReporter {
    constructor(errorReport, options) {
        this.errorReport = errorReport;
        if (options == null) { options = {}; }
        ({ quiet: this.quiet } = options);
    }

    print(message) {
        // coffeelint: disable=no_debugger
        return console.log(message);
    }
    // coffeelint: enable=no_debugger

    publish() {
        const er = {};
        for (const path in this.errorReport.paths) {
            const errors = this.errorReport.paths[path];
            er[path] = (Array.from(errors).filter((e) => !this.quiet || (e.level === 'error')));
        }

        return this.print(JSON.stringify(er, undefined, 2));
    }
});
