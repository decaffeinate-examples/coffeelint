/* eslint-disable
    func-names,
    import/no-dynamic-require,
    import/no-unresolved,
    no-multi-str,
    no-unused-vars,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const path = require('path');
const vows = require('vows');
const assert = require('assert');

const coffeelint = require(path.join('..', 'lib', 'coffeelint'));

const RULE = 'no_backticks';

vows.describe(RULE).addBatch({

    Backticks: {
        topic:
            '\
`with(document) alert(height);`\
',

        'are forbidden by default': function (source) {
            const errors = coffeelint.lint(source);
            assert.isArray(errors);
            assert.lengthOf(errors, 1);
            const error = errors[0];
            assert.equal(error.rule, RULE);
            assert.equal(error.lineNumber, 1);
            return assert.equal(error.message, 'Backticks are forbidden');
        },

        'can be permitted': function (source) {
            const config = { no_backticks: { level: 'ignore' } };
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            return assert.isEmpty(errors);
        },
    },

    'Ignore string interpolation from comments': {
        topic:
            '\
<div>{### comment ###}</div>\
',
        'are ignored when no_backtick rule is enabled': function (source) {
            const config = { no_backticks: { level: 'error' } };
            const errors = coffeelint.lint(source);
            return assert.isEmpty(errors);
        },
    },

}).export(module);
