/* eslint-disable
    class-methods-use-this,
    func-names,
    no-multi-assign,
    no-shadow,
    no-underscore-dangle,
    no-unused-vars,
    no-use-before-define,
    no-useless-escape,
    prefer-rest-params,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let NoUnnecessaryDoubleQuotes;
module.exports = (NoUnnecessaryDoubleQuotes = (function () {
    NoUnnecessaryDoubleQuotes = class NoUnnecessaryDoubleQuotes {
        static initClass() {
            this.prototype.rule = {
                name: 'no_unnecessary_double_quotes',
                level: 'ignore',
                message: 'Unnecessary double quotes are forbidden',
                description: `\
This rule prohibits double quotes unless string interpolation is
used or the string contains single quotes.
<pre>
<code># Double quotes are discouraged:
foo = "bar"
    
# Unless string interpolation is used:
foo = "#{bar}baz"
    
# Or they prevent cumbersome escaping:
foo = "I'm just following the 'rules'"
</code>
</pre>
Double quotes are permitted by default.\
`,
            };

            this.prototype.tokens = ['STRING', 'STRING_START', 'STRING_END'];
        }

        constructor() {
            this.regexps = [];
            this.interpolationLevel = 0;
        }

        lintToken(token, tokenApi) {
            const [type, tokenValue] = Array.from(token);

            if (['STRING_START', 'STRING_END'].includes(type)) {
                return this.trackParens(...arguments);
            }

            const stringValue = tokenValue.match(/^\"(.*)\"$/);

            if (!stringValue) { return false; } // no double quotes, all OK

            // When CoffeeScript generates calls to RegExp it double quotes the 2nd
            // parameter. Using peek(2) becuase the peek(1) would be a CALL_END
            if (__guard__(tokenApi.peek(2), (x) => x[0]) === 'REGEX_END') {
                return false;
            }

            const hasLegalConstructs = this.isInInterpolation() || this.hasSingleQuote(tokenValue);
            return !hasLegalConstructs;
        }

        isInInterpolation() {
            return this.interpolationLevel > 0;
        }

        trackParens(token, tokenApi) {
            if (token[0] === 'STRING_START') {
                this.interpolationLevel += 1;
            } else if (token[0] === 'STRING_END') {
                this.interpolationLevel -= 1;
            }
            // We're not linting, just tracking interpolations.
            return null;
        }

        hasSingleQuote(tokenValue) {
            return tokenValue.indexOf("'") !== -1;
        }
    };
    NoUnnecessaryDoubleQuotes.initClass();
    return NoUnnecessaryDoubleQuotes;
}()));

function __guard__(value, transform) {
    return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
