/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let ArrowSpacing;
module.exports = (ArrowSpacing = (function() {
    ArrowSpacing = class ArrowSpacing {
        static initClass() {
    
            this.prototype.rule = {
                name: 'arrow_spacing',
                level: 'ignore',
                message: 'Function arrows (-> and =>) must be spaced properly',
                description: `\
<p>This rule checks to see that there is spacing before and after
the arrow operator that declares a function. This rule is disabled
by default.</p> <p>Note that if arrow_spacing is enabled, and you
pass an empty function as a parameter, arrow_spacing will accept
either a space or no space in-between the arrow operator and the
parenthesis</p>
<pre><code># Both of this will not trigger an error,
# even with arrow_spacing enabled.
x(-> 3)
x( -> 3)
    
# However, this will trigger an error
x((a,b)-> 3)
</code>
</pre>\
`
            };
    
            this.prototype.tokens = ['->', '=>'];
        }

        lintToken(token, tokenApi) {
            // Throw error unless the following happens.
            //
            // We will take a look at the previous token to see
            // 1. That the token is properly spaced
            // 2. Wasn't generated by the CoffeeScript compiler
            // 3. That it is just indentation
            // 4. If the function declaration has no parameters
            // e.g. x(-> 3)
            //      x( -> 3)
            //
            // or a statement is wrapped in parentheses
            // e.g. (-> true)()
            //
            // we will accept either having a space or not having a space there.
            //
            // Also if the -> is the beginning of the file, then simply just return

            const pp = tokenApi.peek(-1);

            if (!pp) { return; }

            // Ignore empty functions
            if (!token.spaced &&
                    (tokenApi.peek(1)[0] === 'INDENT') &&
                    (tokenApi.peek(2)[0] === 'OUTDENT')) {
                return null;
            } else if (((token.spaced == null) && (token.newLine == null)) ||
                   // Throw error unless the previous token...
                   (((pp.spaced == null) && (pp[0] !== 'TERMINATOR')) && //1
                    (pp.generated == null) && //2
                    (pp[0] !== 'INDENT') && //3
                    ((pp[1] !== '(') || !(pp.generated == null)))) { //4
                return true;
            } else {
                return null;
            }
        }
    };
    ArrowSpacing.initClass();
    return ArrowSpacing;
})());
