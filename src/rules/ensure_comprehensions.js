/* eslint-disable
    consistent-return,
    func-names,
    no-cond-assign,
    no-multi-assign,
    no-multi-str,
    no-plusplus,
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
let EnsureComprehensions;
module.exports = (EnsureComprehensions = (function () {
    EnsureComprehensions = class EnsureComprehensions {
        static initClass() {
            this.prototype.rule = {
                name: 'ensure_comprehensions',
                level: 'warn',
                message: 'Comprehensions must have parentheses around them',
                description: '\
This rule makes sure that parentheses are around comprehensions.\
',
            };

            this.prototype.tokens = ['FOR'];

            this.prototype.forBlock = false;
        }

        lintToken(token, tokenApi) {
            // Rules
            // Ignore if normal for-loop with a block
            // If LHS of operation contains either the key or value variable of
            //     the loop, assume that it is not a comprehension.

            // Find all identifiers (including lhs values and parts of for loop)
            let prevToken;
            const idents = this.findIdents(tokenApi);

            // if it looks like a for block, don't bother checking
            if (this.forBlock) {
                this.forBlock = false;
                return;
            }

            let peeker = -1;
            let atEqual = false;
            let numCallEnds = 0;
            let numCallStarts = 0;
            let numParenStarts = 0;
            let numParenEnds = 0;
            const prevIdents = [];

            while (prevToken = tokenApi.peek(peeker)) {
                if (prevToken[0] === 'CALL_END') { numCallEnds++; }
                if (prevToken[0] === 'CALL_START') { numCallStarts++; }

                if (prevToken[0] === '(') { numParenStarts++; }
                if (prevToken[0] === ')') { numParenEnds++; }

                if (prevToken[0] === 'IDENTIFIER') {
                    if (!atEqual) {
                        prevIdents.push(prevToken[1]);
                    } else if (Array.from(idents).includes(prevToken[1])) {
                        return;
                    }
                }

                if (['(', '->', 'TERMINATOR'].includes(prevToken[0]) || (prevToken.newLine != null)) {
                    break;
                }

                if ((prevToken[0] === '=') && (numParenEnds === numParenStarts)) {
                    atEqual = true;
                }

                peeker--;
            }

            // If we hit a terminal node (TERMINATOR token or w/ property newLine)
            // or if we hit the top of the file and we've seen an '=' sign without
            // any identifiers that are part of the for-loop, and there is an equal
            // amount of CALL_START/CALL_END tokens. An unequal number means the list
            // comprehension is inside of a function call
            if (atEqual && (numCallStarts === numCallEnds)) {
                return { context: '' };
            }
        }

        findIdents(tokenApi) {
            let nextToken;
            let peeker = 1;
            const idents = [];

            while (nextToken = tokenApi.peek(peeker)) {
                if (nextToken[0] === 'IDENTIFIER') {
                    idents.push(nextToken[1]);
                }
                if (['FORIN', 'FOROF'].includes(nextToken[0])) {
                    break;
                }
                peeker++;
            }

            // now search ahead to see if this becomes a FOR block
            while (nextToken = tokenApi.peek(peeker)) {
                if (nextToken[0] === 'TERMINATOR') {
                    break;
                }
                if (nextToken[0] === 'INDENT') {
                    this.forBlock = true;
                    break;
                }
                peeker++;
            }

            return idents;
        }
    };
    EnsureComprehensions.initClass();
    return EnsureComprehensions;
}()));
