/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let CheckstyleReporter;
const JsLintReporter = require('./jslint');

module.exports = (CheckstyleReporter = (function() {
    CheckstyleReporter = class CheckstyleReporter {
        static initClass() {
                // coffeelint: enable=no_debugger
    
            this.prototype.escape = JsLintReporter.prototype.escape;
        }

        constructor(errorReport, options) {
            this.errorReport = errorReport;
            if (options == null) { options = {}; }
            ({ quiet: this.quiet } = options);
        }

        print(message) {
            // coffeelint: disable=no_debugger
            return console.log(message);
        }

        publish() {
            this.print('<?xml version="1.0" encoding="utf-8"?>');
            this.print('<checkstyle version="4.3">');

            for (let path in this.errorReport.paths) {
                const errors = this.errorReport.paths[path];
                if (errors.length) {
                    this.print(`<file name=\"${path}\">`);

                    for (let e of Array.from(errors)) {
                        if (!this.quiet || (e.level === 'error')) {
                            let {
                                level
                            } = e;
                            if (level === 'warn') { level = 'warning'; }

                            // context is optional, this avoids generating the string
                            // "context: undefined"
                            const context = e.context != null ? e.context : '';
                            this.print(`\
<error line="${e.lineNumber}"
        severity="${this.escape(level)}"
        message="${this.escape(e.message+'; context: '+context)}"
        source="coffeelint"/>\
`
                            );
                        }
                    }
                    this.print('</file>');
                }
            }

            return this.print('</checkstyle>');
        }
    };
    CheckstyleReporter.initClass();
    return CheckstyleReporter;
})());
