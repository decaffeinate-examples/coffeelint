/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let TransformMessesUpLineNumbers;
module.exports = (TransformMessesUpLineNumbers = (function() {
    TransformMessesUpLineNumbers = class TransformMessesUpLineNumbers {
        static initClass() {
    
            this.prototype.rule = {
                name: 'transform_messes_up_line_numbers',
                level: 'warn',
                message: 'Transforming source messes up line numbers',
                description: `\
This rule detects when changes are made by transform function,
and warns that line numbers are probably incorrect.\
`
            };
    
            this.prototype.tokens = [];
        }

        lintToken(token, tokenApi) {}
    };
    TransformMessesUpLineNumbers.initClass();
    return TransformMessesUpLineNumbers;
})());
        // implemented before the tokens are created, using the entire source.
