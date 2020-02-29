/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const path = require('path');
const vows = require('vows');
const assert = require('assert');
const coffeelint = require(path.join('..', 'lib', 'coffeelint'));

const RULE = 'line_endings';

vows.describe(RULE).addBatch({

    'Unix line endings': {
        topic:
            `\
x = 1\ny=2\
`,

        'are allowed by default'(source) {
            const errors = coffeelint.lint(source);
            return assert.isEmpty(errors);
        },

        'can be forbidden'(source) {
            const config = {line_endings: { level: 'error', value: 'windows' }};
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            assert.lengthOf(errors, 1);
            const error = errors[0];
            assert.equal(error.lineNumber, 1);
            assert.equal(error.message, 'Line contains incorrect line endings');
            assert.equal(error.context, 'Expected windows');
            return assert.equal(error.rule, RULE);
        }
    },

    'Windows line endings': {
        topic:
            `\
x = 1\r\ny=2\
`,

        'are allowed by default'(source) {
            const errors = coffeelint.lint(source);
            return assert.isEmpty(errors);
        },

        'can be forbidden'(source) {
            const config = {line_endings: { level: 'error', value: 'unix' }};
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            assert.lengthOf(errors, 1);
            const error = errors[0];
            assert.equal(error.lineNumber, 1);
            assert.equal(error.message, 'Line contains incorrect line endings');
            assert.equal(error.context, 'Expected unix');
            return assert.equal(error.rule, RULE);
        }
    },

    'Unknown line endings': {
        topic:
            `\
x = 1\ny=2\
`,

        'throw errors'(source) {
            const config = {line_endings: { level: 'error', value: 'osx' }};
            return assert.throws(() => coffeelint.lint(source, config));
        }
    }

}).export(module);
