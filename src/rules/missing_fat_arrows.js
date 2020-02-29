/* eslint-disable
    class-methods-use-this,
    consistent-return,
    func-names,
    max-len,
    no-multi-assign,
    no-param-reassign,
    no-restricted-syntax,
    no-shadow,
    no-underscore-dangle,
    no-use-before-define,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let MissingFatArrows;
const any = (arr, test) => arr.reduce(((res, elt) => res || test(elt)), false);

const containsButIsnt = function (node, nIsThis, nIsClass) {
    let target;
    node.traverseChildren(false, (n) => {
        if (nIsClass(n)) {
            return false;
        }
        if (nIsThis(n)) {
            target = n;
            return false;
        }
    });
    return target;
};

module.exports = (MissingFatArrows = (function () {
    MissingFatArrows = class MissingFatArrows {
        constructor() {
            this.isCode = this.isCode.bind(this);
            this.isClass = this.isClass.bind(this);
            this.isValue = this.isValue.bind(this);
            this.isObject = this.isObject.bind(this);
            this.isThis = this.isThis.bind(this);
            this.isFatArrowCode = this.isFatArrowCode.bind(this);
        }

        static initClass() {
            this.prototype.rule = {
                name: 'missing_fat_arrows',
                level: 'ignore',
                is_strict: false,
                message: 'Used `this` in a function without a fat arrow',
                description: `\
Warns when you use \`this\` inside a function that wasn't defined
with a fat arrow. This rule does not apply to methods defined in a
class, since they have \`this\` bound to the class instance (or the
class itself, for class methods). The option \`is_strict\` is
available for checking bindings of class methods.
    
It is impossible to statically determine whether a function using
\`this\` will be bound with the correct \`this\` value due to language
features like \`Function.prototype.call\` and
\`Function.prototype.bind\`, so this rule may produce false positives.\
`,
            };
        }

        lintAST(node, astApi) {
            this.astApi = astApi;
            this.lintNode(node);
            return undefined;
        }

        lintNode(node, methods) {
            if (methods == null) { methods = []; }
            const isStrict = this.astApi.config[this.rule.name] != null ? this.astApi.config[this.rule.name].is_strict : undefined;

            if (this.isPrototype(node)) {
                return;
            }

            if (this.isConstructor(node)) {
                return;
            }

            if ((!this.isFatArrowCode(node))
                    // Ignore any nodes we know to be methods
                    && (isStrict ? true : !Array.from(methods).includes(node))
                    && (this.needsFatArrow(node))) {
                const error = this.astApi.createError({ lineNumber: node.locationData.first_line + 1 });
                this.errors.push(error);
            }

            return node.eachChild((child) => this.lintNode(child,
                (() => {
                    switch (false) {
                    case !this.isClass(node): return this.methodsOfClass(node);
                    // Once we've hit a function, we know we can't be in the top
                    // level of a method anymore, so we can safely reset the methods
                    // to empty to save work.
                    case !this.isCode(node): return [];
                    default: return methods;
                    }
                })()));
        }

        isCode(node) { return this.astApi.getNodeName(node) === 'Code'; }

        isClass(node) { return this.astApi.getNodeName(node) === 'Class'; }

        isValue(node) { return this.astApi.getNodeName(node) === 'Value'; }

        isObject(node) { return this.astApi.getNodeName(node) === 'Obj'; }

        isPrototype(node) {
            const props = __guard__(node != null ? node.variable : undefined, (x) => x.properties) || [];
            for (const ident of Array.from(props)) {
                if ((ident.name != null ? ident.name.value : undefined) === 'prototype') {
                    return true;
                }
            }
            return false;
        }

        isThis(node) { return this.isValue(node) && (node.base.value === 'this'); }

        isFatArrowCode(node) { return this.isCode(node) && node.bound; }

        isConstructor(node) { return __guard__(node.variable != null ? node.variable.base : undefined, (x) => x.value) === 'constructor'; }

        needsFatArrow(node) {
            return this.isCode(node) && (
                any(node.params, (param) => (param.contains(this.isThis) != null))
                || containsButIsnt(node.body, this.isThis, this.isClass)
            );
        }

        methodsOfClass(classNode) {
            const bodyNodes = classNode.body.expressions;
            const returnNode = bodyNodes[bodyNodes.length - 1];
            if ((returnNode != null) && this.isValue(returnNode) && this.isObject(returnNode.base)) {
                return returnNode.base.properties
                    .map((assignNode) => assignNode.value)
                    .filter(this.isCode);
            } return [];
        }
    };
    MissingFatArrows.initClass();
    return MissingFatArrows;
}()));

function __guard__(value, transform) {
    return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
