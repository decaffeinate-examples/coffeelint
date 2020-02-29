/* eslint-disable
    camelcase,
    consistent-return,
    func-names,
    no-multi-assign,
    no-shadow,
    no-underscore-dangle,
    no-use-before-define,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let PreferEnglishOperator;
module.exports = (PreferEnglishOperator = (function () {
    PreferEnglishOperator = class PreferEnglishOperator {
        static initClass() {
            this.prototype.rule = {
                name: 'prefer_english_operator',
                level: 'ignore',
                message: 'Don\'t use &&, ||, ==, !=, or !',
                doubleNotLevel: 'ignore',
                description: `\
This rule prohibits &&, ||, ==, != and !.
Use and, or, is, isnt, and not instead.
!! for converting to a boolean is ignored.\
`,
            };

            this.prototype.tokens = ['COMPARE', 'UNARY_MATH', '&&', '||'];
        }

        lintToken(token, tokenApi) {
            let level;
            const config = tokenApi.config[this.rule.name];
            ({
                level,
            } = config);
            // Compare the actual token with the lexed token.
            const { first_column, last_column } = token[2];
            const line = tokenApi.lines[tokenApi.lineNumber];
            const actual_token = line.slice(first_column, +last_column + 1 || undefined);
            const context = (() => {
                switch (actual_token) {
                case '==': return 'Replace "==" with "is"';
                case '!=': return 'Replace "!=" with "isnt"';
                case '||': return 'Replace "||" with "or"';
                case '&&': return 'Replace "&&" with "and"';
                case '!':
                // `not not expression` seems awkward, so `!!expression`
                // gets special handling.
                    if (__guard__(tokenApi.peek(1), (x) => x[0]) === 'UNARY_MATH') {
                        level = config.doubleNotLevel;
                        return '"?" is usually better than "!!"';
                    } if (__guard__(tokenApi.peek(-1), (x1) => x1[0]) === 'UNARY_MATH') {
                    // Ignore the 2nd half of the double not
                        return undefined;
                    }
                    return 'Replace "!" with "not"';

                default: return undefined;
                }
            })();

            if (context != null) {
                return { level, context };
            }
        }
    };
    PreferEnglishOperator.initClass();
    return PreferEnglishOperator;
}()));

function __guard__(value, transform) {
    return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
