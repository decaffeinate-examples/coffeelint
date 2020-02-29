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

const RULE = 'spacing_after_comma';

vows.describe(RULE).addBatch({

    regex: {
        topic:
            '\
///^#{ inputValue }///i.test field.name\
',

        'should not error': function (source) {
            const config = { spacing_after_comma: { level: 'warn' } };
            const errors = coffeelint.lint(source, config);
            return assert.equal(errors.length, 0);
        },
    },

    'Whitespace after commas': {
        topic:
            '\
doSomething(foo = \',\',bar)\nfooBar()\
',

        'permitted by default': function (source) {
            const errors = coffeelint.lint(source);
            return assert.equal(errors.length, 0);
        },

        'can be forbidden': function (source) {
            const config = { spacing_after_comma: { level: 'warn' } };
            const errors = coffeelint.lint(source, config);
            assert.equal(errors.length, 1);
            const error = errors[0];
            assert.equal(error.lineNumber, 1);
            assert.equal(error.message, 'a space is required after commas');
            return assert.equal(error.rule, RULE);
        },
    },

    'newline after commas': {
        topic:
            `\
multiLineFuncCall(
  arg1,
  arg2,
  arg3
)\
`,

        'should not issue warns': function (source) {
            const config = { spacing_after_comma: { level: 'warn' } };
            const errors = coffeelint.lint(source, config);
            return assert.equal(errors.length, 0);
        },
    },

}).export(module);
