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

    'CoffeeLint': {
        topic:
            `\
abc = 123;\
`,

        'can ignore errors'(source) {
            const config = {no_trailing_semicolons: { level: 'ignore' }};
            const errors = coffeelint.lint(source, config);
            return assert.isEmpty(errors);
        },

        'can return warnings'(source) {
            const config = {no_trailing_semicolons: { level: 'warn' }};
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            assert.lengthOf(errors, 1);
            const error = errors[0];
            return assert.equal(error.level, 'warn');
        },

        'can return errors'(source) {
            const config = {no_trailing_semicolons: { level: 'error' }};
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            assert.lengthOf(errors, 1);
            const error = errors[0];
            return assert.equal(error.level, 'error');
        },

        'catches unknown levels'(source) {
            const config = {no_trailing_semicolons: { level: 'foobar' }};
            return assert.throws(() => coffeelint.lint(source, config));
        }
    }


}).export(module);
