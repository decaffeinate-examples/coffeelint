/*
 * decaffeinate suggestions:
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let LineEndings;
module.exports = (LineEndings = (function() {
    LineEndings = class LineEndings {
        static initClass() {
    
            this.prototype.rule = {
                name: 'line_endings',
                level: 'ignore',
                value: 'unix', // or 'windows'
                message: 'Line contains incorrect line endings',
                description: `\
This rule ensures your project uses only <tt>windows</tt> or
<tt>unix</tt> line endings. This rule is disabled by default.\
`
            };
        }

        lintLine(line, lineApi) {
            const ending = lineApi.config[this.rule.name] != null ? lineApi.config[this.rule.name].value : undefined;

            if (!ending || lineApi.isLastLine() || !line) { return null; }

            const lastChar = line[line.length - 1];
            const valid = (() => {
                if (ending === 'windows') {
                return lastChar === '\r';
            } else if (ending === 'unix') {
                return lastChar !== '\r';
            } else {
                throw new Error(`unknown line ending type: ${ending}`);
            }
            })();
            if (!valid) {
                return { context: `Expected ${ending}` };
            } else {
                return null;
            }
        }
    };
    LineEndings.initClass();
    return LineEndings;
})());
