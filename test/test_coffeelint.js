/* eslint-disable
    consistent-return,
    func-names,
    import/no-dynamic-require,
    import/no-unresolved,
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

vows.describe('coffeelint').addBatch({

    "CoffeeLint's version number": {
        topic: coffeelint.VERSION,

        exists(version) {
            return assert.isString(version);
        },
    },

    "CoffeeLint's errors": {
        topic() {
            return coffeelint.lint(`\
a = () ->\t
    1234\
`);
        },

        'are sorted by line number': function (errors) {
            assert.isArray(errors);
            assert.lengthOf(errors, 2);
            assert.equal(errors[1].lineNumber, 2);
            return assert.equal(errors[0].lineNumber, 1);
        },
    },

    'Errors in the source': {
        topic:
            `\
fruits = [orange, apple, banana]
switch 'a'
  when in fruits
    something\
`,

        'are reported': function (source) {
            let m;
            const errors = coffeelint.lint(source);
            assert.isArray(errors);
            assert.lengthOf(errors, 1);
            const error = errors[0];
            assert.equal(error.rule, 'coffeescript_error');
            assert.equal(error.lineNumber, 3);

            if (error.message.indexOf('on line') !== -1) {
                m = "Error: Parse error on line 3: Unexpected 'RELATION'";
            } else if (error.message.indexOf('SyntaxError:') !== -1) {
                m = 'SyntaxError: unexpected RELATION';
            } else {
                // CoffeeLint changed the format to be more complex.  I don't
                // think an exact match really needs to be verified.
                return;
            }

            return assert.equal(error.message, m);
        },
    },

}).export(module);
