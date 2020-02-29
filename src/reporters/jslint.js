/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let JSLintReporter;
module.exports = (JSLintReporter = class JSLintReporter {

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
        this.print('<?xml version="1.0" encoding="utf-8"?><jslint>');

        for (let path in this.errorReport.paths) {
            const errors = this.errorReport.paths[path];
            if (errors.length) {
                this.print(`<file name=\"${path}\">`);

                for (let e of Array.from(errors)) {
                    // continue if @quiet and e.level isnt 'error'

                    if (!this.quiet || (e.level === 'error')) {
                        this.print(`\
<issue line="${e.lineNumber}"
            lineEnd="${e.lineNumberEnd != null ? e.lineNumberEnd : e.lineNumber}"
            reason="[${this.escape(e.level)}] ${this.escape(e.message)}"
            evidence="${this.escape(e.context)}"/>\
`
                        );
                    }
                }
                this.print('</file>');
            }
        }

        return this.print('</jslint>');
    }

    escape(msg) {
        // Force msg to be a String
        msg = '' + msg;
        if (!msg) {
            return;
        }
        // Perhaps some other HTML Special Chars should be added here
        // But this are the XML Special Chars listed in Wikipedia
        const replacements = [
            [/&/g, '&amp;'],
            [/"/g, '&quot;'],
            [/</g, '&lt;'],
            [/>/g, '&gt;'],
            [/'/g, '&apos;']
        ];

        for (let r of Array.from(replacements)) {
            msg = msg.replace(r[0], r[1]);
        }

        return msg;
    }
});
