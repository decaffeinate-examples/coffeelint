/* eslint-disable
    consistent-return,
    func-names,
    no-multi-assign,
    no-multi-str,
    no-shadow,
    no-unused-vars,
    prefer-rest-params,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS201: Simplify complex destructure assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let DuplicateKey;
module.exports = (DuplicateKey = (function () {
    DuplicateKey = class DuplicateKey {
        static initClass() {
            this.prototype.rule = {
                // I don't know of any legitimate reason to define duplicate keys in an
                // object. It seems to always be a mistake, it's also a syntax error in
                // strict mode.
                // See http://jslinterrors.com/duplicate-key-a/
                name: 'duplicate_key',
                level: 'error',
                message: 'Duplicate key defined in object or class',
                description: '\
Prevents defining duplicate keys in object literals and classes\
',
            };

            // TODO: after <1.10.0 is not supported, remove 'IDENTIFIER' here
            this.prototype.tokens = ['IDENTIFIER', 'PROPERTY', '{', '}'];
        }

        constructor() {
            this.braceScopes = []; // A stack tracking keys defined in nexted scopes.
        }

        lintToken(...args) {
            const [type] = Array.from(args[0]); const
                tokenApi = args[1];
            if (['{', '}'].includes(type)) {
                this.lintBrace(...arguments);
                return undefined;
            }

            // TODO: after <1.10.0 is not supported, remove 'IDENTIFIER' here
            if (['IDENTIFIER', 'PROPERTY'].includes(type)) {
                return this.lintIdentifier(...arguments);
            }
        }

        lintIdentifier(token, tokenApi) {
            let key = token[1];

            // Class names might not be in a scope
            if ((this.currentScope == null)) { return null; }
            const nextToken = tokenApi.peek(1);

            // Exit if this identifier isn't being assigned. A and B
            // are identifiers, but only A should be examined:
            // A = B
            if (nextToken[1] !== ':') { return null; }
            const previousToken = tokenApi.peek(-1);

            // Assigning "@something" and "something" are not the same thing
            if (previousToken[0] === '@') { key = `@${key}`; }

            // Added a prefix to not interfere with things like "constructor".
            key = `identifier-${key}`;
            if (this.currentScope[key]) {
                return true;
            }
            this.currentScope[key] = token;
            return null;
        }

        lintBrace(token) {
            if (token[0] === '{') {
                if (this.currentScope != null) { this.braceScopes.push(this.currentScope); }
                this.currentScope = {};
            } else {
                this.currentScope = this.braceScopes.pop();
            }

            return null;
        }
    };
    DuplicateKey.initClass();
    return DuplicateKey;
}()));
