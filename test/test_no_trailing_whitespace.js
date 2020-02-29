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

const RULE = 'no_trailing_whitespace';

vows.describe(RULE).addBatch({

    'Trailing whitespace': {
        topic:
            '\
x = 1234      \ny = 1\
',

        'is forbidden by default': function (source) {
            const errors = coffeelint.lint(source);
            assert.equal(errors.length, 1);
            const error = errors[0];
            assert.isObject(error);
            assert.equal(error.lineNumber, 1);
            assert.equal(error.message, 'Line ends with trailing whitespace');
            return assert.equal(error.rule, RULE);
        },

        'can be permitted': function (source) {
            const config = { no_trailing_whitespace: { level: 'ignore' } };
            const errors = coffeelint.lint(source, config);
            return assert.equal(errors.length, 0);
        },
    },

    'Trailing whitespace in comments': {
        topic:
            '\
x = 1234  # markdown comment    \ny=1\
',

        'is forbidden by default': function (source) {
            const errors = coffeelint.lint(source);
            assert.equal(errors.length, 1);
            const error = errors[0];
            assert.isObject(error);
            assert.equal(error.lineNumber, 1);
            assert.equal(error.message, 'Line ends with trailing whitespace');
            return assert.equal(error.rule, RULE);
        },

        'can be permitted': function (source) {
            const config = { no_trailing_whitespace: { allowed_in_comments: true } };
            const errors = coffeelint.lint(source, config);
            return assert.equal(errors.length, 0);
        },
    },

    'a # in a string': {
        // writen this way to preserve spacing
        topic: 'x = "some # string"   ',

        'does not confuse trailing_whitespace': function (source) {
            const config = { no_trailing_whitespace: { allowed_in_comments: true } };
            const errors = coffeelint.lint(source, config);
            return assert.isNotEmpty(errors);
        },
    },

    'Trailing whitespace in block comments': {
        topic:
            '\
###\nblock comment with trailing space:   \n###\
',

        'is forbidden by default': function (source) {
            const errors = coffeelint.lint(source);
            assert.equal(errors.length, 1);
            const error = errors[0];
            assert.isObject(error);
            assert.equal(error.lineNumber, 2);
            assert.equal(error.message, 'Line ends with trailing whitespace');
            return assert.equal(error.rule, RULE);
        },

        'can be permitted': function (source) {
            const config = { no_trailing_whitespace: { allowed_in_comments: true } };
            const errors = coffeelint.lint(source, config);
            return assert.equal(errors.length, 0);
        },
    },

    'On empty lines': { // https://github.com/clutchski/coffeelint/issues/39
        topic:
            '\
x = 1234\n     \n\
',

        'allowed by default': function (source) {
            const errors = coffeelint.lint(source);
            return assert.equal(errors.length, 0);
        },

        'can be forbidden': function (source) {
            const config = {
                no_trailing_whitespace: {
                    allowed_in_empty_lines: false,
                },
            };

            const errors = coffeelint.lint(source, config);
            assert.equal(errors.length, 1);
            const error = errors[0];
            assert.isObject(error);
            assert.equal(error.lineNumber, 2);
            assert.equal(error.message, 'Line ends with trailing whitespace');
            return assert.equal(error.rule, RULE);
        },
    },

    'Trailing tabs': {
        topic:
            '\
x = 1234\t\
',

        'are forbidden as well': function (source) {
            const errors = coffeelint.lint(source);
            return assert.equal(errors.length, 1);
        },
    },

    'Windows line endings': {
        topic:
            '\
x = 1234\r\ny = 5678\
',

        'are permitted': function (source) {
            return assert.isEmpty(coffeelint.lint(source));
        },
    },

}).export(module);
