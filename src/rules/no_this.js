/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let NoThis;
module.exports = (NoThis = (function() {
    NoThis = class NoThis {
        static initClass() {
    
            this.prototype.rule = {
                name: 'no_this',
                level: 'ignore',
                message: "Don't use 'this', use '@' instead",
                description: `\
This rule prohibits 'this'.
Use '@' instead.\
`
            };
    
            this.prototype.tokens = ['THIS'];
        }

        lintToken(token, tokenApi) {
            const { config: { no_stand_alone_at: { level } } } = tokenApi;
            const nextToken = __guard__(tokenApi.peek(1), x => x[0]);

            if ((level === 'ignore') || (nextToken === '.')) { return true; }
        }
    };
    NoThis.initClass();
    return NoThis;
})());

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}