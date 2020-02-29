/* eslint-disable
    func-names,
    import/no-dynamic-require,
    import/no-unresolved,
    no-multi-str,
    no-restricted-syntax,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const path = require('path');
const vows = require('vows');
const assert = require('assert');

const coffeelint = require(path.join('..', 'lib', 'coffeelint'));

const RULE = 'no_nested_string_interpolation';

vows.describe(RULE).addBatch({

    'Non-nested string interpolation': {
        topic:
            '\
"Book by #{firstName.toUpperCase()} #{lastName.toUpperCase()}"\
',

        'is allowed': function (source) {
            const errors = coffeelint.lint(source);
            assert.isArray(errors);
            return assert.isEmpty(errors);
        },
    },

    'Nested string interpolation': {
        topic:
            '\
str = "Book by #{"#{firstName} #{lastName}".toUpperCase()}"\
',

        'should generate a warning': function (source) {
            const errors = coffeelint.lint(source);
            assert.isArray(errors);
            assert.lengthOf(errors, 1);
            const error = errors[0];
            assert.equal(error.rule, RULE);
            assert.equal(error.lineNumber, 1);
            assert.equal(error.level, 'warn');
            return assert.equal(error.message,
                'Nested string interpolation is forbidden');
        },

        'can be permitted': function (source) {
            const config = { no_nested_string_interpolation: { level: 'ignore' } };
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            return assert.isEmpty(errors);
        },
    },

    'Deeply nested string interpolation': {
        topic:
            `\
str1 = "string #{"interpolation #{"inception"}"}"
str2 = "going #{"in #{"even #{"deeper"}"}"}"
str3 = "#{"multiple #{"warnings"}"} for #{"diff #{"nestings"}"}"\
`,

        'generates only one warning per string': function (source) {
            const errors = coffeelint.lint(source);
            assert.isArray(errors);
            assert.lengthOf(errors, 4);
            for (const { rule } of Array.from(errors)) { assert.equal(rule, RULE); }
            assert.equal(errors[0].lineNumber, 1);
            assert.equal(errors[1].lineNumber, 2);
            assert.equal(errors[2].lineNumber, 3);
            return assert.equal(errors[3].lineNumber, 3);
        },
    },

}).export(module);
