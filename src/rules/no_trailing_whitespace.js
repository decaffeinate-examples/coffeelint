/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let NoTrailingWhitespace;
const regexes = {
    trailingWhitespace: /[^\s]+[\t ]+\r?$/,
    onlySpaces: /^[\t ]+\r?$/,
    lineHasComment: /^\s*[^\#]*\#/
};

module.exports = (NoTrailingWhitespace = (function() {
    NoTrailingWhitespace = class NoTrailingWhitespace {
        static initClass() {
    
            this.prototype.rule = {
                name: 'no_trailing_whitespace',
                level: 'error',
                message: 'Line ends with trailing whitespace',
                allowed_in_comments: false,
                allowed_in_empty_lines: true,
                description: `\
This rule forbids trailing whitespace in your code, since it is
needless cruft. It is enabled by default.\
`
            };
        }

        lintLine(line, lineApi) {
            if (!(lineApi.config['no_trailing_whitespace'] != null ? lineApi.config['no_trailing_whitespace'].allowed_in_empty_lines : undefined)) {
                if (regexes.onlySpaces.test(line)) {
                    return true;
                }
            }

            if (regexes.trailingWhitespace.test(line)) {
                // By default only the regex above is needed.
                if (!(lineApi.config['no_trailing_whitespace'] != null ? lineApi.config['no_trailing_whitespace'].allowed_in_comments : undefined)) {
                    return true;
                }

                line = line;
                const tokens = lineApi.tokensByLine[lineApi.lineNumber];

                // If we're in a block comment there won't be any tokens on this
                // line. Some previous line holds the token spanning multiple lines.
                if (!tokens) {
                    return null;
                }

                // To avoid confusion when a string might contain a "#", every string
                // on this line will be removed. before checking for a comment
                for (let str of Array.from((Array.from(tokens).filter((token) => token[0] === 'STRING').map((token) => token[1])))) {
                    line = line.replace(str, 'STRING');
                }

                if (!regexes.lineHasComment.test(line)) {
                    return true;
                }
            }
        }
    };
    NoTrailingWhitespace.initClass();
    return NoTrailingWhitespace;
})());
