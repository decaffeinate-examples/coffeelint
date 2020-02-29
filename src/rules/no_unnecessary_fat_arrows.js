/* eslint-disable
    func-names,
    max-len,
    no-multi-assign,
    no-shadow,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let NoUnnecessaryFatArrows;
const any = (arr, test) => arr.reduce(((res, elt) => res || test(elt)), false);

module.exports = (NoUnnecessaryFatArrows = (function () {
    NoUnnecessaryFatArrows = class NoUnnecessaryFatArrows {
        constructor() {
            this.isThis = this.isThis.bind(this);
            this.needsFatArrow = this.needsFatArrow.bind(this);
        }

        static initClass() {
            this.prototype.rule = {
                name: 'no_unnecessary_fat_arrows',
                level: 'warn',
                message: 'Unnecessary fat arrow',
                description: `\
Disallows defining functions with fat arrows when \`this\`
is not used within the function.\
`,
            };
        }

        lintAST(node, astApi) {
            this.astApi = astApi;
            this.lintNode(node);
            return undefined;
        }

        lintNode(node) {
            if ((this.isFatArrowCode(node)) && (!this.needsFatArrow(node))) {
                const error = this.astApi.createError({ lineNumber: node.locationData.first_line + 1 });
                this.errors.push(error);
            }
            return node.eachChild((child) => this.lintNode(child));
        }

        isCode(node) { return this.astApi.getNodeName(node) === 'Code'; }

        isFatArrowCode(node) { return this.isCode(node) && node.bound; }

        isValue(node) { return this.astApi.getNodeName(node) === 'Value'; }

        isThis(node) {
            return ((node.constructor != null ? node.constructor.name : undefined) === 'ThisLiteral')
            || (this.isValue(node) && (node.base.value === 'this'));
        }

        needsFatArrow(node) {
            return this.isCode(node) && (
                any(node.params, (param) => (param.contains(this.isThis) != null))
                || (node.body.contains(this.isThis) != null)
                || (node.body.contains((child) => {
                    if (!this.astApi.getNodeName(child)) {
                        return ((child.constructor != null ? child.constructor.name : undefined) === 'SuperCall')
                        || ((child.isSuper != null) && child.isSuper);
                        // TODO: after <1.10.0 is not supported, remove child.isSuper
                    }
                    return this.isFatArrowCode(child) && this.needsFatArrow(child);
                }) != null)
            );
        }
    };
    NoUnnecessaryFatArrows.initClass();
    return NoUnnecessaryFatArrows;
}()));
