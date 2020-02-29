/* eslint-disable
    class-methods-use-this,
    consistent-return,
    func-names,
    no-multi-assign,
    no-multi-str,
    no-param-reassign,
    no-restricted-syntax,
    no-shadow,
    no-unused-vars,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let SpaceOperators;
module.exports = (SpaceOperators = (function () {
    SpaceOperators = class SpaceOperators {
        static initClass() {
            this.prototype.rule = {
                name: 'space_operators',
                level: 'ignore',
                message: 'Operators must be spaced properly',
                description: '\
This rule enforces that operators have spaces around them.\
',
            };

            this.prototype.tokens = ['+', '-', '=', '**', 'MATH', 'COMPARE',
                '&', '^', '|', '&&', '||', 'COMPOUND_ASSIGN',
                'STRING_START', 'STRING_END', 'CALL_START', 'CALL_END',
            ];
        }

        constructor() {
            this.callTokens = []; // A stack tracking the call token pairs.
            this.parenTokens = []; // A stack tracking the parens token pairs.
            this.interpolationLevel = 0;
        }

        lintToken(token, tokenApi) {
            const [type, ...rest] = Array.from(token);
            // These just keep track of state
            if (['CALL_START', 'CALL_END'].includes(type)) {
                this.trackCall(token, tokenApi);
                return;
            }

            if (['STRING_START', 'STRING_END'].includes(type)) {
                return this.trackParens(token, tokenApi);
            }

            // These may return errors
            if (['+', '-'].includes(type)) {
                return this.lintPlus(token, tokenApi);
            }
            return this.lintMath(token, tokenApi);
        }

        lintPlus(token, tokenApi) {
            // We can't check this inside of interpolations right now, because the
            // plusses used for the string type co-ercion are marked not spaced.
            if (this.isInInterpolation() || this.isInExtendedRegex()) {
                return null;
            }

            const p = tokenApi.peek(-1);

            const unaries = ['TERMINATOR', '(', '=', '-', '+', ',', 'CALL_START',
                'INDEX_START', '..', '...', 'COMPARE', 'IF', 'THROW',
                '&', '^', '|', '&&', '||', 'POST_IF', ':', '[', 'INDENT',
                'COMPOUND_ASSIGN', 'RETURN', 'MATH', 'BY', 'LEADING_WHEN'];

            const isUnary = !p ? false : Array.from(unaries).includes(p[0]);
            const notFirstToken = (p || (token.spaced != null) || token.newLine);
            if (notFirstToken && ((isUnary && (token.spaced != null))
                    || (!isUnary && !token.newLine
                    && (!token.spaced || (p && !p.spaced))))) {
                return { context: token[1] };
            }
            return null;
        }

        lintMath(token, tokenApi) {
            const p = tokenApi.peek(-1);
            if (!token.newLine && (!token.spaced || (p && !p.spaced))) {
                return { context: token[1] };
            }
            return null;
        }

        isInExtendedRegex() {
            for (const t of Array.from(this.callTokens)) {
                if (t.isRegex) { return true; }
            }
            return false;
        }

        isInInterpolation() {
            return this.interpolationLevel > 0;
        }

        trackCall(token, tokenApi) {
            if (token[0] === 'CALL_START') {
                const p = tokenApi.peek(-1);
                // Track regex calls, to know (approximately) if we're in an
                // extended regex.
                token.isRegex = p && (p[0] === 'IDENTIFIER') && (p[1] === 'RegExp');
                this.callTokens.push(token);
            } else {
                this.callTokens.pop();
            }
            return null;
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
    };
    SpaceOperators.initClass();
    return SpaceOperators;
}()));
