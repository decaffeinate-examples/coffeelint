/* eslint-disable
    consistent-return,
    func-names,
    max-len,
    no-cond-assign,
    no-multi-assign,
    no-plusplus,
    no-sequences,
    no-shadow,
    no-underscore-dangle,
    no-unused-vars,
    prefer-destructuring,
    prefer-rest-params,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS104: Avoid inline assignments
 * DS201: Simplify complex destructure assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let NoImplicitBraces;
module.exports = (NoImplicitBraces = (function () {
    NoImplicitBraces = class NoImplicitBraces {
        static initClass() {
            this.prototype.rule = {
                name: 'no_implicit_braces',
                level: 'ignore',
                message: 'Implicit braces are forbidden',
                strict: true,
                description: `\
This rule prohibits implicit braces when declaring object literals.
Implicit braces can make code more difficult to understand,
especially when used in combination with optional parenthesis.
<pre>
<code># Do you find this code ambiguous? Is it a
# function call with three arguments or four?
myFunction a, b, 1:2, 3:4
    
# While the same code written in a more
# explicit manner has no ambiguity.
myFunction(a, b, {1:2, 3:4})
</code>
</pre>
Implicit braces are permitted by default, since their use is
idiomatic CoffeeScript.\
`,
            };

            this.prototype.tokens = [
                '{', 'OUTDENT', 'INDENT', 'CLASS',
                'IDENTIFIER', 'PROPERTY', 'EXTENDS',
            ];
            this.prototype.dent = 0;
        }

        constructor() {
            this.isClass = false;
            this.className = '';
        }

        lintToken(token, tokenApi) {
            let c;
            const [type, val, lineNum] = Array.from(token);
            if (['OUTDENT', 'INDENT', 'CLASS'].includes(type)) {
                return this.trackClass(...arguments);
            }

            // reset "className" if class uses EXTENDS keyword
            if (type === 'EXTENDS') {
                this.className = '';
                return;
            }

            // If we're looking at an IDENTIFIER, and we're in a class, and we've not
            // set a className (or the previous non-identifier was 'EXTENDS', set the
            // current identifier as the class name)
            if (['IDENTIFIER', 'PROPERTY'].includes(type) && this.isClass && (this.className === '')) {
                // Backtrack to get the full classname
                let needle;
                c = 0;
                while ((needle = tokenApi.peek(c)[0], ['IDENTIFIER', 'PROPERTY', '.'].includes(needle))) {
                    this.className += tokenApi.peek(c)[1];
                    c++;
                }
            }

            if (token.generated && (type === '{')) {
                // If strict mode is set to false it allows implicit braces when the
                // object is declared over multiple lines.
                let prevToken;
                if (!tokenApi.config[this.rule.name].strict) {
                    [prevToken] = Array.from(tokenApi.peek(-1));
                    if (['INDENT', 'TERMINATOR'].includes(prevToken)) {
                        return;
                    }
                }

                if (this.isClass) {
                    // The way CoffeeScript generates tokens for classes
                    // is a bit weird. It generates '{' tokens around instance
                    // methods (also known as the prototypes of an Object).

                    let _type; let _val; let
                        ref;
                    [prevToken] = Array.from(tokenApi.peek(-1));
                    // If there is a TERMINATOR token right before the '{' token
                    if (prevToken === 'TERMINATOR') {
                        return;
                    }

                    let peekIdent = '';
                    c = -2;
                    // Go back until you grab all the tokens with IDENTIFIER,
                    // PROPERTY or '.'
                    while ([_type, _val] = Array.from(ref = tokenApi.peek(c)), ref) {
                        if (!['IDENTIFIER', 'PROPERTY', '.'].includes(_type)) { break; }
                        peekIdent = _val + peekIdent;
                        c--;
                    }

                    if (peekIdent === this.className) {
                        return;
                    }
                }

                return true;
            }
        }

        trackClass(token, tokenApi) {
            const array = [token, tokenApi.peek()]; const array1 = array[0]; const n0 = array1[0]; const ln = array1[array1.length - 1]; const
                [n1] = Array.from(array[1]);

            if (n0 === 'INDENT') { this.dent++; }
            if (n0 === 'OUTDENT') { this.dent--; }

            if ((this.dent === 0) && (n0 === 'OUTDENT') && (n1 === 'TERMINATOR')) {
                this.isClass = false;
            }
            if (n0 === 'CLASS') {
                this.isClass = true;
                this.className = '';
            }
            return null;
        }
    };
    NoImplicitBraces.initClass();
    return NoImplicitBraces;
}()));
