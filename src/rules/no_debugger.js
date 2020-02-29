/*
 * decaffeinate suggestions:
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let NoDebugger;
module.exports = (NoDebugger = (function() {
    NoDebugger = class NoDebugger {
        static initClass() {
    
            this.prototype.rule = {
                name: 'no_debugger',
                level: 'warn',
                message: 'Found debugging code',
                console: false,
                description: `\
This rule detects \`debugger\` and optionally \`console\` calls
This rule is \`warn\` by default.\
`
            };
    
            // TODO: after <1.10.0 is not supported, remove 'DEBUGGER' here
            this.prototype.tokens = ['STATEMENT', 'DEBUGGER', 'IDENTIFIER'];
        }

        lintToken(token, tokenApi) {
            if (['DEBUGGER', 'STATEMENT'].includes(token[0]) && (token[1] === 'debugger')) {
                return { context: `found '${token[0]}'` };
            }

            if (tokenApi.config[this.rule.name] != null ? tokenApi.config[this.rule.name].console : undefined) {
                if ((token[1] === 'console') && (__guard__(tokenApi.peek(1), x => x[0]) === '.')) {
                    const method = tokenApi.peek(2);
                    return { context: `found 'console.${method[1]}'` };
                }
            }
        }
    };
    NoDebugger.initClass();
    return NoDebugger;
})());

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}