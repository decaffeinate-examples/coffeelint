/* eslint-disable
    func-names,
    import/no-dynamic-require,
    import/no-unresolved,
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

const RULE = 'no_plusplus';

vows.describe(RULE).addBatch({

    'The increment and decrement operators': {
        topic:
            `\
y++
++y
x--
--x\
`,

        'are permitted by default': function (source) {
            const errors = coffeelint.lint(source);
            assert.isArray(errors);
            return assert.isEmpty(errors);
        },

        'can be forbidden': function (source) {
            const errors = coffeelint.lint(source, { no_plusplus: { level: 'error' } });
            assert.isArray(errors);
            assert.lengthOf(errors, 4);
            const error = errors[0];
            assert.equal(error.lineNumber, 1);
            return assert.equal(error.rule, RULE);
        },
    },

}).export(module);
