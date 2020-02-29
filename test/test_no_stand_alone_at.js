/* eslint-disable
    func-names,
    import/no-dynamic-require,
    import/no-unresolved,
    prefer-destructuring,
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

const RULE = 'no_stand_alone_at';

vows.describe(RULE).addBatch({

    'Stand alone @': {
        topic:
            `\
@alright
@   .error
@ok()
@ notok
@[ok]
@.ok
not(@).ok
@::ok
@:: #notok
@(fn)\
`,

        'are allowed by default': function (source) {
            const errors = coffeelint.lint(source);
            assert.isArray(errors);
            return assert.isEmpty(errors);
        },

        'can be forbidden': function (source) {
            const config = { no_stand_alone_at: { level: 'error' } };
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            assert.lengthOf(errors, 3);
            let error = errors[0];
            assert.equal(error.lineNumber, 4);
            assert.equal(error.rule, RULE);
            error = errors[1];
            assert.equal(error.lineNumber, 7);
            assert.equal(error.rule, RULE);
            error = errors[2];
            assert.equal(error.lineNumber, 9);
            return assert.equal(error.rule, RULE);
        },
    },

}).export(module);
