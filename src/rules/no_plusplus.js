/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let NoPlusPlus;
module.exports = (NoPlusPlus = (function() {
    NoPlusPlus = class NoPlusPlus {
        static initClass() {
    
            this.prototype.rule = {
                name: 'no_plusplus',
                level: 'ignore',
                message: 'The increment and decrement operators are forbidden',
                description: `\
This rule forbids the increment and decrement arithmetic operators.
Some people believe the <tt>++</tt> and <tt>--</tt> to be cryptic
and the cause of bugs due to misunderstandings of their precedence
rules.
This rule is disabled by default.\
`
            };
    
            this.prototype.tokens = ['++', '--'];
        }

        lintToken(token, tokenApi) {
            return { context: `found '${token[0]}'` };
        }
    };
    NoPlusPlus.initClass();
    return NoPlusPlus;
})());
