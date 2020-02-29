/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let NoPrivateFunctionFatArrows;
module.exports = (NoPrivateFunctionFatArrows = (function() {
    NoPrivateFunctionFatArrows = class NoPrivateFunctionFatArrows {
        constructor() {
            this.isCode = this.isCode.bind(this);
            this.isClass = this.isClass.bind(this);
            this.isValue = this.isValue.bind(this);
            this.isObject = this.isObject.bind(this);
            this.isFatArrowCode = this.isFatArrowCode.bind(this);
        }

        static initClass() {
    
            this.prototype.rule = {
                name: 'no_private_function_fat_arrows',
                level: 'warn',
                message: 'Used the fat arrow for a private function',
                description: `\
Warns when you use the fat arrow for a private function
inside a class definition scope. It is not necessary and
it does not do anything.\
`
            };
        }

        lintAST(node, astApi) {
            this.astApi = astApi;
            this.lintNode(node);
            return undefined;
        }

        lintNode(node, functions) {
            if (functions == null) { functions = []; }
            if (this.isFatArrowCode(node) && Array.from(functions).includes(node)) {
                const error = this.astApi.createError({
                    lineNumber: node.locationData.first_line + 1});
                this.errors.push(error);
            }

            return node.eachChild(child => this.lintNode(child,
                (() => { switch (false) {
                    case !this.isClass(node): return this.functionsOfClass(node);
                    // Once we've hit a function, we know we can't be in the top
                    // level of a function anymore, so we can safely reset the
                    // functions to empty to save work.
                    case !this.isCode(node): return [];
                    default: return functions;
                } })()
            )
            );
        }

        isCode(node) { return this.astApi.getNodeName(node) === 'Code'; }
        isClass(node) { return this.astApi.getNodeName(node) === 'Class'; }
        isValue(node) { return this.astApi.getNodeName(node) === 'Value'; }
        isObject(node) { return this.astApi.getNodeName(node) === 'Obj'; }
        isFatArrowCode(node) { return this.isCode(node) && node.bound; }

        functionsOfClass(classNode) {
            const bodyValues = (() => {
                const result = [];
                for (let bodyNode of Array.from(classNode.body.expressions)) {
                    if (this.isValue(bodyNode) && this.isObject(bodyNode.base)) { continue; }

                    result.push(bodyNode.value);
                }
                return result;
            })();
            return bodyValues.filter(this.isCode);
        }
    };
    NoPrivateFunctionFatArrows.initClass();
    return NoPrivateFunctionFatArrows;
})());
