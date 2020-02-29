/* eslint-disable
    consistent-return,
    func-names,
    max-len,
    no-multi-assign,
    no-multi-str,
    no-shadow,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let MaxLineLength;
const regexes = {
    literateComment: new RegExp('\
^\
\\#\\s\
'),
    longUrlComment: new RegExp('\
^\\s*\\#\
\\s*\
http[^\\s]+$\
'),
};

module.exports = (MaxLineLength = (function () {
    MaxLineLength = class MaxLineLength {
        static initClass() {
            this.prototype.rule = {
                name: 'max_line_length',
                value: 80,
                level: 'error',
                limitComments: true,
                message: 'Line exceeds maximum allowed length',
                description: `\
This rule imposes a maximum line length on your code. <a
href="http://www.python.org/dev/peps/pep-0008/">Python's style
guide</a> does a good job explaining why you might want to limit the
length of your lines, though this is a matter of taste.
    
Lines can be no longer than eighty characters by default.\
`,
            };
        }

        lintLine(line, lineApi) {
            const max = lineApi.config[this.rule.name] != null ? lineApi.config[this.rule.name].value : undefined;
            const limitComments = lineApi.config[this.rule.name] != null ? lineApi.config[this.rule.name].limitComments : undefined;

            let lineLength = line.replace(/\s+$/, '').length;
            if (lineApi.isLiterate() && regexes.literateComment.test(line)) {
                lineLength -= 2;
            }

            if (max && (max < lineLength) && !regexes.longUrlComment.test(line)) {
                if (!limitComments) {
                    if (lineApi.getLineTokens().length === 0) {
                        return;
                    }
                }

                return {
                    context: `Length is ${lineLength}, max is ${max}`,
                };
            }
        }
    };
    MaxLineLength.initClass();
    return MaxLineLength;
}()));
