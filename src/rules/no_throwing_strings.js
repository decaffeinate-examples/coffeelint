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
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let NoThrowingStrings;
module.exports = (NoThrowingStrings = (function () {
    NoThrowingStrings = class NoThrowingStrings {
        static initClass() {
            this.prototype.rule = {
                name: 'no_throwing_strings',
                level: 'error',
                message: 'Throwing strings is forbidden',
                description: `\
This rule forbids throwing string literals or interpolations. While
JavaScript (and CoffeeScript by extension) allow any expression to
be thrown, it is best to only throw <a
href="https://developer.mozilla.org
/en/JavaScript/Reference/Global_Objects/Error"> Error</a> objects,
because they contain valuable debugging information like the stack
trace. Because of JavaScript's dynamic nature, CoffeeLint cannot
ensure you are always throwing instances of <tt>Error</tt>. It will
only catch the simple but real case of throwing literal strings.
<pre>
<code># CoffeeLint will catch this:
throw "i made a boo boo"
    
# ... but not this:
throw getSomeString()
</code>
</pre>
This rule is enabled by default.\
`,
            };

            this.prototype.tokens = ['THROW'];
        }

        lintToken(token, tokenApi) {
            const [n1] = Array.from(tokenApi.peek());
            // Catch literals and string interpolations, which are wrapped in parens.

            const nextIsString = (n1 === 'STRING') || (n1 === 'STRING_START');

            return nextIsString;
        }
    };
    NoThrowingStrings.initClass();
    return NoThrowingStrings;
}()));
