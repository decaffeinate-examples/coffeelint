/* eslint-disable
    consistent-return,
    func-names,
    no-constant-condition,
    no-multi-assign,
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
let NoImplicitParens;
module.exports = (NoImplicitParens = (function () {
    NoImplicitParens = class NoImplicitParens {
        static initClass() {
            this.prototype.rule = {
                name: 'no_implicit_parens',
                level: 'ignore',
                message: 'Implicit parens are forbidden',
                strict: true,
                description: `\
This rule prohibits implicit parens on function calls.
<pre>
<code># Some folks don't like this style of coding.
myFunction a, b, c
    
# And would rather it always be written like this:
myFunction(a, b, c)
</code>
</pre>
Implicit parens are permitted by default, since their use is
idiomatic CoffeeScript.\
`,
            };


            this.prototype.tokens = ['CALL_END'];
        }

        lintToken(token, tokenApi) {
            if (token.generated) {
                if (tokenApi.config[this.rule.name].strict !== false) {
                    return true;
                }
                // If strict mode is turned off it allows implicit parens when
                // the expression is spread over multiple lines.
                let i = -1;
                while (true) {
                    const t = tokenApi.peek(i);
                    const sameLine = t[2].first_line === token[2].first_line;
                    const genCallStart = (t[0] === 'CALL_START') && t.generated;

                    if ((t == null) || (genCallStart && sameLine)) {
                        return true;
                    }

                    // If we have not found a CALL_START token that is generated,
                    // and we've moved into a new line, this is fine and should
                    // just return.
                    if (!sameLine) {
                        return null;
                    }

                    i -= 1;
                }
            }
        }
    };
    NoImplicitParens.initClass();
    return NoImplicitParens;
}()));
