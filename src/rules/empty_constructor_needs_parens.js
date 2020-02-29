/* eslint-disable
    class-methods-use-this,
    consistent-return,
    func-names,
    no-constant-condition,
    no-continue,
    no-multi-assign,
    no-multi-str,
    no-plusplus,
    no-shadow,
    no-underscore-dangle,
    no-use-before-define,
    no-var,
    vars-on-top,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let EmptyConstructorNeedsParens;
module.exports = (EmptyConstructorNeedsParens = (function () {
    EmptyConstructorNeedsParens = class EmptyConstructorNeedsParens {
        static initClass() {
            this.prototype.rule = {
                name: 'empty_constructor_needs_parens',
                level: 'ignore',
                message: 'Invoking a constructor without parens and without arguments',
                description: '\
Requires constructors with no parameters to include the parens\
',
            };

            this.prototype.tokens = ['UNARY'];
        }

        // Return an error if the given indentation token is not correct.
        lintToken(token, tokenApi) {
            if (token[1] === 'new') {
                let isIdent; let
                    nextToken;
                const peek = tokenApi.peek.bind(tokenApi);
                // Find the last chained identifier, e.g. Bar in new foo.bar.Bar().
                let identIndex = 1;
                while (true) {
                    var needle;
                    isIdent = (needle = __guard__(peek(identIndex), (x) => x[0]), ['IDENTIFIER', 'PROPERTY'].includes(needle));
                    nextToken = peek(identIndex + 1);
                    if (isIdent) {
                        if ((nextToken != null ? nextToken[0] : undefined) === '.') {
                            // skip the dot and start with the next token
                            identIndex += 2;
                            continue;
                        }
                        if ((nextToken != null ? nextToken[0] : undefined) === 'INDEX_START') {
                            while (__guard__(peek(identIndex), (x1) => x1[0]) !== 'INDEX_END') {
                                identIndex++;
                            }
                            continue;
                        }
                    }

                    break;
                }

                // The callStart is generated if your parameters are all on the same
                // line with implicit parens, and if your parameters start on the
                // next line, but is missing if there are no params and no parens.
                if (isIdent && (nextToken != null)) {
                    return this.handleExpectedCallStart(nextToken);
                }
            }
        }

        handleExpectedCallStart(isCallStart) {
            if (isCallStart[0] !== 'CALL_START') {
                return true;
            }
        }
    };
    EmptyConstructorNeedsParens.initClass();
    return EmptyConstructorNeedsParens;
}()));

function __guard__(value, transform) {
    return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
