/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let NoEmptyParamList;
module.exports = (NoEmptyParamList = (function() {
    NoEmptyParamList = class NoEmptyParamList {
        static initClass() {
    
            this.prototype.rule = {
                name: 'no_empty_param_list',
                level: 'ignore',
                message: 'Empty parameter list is forbidden',
                description: `\
This rule prohibits empty parameter lists in function definitions.
<pre>
<code># The empty parameter list in here is unnecessary:
myFunction = () -&gt;
    
# We might favor this instead:
myFunction = -&gt;
</code>
</pre>
Empty parameter lists are permitted by default.\
`
            };
    
            this.prototype.tokens = ['PARAM_START'];
        }

        lintToken(token, tokenApi) {
            const nextType = tokenApi.peek()[0];
            return nextType === 'PARAM_END';
        }
    };
    NoEmptyParamList.initClass();
    return NoEmptyParamList;
})());
