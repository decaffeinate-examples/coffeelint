/* eslint-disable
    consistent-return,
    func-names,
    no-multi-assign,
    no-return-assign,
    no-shadow,
    no-unused-vars,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS201: Simplify complex destructure assignments
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let NoNestedStringInterpolation;
module.exports = (NoNestedStringInterpolation = (function () {
    NoNestedStringInterpolation = class NoNestedStringInterpolation {
        static initClass() {
            this.prototype.rule = {
                name: 'no_nested_string_interpolation',
                level: 'warn',
                message: 'Nested string interpolation is forbidden',
                description: `\
This rule warns about nested string interpolation,
as it tends to make code harder to read and understand.
<pre>
<code># Good!
str = "Book by #{firstName.toUpperCase()} #{lastName.toUpperCase()}"
    
# Bad!
str = "Book by #{"#{firstName} #{lastName}".toUpperCase()}"
</code>
</pre>\
`,
            };

            this.prototype.tokens = ['STRING_START', 'STRING_END'];
        }

        constructor() {
            this.startedStrings = 0;
            this.generatedError = false;
        }

        lintToken(...args) {
            const [type] = Array.from(args[0]); const
                tokenApi = args[1];
            if (type === 'STRING_START') {
                return this.trackStringStart();
            }
            return this.trackStringEnd();
        }

        trackStringStart() {
            this.startedStrings += 1;

            // Don't generate multiple errors for deeply nested string interpolation
            if ((this.startedStrings <= 1) || this.generatedError) { return; }

            this.generatedError = true;
            return true;
        }

        trackStringEnd() {
            this.startedStrings -= 1;
            if (this.startedStrings === 1) { return this.generatedError = false; }
        }
    };
    NoNestedStringInterpolation.initClass();
    return NoNestedStringInterpolation;
}()));
