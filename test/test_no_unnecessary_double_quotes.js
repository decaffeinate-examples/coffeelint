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

const RULE = 'no_unnecessary_double_quotes';

vows.describe(RULE).addBatch({

    'Single quotes': {
        topic:
            '\
foo = \'single\'\
',

        'single quotes should always be allowed': function (source) {
            const config = { no_unnecessary_double_quotes: { level: 'error' } };
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            return assert.isEmpty(errors);
        },
    },


    'Unnecessary double quotes': {
        topic:
            '\
foo = "double"\
',

        'double quotes are allowed by default': function (source) {
            const errors = coffeelint.lint(source);
            assert.isArray(errors);
            return assert.isEmpty(errors);
        },

        'double quotes can be forbidden': function (source) {
            const config = { no_unnecessary_double_quotes: { level: 'error' } };
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            assert.lengthOf(errors, 1);
            const error = errors[0];
            assert.equal(error.lineNumber, 1);
            assert.equal(error.message,
                'Unnecessary double quotes are forbidden');
            return assert.equal(error.rule, RULE);
        },
    },


    'Useful double quotes': {
        topic:
            `\
interpolation = "inter#{polation}"
multipleInterpolation = "#{foo}bar#{baz}"
singleQuote = "single'quote"\
`,

        'string interpolation should always be allowed': function (source) {
            const config = { no_unnecessary_double_quotes: { level: 'error' } };
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            return assert.isEmpty(errors);
        },
    },


    'Block strings with double quotes': {
        topic:
            `\
foo = """
  doubleblock
"""\
`,

        'block strings with double quotes are not allowed': function (source) {
            const config = { no_unnecessary_double_quotes: { level: 'error' } };
            const errors = coffeelint.lint(source, config);
            assert.lengthOf(errors, 1);
            const error = errors[0];
            assert.equal(error.lineNumber, 1);
            assert.equal(error.message,
                'Unnecessary double quotes are forbidden');
            return assert.equal(error.rule, RULE);
        },
    },


    'Block strings with useful double quotes': {
        topic:
            `\
foo = """
  #{interpolation}foo 'some single quotes for good measure'
"""\
`,

        'block strings with useful content should be allowed': function (source) {
            const config = { no_unnecessary_double_quotes: { level: 'error' } };
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            return assert.isEmpty(errors);
        },
    },


    'Block strings with single quotes': {
        topic:
            `\
foo = '''
  singleblock
'''\
`,

        'block strings with single quotes should be allowed': function (source) {
            const config = { no_unnecessary_double_quotes: { level: 'error' } };
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            return assert.isEmpty(errors);
        },
    },


    'Hand concatenated string with parenthesis': {
        topic:
            '\
foo = (("inter") + "polation")\
',

        'double quotes should not be allowed': function (source) {
            const config = { no_unnecessary_double_quotes: { level: 'error' } };
            const errors = coffeelint.lint(source, config);
            assert.lengthOf(errors, 2);
            const error = errors[0];
            assert.equal(error.lineNumber, 1);
            assert.equal(error.message,
                'Unnecessary double quotes are forbidden');
            return assert.equal(error.rule, RULE);
        },
    },

    'use strict': {
        topic:
            `\
"use strict"
foo = 'foo'\
`,

        'should not error at the start of the file #306': function (source) {
            const config = { no_unnecessary_double_quotes: { level: 'error' } };
            // Without the fix for 306 this throws an Error.
            const errors = coffeelint.lint(source, config);
            assert.lengthOf(errors, 1);
            const error = errors[0];
            assert.equal(error.lineNumber, 1);
            return assert.equal(error.rule, RULE);
        },
    },

    'Test RegExp flags #405': {
        topic:
            '\
d = ///#{foo}///i\
',

        'should not generate an error': function (source) {
            const config = { no_unnecessary_double_quotes: { level: 'error' } };
            const errors = coffeelint.lint(source, config);
            return assert.lengthOf(errors, 0);
        },
    },

    'Test multiline regexp #286': {
        topic:
            `\
a = 'hello'
b = ///
  .*
  #{a}
  [0-9]
///
c = RegExp(".*#{a}0-9")\
`,

        'should not generate an error': function (source) {
            const config = { no_unnecessary_double_quotes: { level: 'error' } };
            const errors = coffeelint.lint(source, config);
            return assert.lengthOf(errors, 0);
        },
    },

}).export(module);
