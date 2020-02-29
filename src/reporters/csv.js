/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let CSVReporter;
module.exports = (CSVReporter = class CSVReporter {

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
        const header = ['path', 'lineNumber', 'lineNumberEnd', 'level', 'message'];
        this.print(header.join(','));
        return (() => {
            const result = [];
            for (var path in this.errorReport.paths) {
                var errors = this.errorReport.paths[path];
                result.push((() => {
                    const result1 = [];
                    for (let e of Array.from(errors)) {
                    // Having the context is useful for the cyclomatic_complexity
                    // rule and critical for the undefined_variables rule.
                        if (!this.quiet || (e.level === 'error')) {
                            if (e.context) { e.message += ` ${e.context}.`; }
                            const f = [
                                path,
                                e.lineNumber,
                                e.lineNumberEnd != null ? e.lineNumberEnd : e.lineNumberEnd,
                                e.level,
                                e.message
                            ];
                            result1.push(this.print(f.join(',')));
                        }
                    }
                    return result1;
                })());
            }
            return result;
        })();
    }
});
