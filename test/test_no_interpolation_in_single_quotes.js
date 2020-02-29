/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const path = require('path');
const vows = require('vows');
const assert = require('assert');
const coffeelint = require(path.join('..', 'lib', 'coffeelint'));

const RULE = 'no_interpolation_in_single_quotes';

vows.describe(RULE).addBatch({

    'Interpolation in single quotes': {
        topic:
            `\
foo = '#{inter}foo#{polation}'\
`,

        'interpolation in single quotes is allowed by default'(source) {
            const errors = coffeelint.lint(source);
            assert.isArray(errors);
            return assert.isEmpty(errors);
        },

        'interpolation in single quotes can be forbidden'(source) {
            const config = {no_interpolation_in_single_quotes: { level: 'error' }};
            const errors = coffeelint.lint(source, config);
            assert.lengthOf(errors, 1);
            const error = errors[0];
            assert.equal(error.lineNumber, 1);
            return assert.equal(error.rule, RULE);
        }
    },

    'Interpolation in double quotes': {
        topic:
            `\
foo = "#{inter}foo#{polation}"
bar = "ive\#{escaped}"\
`,

        'interpolation in double quotes is always allowed'(source) {
            const config = {no_interpolation_in_single_quotes: { level: 'error' }};
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            return assert.isEmpty(errors);
        }
    }

}).export(module);
