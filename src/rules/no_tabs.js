/* eslint-disable
    class-methods-use-this,
    func-names,
    no-multi-assign,
    no-shadow,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let NoTabs;
const indentationRegex = /\S/;

module.exports = (NoTabs = (function () {
    NoTabs = class NoTabs {
        static initClass() {
            this.prototype.rule = {
                name: 'no_tabs',
                level: 'error',
                message: 'Line contains tab indentation',
                description: `\
This rule forbids tabs in indentation. Enough said. It is enabled by
default.\
`,
            };
        }

        lintLine(line, lineApi) {
            // Only check lines that have compiled tokens. This helps
            // us ignore tabs in the middle of multi line strings, heredocs, etc.
            // since they are all reduced to a single token whose line number
            // is the start of the expression.
            const indentation = line.split(indentationRegex)[0];
            if (lineApi.lineHasToken() && Array.from(indentation).includes('\t')) {
                return true;
            }
            return null;
        }
    };
    NoTabs.initClass();
    return NoTabs;
}()));
