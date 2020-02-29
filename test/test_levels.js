/* eslint-disable
    func-names,
    import/no-dynamic-require,
    import/no-unresolved,
    no-multi-str,
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

vows.describe('levels').addBatch({

    CoffeeLint: {
        topic:
            '\
abc = 123;\
',

        'can ignore errors': function (source) {
            const config = { no_trailing_semicolons: { level: 'ignore' } };
            const errors = coffeelint.lint(source, config);
            return assert.isEmpty(errors);
        },

        'can return warnings': function (source) {
            const config = { no_trailing_semicolons: { level: 'warn' } };
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            assert.lengthOf(errors, 1);
            const error = errors[0];
            return assert.equal(error.level, 'warn');
        },

        'can return errors': function (source) {
            const config = { no_trailing_semicolons: { level: 'error' } };
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            assert.lengthOf(errors, 1);
            const error = errors[0];
            return assert.equal(error.level, 'error');
        },

        'catches unknown levels': function (source) {
            const config = { no_trailing_semicolons: { level: 'foobar' } };
            return assert.throws(() => coffeelint.lint(source, config));
        },
    },


}).export(module);
