/* eslint-disable
    func-names,
    import/no-dynamic-require,
    import/no-unresolved,
    no-multi-str,
    no-useless-escape,
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

const configError = { no_trailing_semicolons: { level: 'error' } };
const configIgnore = { no_trailing_semicolons: { level: 'ignore' } };

const RULE = 'no_trailing_semicolons';

vows.describe(RULE).addBatch({

    'Semicolons at end of lines': {
        topic:
            `\
x = 1234;
y = 1234; z = 1234\
`,

        'are forbidden': function (source) {
            const errors = coffeelint.lint(source);
            assert.lengthOf(errors, 1);
            const error = errors[0];
            assert.equal(error.lineNumber, 1);
            assert.equal(error.message, 'Line contains a trailing semicolon');
            return assert.equal(error.rule, RULE);
        },

        'can be ignored': function (source) {
            const errors = coffeelint.lint(source, configIgnore);
            return assert.isEmpty(errors);
        },
    },

    'Semicolons in multiline expressions': {
        topic:
            `\
x = "asdf;
asdf"

y1 = """
#{asdf1};
_#{asdf2}_;
asdf;
"""

y2 = """
    #{asdf1};
    _#{asdf2}_;
    asdf;
"""

z = ///
a*\;
///\
`,

        'are ignored': function (source) {
            const errors = coffeelint.lint(source);
            return assert.isEmpty(errors);
        },
    },

    'Trailing semicolon in comments': {
        topic:
            '\
undefined\n# comment;\nundefined\
',

        'are ignored': function (source) {
            const errors = coffeelint.lint(source, {});
            return assert.isEmpty(errors);
        },
    },

    'Trailing semicolon in comments with no semicolon in statement': {
        topic:
            '\
x = 3 #set x to 3;\
',

        'are ignored': function (source) {
            const errors = coffeelint.lint(source, configIgnore);
            return assert.isEmpty(errors);
        },

        'will throw an error': function (source) {
            const errors = coffeelint.lint(source, configError);
            return assert.isEmpty(errors);
        },
    },

    'Trailing semicolon in comments with semicolon in statement': {
        topic:
            '\
x = 3; #set x to 3;\
',

        'are ignored': function (source) {
            const errors = coffeelint.lint(source, configIgnore);
            return assert.isEmpty(errors);
        },

        'will throw an error': function (source) {
            const errors = coffeelint.lint(source, configError);
            assert.lengthOf(errors, 1);
            const error = errors[0];
            assert.equal(error.lineNumber, 1);
            assert.equal(error.message, 'Line contains a trailing semicolon');
            return assert.equal(error.rule, RULE);
        },
    },

    'Trailing semicolon in block comments': {
        topic:
            '\
###\nThis is a block comment;\n###\
',

        'are ignored': function (source) {
            const errors = coffeelint.lint(source, configIgnore);
            return assert.isEmpty(errors);
        },

        'are ignored even if config level is error': function (source) {
            const errors = coffeelint.lint(source, configError);
            return assert.isEmpty(errors);
        },
    },

    'Semicolons with windows line endings': {
        topic:
            '\
x = 1234;\r\n\
',

        'works as expected': function (source) {
            const config = { line_endings: { value: 'windows' } };
            const errors = coffeelint.lint(source, config);
            assert.lengthOf(errors, 1);
            const error = errors[0];
            assert.equal(error.lineNumber, 1);
            assert.equal(error.message, 'Line contains a trailing semicolon');
            return assert.equal(error.rule, RULE);
        },
    },

    'Semicolons inside of blockquote string': {
        topic:
            `\
foo = bar();

errs = """
  this does not err;
  this does;
  #{isEmpty a};
  #{isEmpty(b)};
"""

nothing = """
this does not err;
this neither;
#{isEmpty(x)};
#{isEmpty y};
"""\
`,

        'are ignored': function (source) {
            const errors = coffeelint.lint(source, configError);
            assert.lengthOf(errors, 1);
            const error = errors[0];
            assert.equal(error.lineNumber, 1);
            assert.equal(error.message, 'Line contains a trailing semicolon');
            return assert.equal(error.rule, RULE);
        },
    },

}).export(module);
