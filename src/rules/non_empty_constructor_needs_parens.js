/* eslint-disable
    class-methods-use-this,
    consistent-return,
    func-names,
    no-multi-assign,
    no-multi-str,
    no-shadow,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let NonEmptyConstructorNeedsParens;
const ParentClass = require('./empty_constructor_needs_parens');

module.exports = (NonEmptyConstructorNeedsParens = (function () {
    NonEmptyConstructorNeedsParens = class NonEmptyConstructorNeedsParens extends ParentClass {
        static initClass() {
            this.prototype.rule = {
                name: 'non_empty_constructor_needs_parens',
                level: 'ignore',
                message: 'Invoking a constructor without parens and with arguments',
                description: '\
Requires constructors with parameters to include the parens\
',
            };
        }

        handleExpectedCallStart(isCallStart) {
            if ((isCallStart[0] === 'CALL_START') && isCallStart.generated) {
                return true;
            }
        }
    };
    NonEmptyConstructorNeedsParens.initClass();
    return NonEmptyConstructorNeedsParens;
}()));
