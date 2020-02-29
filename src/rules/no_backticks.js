/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let NoBackticks;
module.exports = (NoBackticks = (function() {
    NoBackticks = class NoBackticks {
        static initClass() {
    
            this.prototype.rule = {
                name: 'no_backticks',
                level: 'error',
                message: 'Backticks are forbidden',
                description: `\
Backticks allow snippets of JavaScript to be embedded in
CoffeeScript. While some folks consider backticks useful in a few
niche circumstances, they should be avoided because so none of
JavaScript's "bad parts", like <tt>with</tt> and <tt>eval</tt>,
sneak into CoffeeScript.
This rule is enabled by default.\
`
            };
    
            this.prototype.tokens = ['JS'];
        }

        lintToken(token, tokenApi) {
            return (token.comments == null);
        }
    };
    NoBackticks.initClass();
    return NoBackticks;
})());
