/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const path = require('path');
const vows = require('vows');
const assert = require('assert');
const coffeelint = require(path.join('..', 'lib', 'coffeelint'));

const RULE = 'no_debugger';

vows.describe(RULE).addBatch({

    'console calls': {
        topic:
            `\
console.log("hello world")\
`,

        'causes a warning when present'(source) {
            const config = {no_debugger: { level: 'error', console: true }};
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            return assert.lengthOf(errors, 1);
        }
    },

    'The debugger statement': {
        topic:
            `\
debugger\
`,

        'causes a warning when present'(source) {
            const errors = coffeelint.lint(source);
            assert.isArray(errors);
            assert.lengthOf(errors, 1);
            const error = errors[0];
            assert.equal(error.level, 'warn');
            assert.equal(error.lineNumber, 1);
            return assert.equal(error.rule, RULE);
        },

        'can be set to error'(source) {
            const config = {no_debugger: {level: 'error'}};
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            assert.isArray(errors);
            assert.lengthOf(errors, 1);
            const error = errors[0];
            assert.equal(error.lineNumber, 1);
            return assert.equal(error.rule, RULE);
        }
    }

}).export(module);
