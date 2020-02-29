/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let NoStandAloneAt;
module.exports = (NoStandAloneAt = (function() {
    NoStandAloneAt = class NoStandAloneAt {
        static initClass() {
    
            this.prototype.rule = {
                name: 'no_stand_alone_at',
                level: 'ignore',
                message: '@ must not be used stand alone',
                description: `\
This rule checks that no stand alone @ are in use, they are
discouraged. Further information in CoffeeScript issue <a
href="https://github.com/jashkenas/coffee-script/issues/1601">
#1601</a>\
`
            };
    
            this.prototype.tokens = ['@'];
        }

        lintToken(token, tokenApi) {
            let needle;
            const [nextToken] = Array.from(tokenApi.peek());
            const noSpace = !token.spaced;
            // TODO: after <1.10.0 is not supported, remove 'IDENTIFIER' here
            const isProp = ['IDENTIFIER', 'PROPERTY'].includes(nextToken);
            const isAStart = ['INDEX_START', 'CALL_START'].includes(nextToken); // @[] or @()
            const isDot = nextToken === '.';

            // https://github.com/jashkenas/coffee-script/issues/1601
            // @::foo is valid, but @:: behaves inconsistently and is planned for
            // removal. Technically @:: is a stand alone ::, but I think it makes
            // sense to group it into no_stand_alone_at
            //
            // TODO: after v1.10.0 is not supported, remove 'IDENTIFIER' here
            const isProtoProp = (nextToken === '::') &&
                (needle = __guard__(tokenApi.peek(2), x => x[0]), ['IDENTIFIER', 'PROPERTY'].includes(needle));

            // Return an error after an '@' token unless:
            // 1: there is a '.' afterwards (isDot)
            // 2: there isn't a space after the '@' and the token following the '@'
            // is an property, the start of an index '[' or is an property after
            // the '::'
            if (!isDot && (!noSpace || (!isProp && !isAStart && !isProtoProp))) {
                return true;
            }
        }
    };
    NoStandAloneAt.initClass();
    return NoStandAloneAt;
})());

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}