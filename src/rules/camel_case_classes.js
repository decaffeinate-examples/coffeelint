/*
 * decaffeinate suggestions:
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let CamelCaseClasses;
const regexes =
    {camelCase: /^[A-Z_][a-zA-Z\d]*$/};

module.exports = (CamelCaseClasses = (function() {
    CamelCaseClasses = class CamelCaseClasses {
        static initClass() {
    
            this.prototype.rule = {
                name: 'camel_case_classes',
                level: 'error',
                message: 'Class name should be UpperCamelCased',
                description: `\
This rule mandates that all class names are UpperCamelCased.
Camel casing class names is a generally accepted way of
distinguishing constructor functions - which require the 'new'
prefix to behave properly - from plain old functions.
<pre>
<code># Good!
class BoaConstrictor
    
# Bad!
class boaConstrictor
</code>
</pre>
This rule is enabled by default.\
`
            };
    
            this.prototype.tokens = ['CLASS'];
        }

        lintToken(token, tokenApi) {
            // TODO: you can do some crazy shit in CoffeeScript, like
            // class func().ClassName. Don't allow that.

            // Don't try to lint the names of anonymous classes.
            let needle;
            if ((token.newLine != null) || (needle = tokenApi.peek()[0], ['INDENT', 'EXTENDS'].includes(needle))) {
                return null;
            }

            // It's common to assign a class to a global namespace, e.g.
            // exports.MyClassName, so loop through the next tokens until
            // we find the real identifier.
            let className = null;
            let offset = 1;
            while (!className) {
                if (__guard__(tokenApi.peek(offset + 1), x => x[0]) === '.') {
                    offset += 2;
                } else if (__guard__(tokenApi.peek(offset), x1 => x1[0]) === '@') {
                    offset += 1;
                } else {
                    className = tokenApi.peek(offset)[1];
                }
            }

            // Now check for the error.
            if (!regexes.camelCase.test(className)) {
                return { context: `class name: ${className}` };
            }
        }
    };
    CamelCaseClasses.initClass();
    return CamelCaseClasses;
})());

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}