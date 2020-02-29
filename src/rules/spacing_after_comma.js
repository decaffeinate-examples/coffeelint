/* eslint-disable
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
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let SpacingAfterComma;
module.exports = (SpacingAfterComma = (function () {
    SpacingAfterComma = class SpacingAfterComma {
        static initClass() {
            this.prototype.rule = {
                name: 'spacing_after_comma',
                level: 'ignore',
                message: 'a space is required after commas',
                description: '\
This rule checks to make sure you have a space after commas.\
',
            };

            this.prototype.tokens = [',', 'REGEX_START', 'REGEX_END'];
        }

        constructor() {
            this.inRegex = false;
        }

        lintToken(token, tokenApi) {
            const [type] = Array.from(token);

            if (type === 'REGEX_START') {
                this.inRegex = true;
                return;
            }
            if (type === 'REGEX_END') {
                this.inRegex = false;
                return;
            }

            if (!token.spaced && !token.newLine && !token.generated
                    && !this.isRegexFlag(token, tokenApi)) {
                return true;
            }
        }

        // When generating a regex (///${whatever}///i) CoffeeScript generates tokens
        // for RegEx(whatever, "i") but doesn't bother to mark that comma as
        // generated or spaced. Looking 3 tokens ahead skips the STRING and CALL_END
        isRegexFlag(token, tokenApi) {
            if (!this.inRegex) { return false; }

            const maybeEnd = tokenApi.peek(3);
            return (maybeEnd != null ? maybeEnd[0] : undefined) === 'REGEX_END';
        }
    };
    SpacingAfterComma.initClass();
    return SpacingAfterComma;
}()));
