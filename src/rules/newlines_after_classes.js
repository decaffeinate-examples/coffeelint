/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let NewlinesAfterClasses;
module.exports = (NewlinesAfterClasses = (function() {
    NewlinesAfterClasses = class NewlinesAfterClasses {
        static initClass() {
    
            this.prototype.rule = {
                name: 'newlines_after_classes',
                value: 3,
                level: 'ignore',
                message: 'Wrong count of newlines between a class and other code',
                description: `\
<p>Checks the number of newlines between classes and other code.</p>
    
Options:
- <pre><code>value</code></pre> - The number of required newlines
after class definitions. Defaults to 3.\
`
            };
    
            this.prototype.tokens = ['CLASS', '}', '{'];
    
            this.prototype.classBracesCount = 0;
            this.prototype.classCount = 0;
        }

        lintToken(token, tokenApi) {
            const [type, numIndents, { first_line: lineNumber }] = Array.from(token);
            const { lines } = tokenApi;

            const ending = tokenApi.config[this.rule.name].value;
            if (type === 'CLASS') {
                this.classCount++;
            }

            if ((this.classCount > 0) && (token.generated != null)) {
                if ((type === '{') && ((token.origin != null ? token.origin[0] : undefined) === ':')) {
                    this.classBracesCount++;
                }

                if ((type === '}') && ((token.origin != null ? token.origin[0] : undefined) === 'OUTDENT')) {
                    this.classBracesCount--;
                    this.classCount--;
                    if ((this.classCount === 0) && (this.classBracesCount === 0)) {
                        let befores = 1;
                        let afters = 1;
                        let comment = 0;
                        const outdent = token.origin[2].first_line;
                        const start = Math.min(lineNumber, outdent);
                        let trueLine = Infinity;

                        while (/^\s*(#|$)/.test(lines[start + afters])) {
                            if (/^\s*#/.test(lines[start + afters])) {
                                comment += 1;
                            } else {
                                trueLine = Math.min(trueLine, start + afters);
                            }
                            afters += 1;
                        }

                        while (/^\s*(#|$)/.test(lines[start - befores])) {
                            if (/^\s*#/.test(lines[start - befores])) {
                                comment += 1;
                            } else {
                                trueLine = Math.min(trueLine, start - befores);
                            }
                            befores += 1;
                        }

                        // add up blank lines, subtract comments, subtract 2 because
                        // before/after counters started at 1.
                        const got = (afters + befores) - comment - 2;

                        // if `got` and `ending` don't match throw an error _unless_
                        // we are at the end of the file.
                        if ((got !== ending) && ((trueLine + ending) <= lines.length)) {
                            return {
                                context: `Expected ${ending} got ${got}`,
                                lineNumber: trueLine
                            };
                        }
                    }
                }
            }
        }
    };
    NewlinesAfterClasses.initClass();
    return NewlinesAfterClasses;
})());
