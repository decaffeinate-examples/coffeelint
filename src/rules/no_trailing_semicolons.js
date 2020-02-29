/* eslint-disable
    class-methods-use-this,
    consistent-return,
    func-names,
    max-len,
    no-multi-assign,
    no-plusplus,
    no-shadow,
    no-unused-vars,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS201: Simplify complex destructure assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let NoTrailingSemicolons;
const regexes = { trailingSemicolon: /;\r?$/ };

module.exports = (NoTrailingSemicolons = (function () {
    NoTrailingSemicolons = class NoTrailingSemicolons {
        static initClass() {
            this.prototype.rule = {
                name: 'no_trailing_semicolons',
                level: 'error',
                message: 'Line contains a trailing semicolon',
                description: `\
This rule prohibits trailing semicolons, since they are needless
cruft in CoffeeScript.
<pre>
<code># This semicolon is meaningful.
x = '1234'; console.log(x)
    
# This semicolon is redundant.
alert('end of line');
</code>
</pre>
Trailing semicolons are forbidden by default.\
`,
            };
        }

        lintLine(line, lineApi) {
            // The TERMINATOR token is extended through to the next token. As a
            // result a line with a comment DOES have a token: the TERMINATOR from
            // the last line of code.
            const lineTokens = lineApi.getLineTokens();
            const tokenLen = lineTokens.length;
            const stopTokens = ['TERMINATOR', 'HERECOMMENT'];

            if ((tokenLen === 1) && Array.from(stopTokens).includes(lineTokens[0][0])) {
                return;
            }

            let newLine = line;
            if ((tokenLen > 1) && (lineTokens[tokenLen - 1][0] === 'TERMINATOR')) {
                // `startPos` contains the end pos of the last non-TERMINATOR token
                // `endPos` contains the start position of the TERMINATOR token

                // if startPos and endPos arent equal, that probably means a comment
                // was sliced out of the tokenizer

                const startPos = lineTokens[tokenLen - 2][2].last_column + 1;
                const endPos = lineTokens[tokenLen - 1][2].first_column;
                if (startPos !== endPos) {
                    let startCounter = startPos;
                    while ((line[startCounter] !== '#') && (startCounter < line.length)) {
                        startCounter++;
                    }
                    newLine = line.substring(0, startCounter).replace(/\s*$/, '');
                }
            }

            const hasSemicolon = regexes.trailingSemicolon.test(newLine);
            const adjustedLength = Math.max(lineTokens.length, 1); const first = lineTokens.slice(0, adjustedLength - 1); const
                last = lineTokens[adjustedLength - 1];
            const hasNewLine = last && (last.newLine != null);
            // Don't throw errors when the contents of multiline strings,
            // regexes and the like end in ";"
            if (hasSemicolon && !hasNewLine && lineApi.lineHasToken()
                    && !(['STRING', 'IDENTIFIER', 'STRING_END'].includes(last[0]))) {
                return true;
            }
        }
    };
    NoTrailingSemicolons.initClass();
    return NoTrailingSemicolons;
}()));
