/* eslint-disable
    consistent-return,
    func-names,
    no-multi-assign,
    no-multi-str,
    no-nested-ternary,
    no-return-assign,
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
let CyclomaticComplexity;
module.exports = (CyclomaticComplexity = (function () {
    CyclomaticComplexity = class CyclomaticComplexity {
        static initClass() {
            this.prototype.rule = {
                name: 'cyclomatic_complexity',
                level: 'ignore',
                message: 'The cyclomatic complexity is too damn high',
                value: 10,
                description: '\
Examine the complexity of your function.\
',
            };
        }

        // returns the "complexity" value of the current node.
        getComplexity(node) {
            const name = this.astApi.getNodeName(node);
            const complexity = ['If', 'While', 'For', 'Try'].includes(name)
                ? 1
                : (name === 'Op') && ['&&', '||'].includes(node.operator)
                    ? 1
                    : name === 'Switch'
                        ? node.cases.length
                        : 0;
            return complexity;
        }

        lintAST(node, astApi) {
            this.astApi = astApi;
            this.lintNode(node);
            return undefined;
        }

        // Lint the AST node and return its cyclomatic complexity.
        lintNode(node) {
            // Get the complexity of the current node.
            const name = this.astApi != null ? this.astApi.getNodeName(node) : undefined;
            let complexity = this.getComplexity(node);

            // Add the complexity of all child's nodes to this one.
            node.eachChild((childNode) => {
                const childComplexity = this.lintNode(childNode);
                if ((this.astApi != null ? this.astApi.getNodeName(childNode) : undefined) !== 'Code') {
                    return complexity += childComplexity;
                }
            });

            const rule = this.astApi.config[this.rule.name];

            // If the current node is a function, and it's over our limit, add an
            // error to the list.
            if ((name === 'Code') && (complexity >= rule.value)) {
                const error = this.astApi.createError({
                    context: complexity + 1,
                    lineNumber: node.locationData.first_line + 1,
                    lineNumberEnd: node.locationData.last_line + 1,
                });
                if (error) { this.errors.push(error); }
            }

            // Return the complexity for the benefit of parent nodes.
            return complexity;
        }
    };
    CyclomaticComplexity.initClass();
    return CyclomaticComplexity;
}()));
