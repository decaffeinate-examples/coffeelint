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

const RULE = 'no_throwing_strings';

vows.describe(RULE).addBatch({

    'Throwing strings': {
        topic:
            `\
throw 'my error'
throw "#{1234}"
throw """
    long string
"""\
`,

        'is forbidden by default': function (source) {
            const errors = coffeelint.lint(source);
            assert.lengthOf(errors, 3);
            const error = errors[0];
            assert.equal(error.message, 'Throwing strings is forbidden');
            return assert.equal(error.rule, RULE);
        },

        'can be permitted': function (source) {
            const config = { no_throwing_strings: { level: 'ignore' } };
            const errors = coffeelint.lint(source, config);
            return assert.isEmpty(errors);
        },
    },

}).export(module);
