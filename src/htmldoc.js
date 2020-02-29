/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const { RULES: rules } = require('./coffeelint');

const render = function() {
    const rulesHTML = '';
    const ruleNames = Object.keys(rules).sort();
    return (() => {
        const result = [];
        for (let ruleName of Array.from(ruleNames)) {
            const rule = rules[ruleName];
            rule.name = ruleName;
            if (!rule.description) { rule.description = '[no description provided]'; }
            // coffeelint: disable=no_debugger
            result.push(console.log(ruleTemplate(rule)));
        }
        return result;
    })();
};
        // coffeelint: enable=no_debugger

var ruleTemplate = _.template(`\
<tr>
<td class="rule"><%= name %></td>
<td class="description">
    <%= description %>
    <p><em>default level: <%= level %></em></p>
</td>
</tr>\
`
);

render();
