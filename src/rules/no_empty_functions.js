/* eslint-disable
    func-names,
    no-multi-assign,
    no-shadow,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let NoEmptyFunctions;
const isEmptyCode = function (node, astApi) {
    const nodeName = astApi.getNodeName(node);
    return (nodeName === 'Code') && node.body.isEmpty();
};

module.exports = (NoEmptyFunctions = (function () {
    NoEmptyFunctions = class NoEmptyFunctions {
        static initClass() {
            this.prototype.rule = {
                name: 'no_empty_functions',
                level: 'ignore',
                message: 'Empty function',
                description: `\
Disallows declaring empty functions. The goal of this rule is that
unintentional empty callbacks can be detected:
<pre>
<code>someFunctionWithCallback ->
doSomethingSignificant()
</code>
</pre>
The problem is that the call to
<tt>doSomethingSignificant</tt> will be made regardless
of <tt>someFunctionWithCallback</tt>'s execution. It can
be because you did not indent the call to
<tt>doSomethingSignificant</tt> properly.
    
If you really meant that <tt>someFunctionWithCallback</tt>
should call a callback that does nothing, you can write your code
this way:
<pre>
<code>someFunctionWithCallback ->
    undefined
doSomethingSignificant()
</code>
</pre>\
`,
            };
        }

        lintAST(node, astApi) {
            this.lintNode(node, astApi);
            return undefined;
        }

        lintNode(node, astApi) {
            if (isEmptyCode(node, astApi)) {
                const error = astApi.createError({ lineNumber: node.locationData.first_line + 1 });
                this.errors.push(error);
            }
            return node.eachChild((child) => this.lintNode(child, astApi));
        }
    };
    NoEmptyFunctions.initClass();
    return NoEmptyFunctions;
}()));
