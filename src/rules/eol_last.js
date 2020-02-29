/* eslint-disable
    class-methods-use-this,
    consistent-return,
    func-names,
    no-multi-assign,
    no-multi-str,
    no-shadow,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let EOLLast;
module.exports = (EOLLast = (function () {
    EOLLast = class EOLLast {
        static initClass() {
            this.prototype.rule = {
                name: 'eol_last',
                level: 'ignore',
                message: 'File does not end with a single newline',
                description: '\
Checks that the file ends with a single newline\
',
            };
        }

        lintLine(line, lineApi) {
            if (!lineApi.isLastLine()) { return null; }

            const isNewline = line.length === 0;

            const previousIsNewline = lineApi.lineCount > 1
                ? lineApi.lines[lineApi.lineNumber - 1].length === 0
                : false;

            if (!isNewline || !!previousIsNewline) { return true; }
        }
    };
    EOLLast.initClass();
    return EOLLast;
}()));
