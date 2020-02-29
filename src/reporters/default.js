/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Reports errors to the command line.
let Reporter;
module.exports = (Reporter = class Reporter {

    constructor(errorReport, options) {
        this.errorReport = errorReport;
        if (options == null) { options = {}; }
        ({
            colorize: this.colorize,
            quiet: this.quiet
        } = options);
        this.ok = '✓';
        this.warn = '⚡';
        this.err = '✗';
    }

    stylize(message, ...styles) {
        if (!this.colorize) { return message; }
        const map = {
            bold: [1,  22],
            yellow: [33, 39],
            green: [32, 39],
            red: [31, 39]
        };
        return styles.reduce((m, s) => '\u001b[' + map[s][0] + 'm' + m + '\u001b[' + map[s][1] + 'm'
        , message);
    }

    publish() {
        const {
            paths
        } = this.errorReport;

        let report  = '';
        for (let path in paths) { const errors = paths[path]; report += this.reportPath(path, errors); }
        report += this.reportSummary(this.errorReport.getSummary());
        report += '';

        if (!this.quiet || this.errorReport.hasError()) { this.print(report); }
        return this;
    }

    reportSummary(s) {
        const start = s.errorCount > 0 ?
            `${this.err} ${this.stylize('Lint!', 'red', 'bold')}`
        : s.warningCount > 0 ?
            `${this.warn} ${this.stylize('Warning!', 'yellow', 'bold')}`
        :
            `${this.ok} ${this.stylize('Ok!', 'green', 'bold')}`;
        const e = s.errorCount;
        const w = s.warningCount;
        const p = s.pathCount;
        const err = this.plural('error', e);
        const warn = this.plural('warning', w);
        const file = this.plural('file', p);
        const msg = `${start} » ${e} ${err} and ${w} ${warn} in ${p} ${file}`;
        return '\n' + this.stylize(msg) + '\n';
    }

    reportPath(path, errors) {
        let hasError, hasWarning;
        const [overall, color] = Array.from((hasError = this.errorReport.pathHasError(path)) ?
            [this.err, 'red']
        : (hasWarning = this.errorReport.pathHasWarning(path)) ?
            [this.warn, 'yellow']
        :
            [this.ok, 'green']);

        let pathReport = '';
        if (!this.quiet || hasError) {
            pathReport += `  ${overall} ${this.stylize(path, color, 'bold')}\n`;
        }

        for (let e of Array.from(errors)) {
            if (!this.quiet || (e.level === 'error')) {
                const o = e.level === 'error' ? this.err : this.warn;
                let lineEnd = '';
                if (e.lineNumberEnd != null) { lineEnd = `-${e.lineNumberEnd}`; }
                const output = '#' + e.lineNumber + lineEnd;

                pathReport += '     ' +
                    `${o} ${this.stylize(output, color)}: ${e.message}.`;
                if (e.context) { pathReport += ` ${e.context}.`; }
                pathReport += '\n';
            }
        }

        return pathReport;
    }

    print(message) {
        // coffeelint: disable=no_debugger
        return console.log(message);
    }
        // coffeelint: enable=no_debugger

    plural(str, count) {
        if (count === 1) { return str; } else { return `${str}s`; }
    }
});
