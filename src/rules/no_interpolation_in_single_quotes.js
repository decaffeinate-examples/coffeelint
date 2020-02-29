/* eslint-disable
    class-methods-use-this,
    func-names,
    no-multi-assign,
    no-shadow,
    no-unused-vars,
    no-useless-escape,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let NoInterpolationInSingleQuotes;
module.exports = (NoInterpolationInSingleQuotes = (function () {
    NoInterpolationInSingleQuotes = class NoInterpolationInSingleQuotes {
        static initClass() {
            this.prototype.rule = {
                name: 'no_interpolation_in_single_quotes',
                level: 'ignore',
                message: 'Interpolation in single quoted strings is forbidden',
                description: `\
This rule prohibits string interpolation in a single quoted string.
<pre>
<code># String interpolation in single quotes is not allowed:
foo = '#{bar}'
    
# Double quotes is OK of course
foo = "#{bar}"
</code>
</pre>
String interpolation in single quoted strings is permitted by
default.\
`,
            };

            this.prototype.tokens = ['STRING'];
        }

        lintToken(token, tokenApi) {
            const tokenValue = token[1];
            const hasInterpolation = tokenValue.match(/^\'.*#\{[^}]+\}.*\'$/);
            return hasInterpolation;
        }
    };
    NoInterpolationInSingleQuotes.initClass();
    return NoInterpolationInSingleQuotes;
}()));
