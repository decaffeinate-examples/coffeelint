/* eslint-disable
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

const config = {
    no_unnecessary_fat_arrows: { level: 'ignore' },
    no_private_function_fat_arrows: { level: 'error' },
};

const RULE = 'no_private_function_fat_arrows';

vows.describe(RULE).addBatch({
    eol: {
        'should warn with fat arrow': function () {
            const result = coffeelint.lint(`\
class Foo
  foo = =>\
`, config);
            assert.equal(result.length, 1);
            assert.equal(result[0].rule, RULE);
            return assert.equal(result[0].level, 'error');
        },

        'should work with nested classes': function () {
            let result = coffeelint.lint(`\
class Bar
  foo = ->
    class
      bar2 = =>\
`, config);
            assert.equal(result.length, 1);
            assert.equal(result[0].rule, RULE);
            assert.equal(result[0].level, 'error');

            // Same method name as external function.
            result = coffeelint.lint(`\
class Bar
  foo = ->
    class
      foo = =>\
`, config);
            assert.equal(result.length, 1);
            assert.equal(result[0].rule, RULE);
            return assert.equal(result[0].level, 'error');
        },

        'should not warn without fat arrow': function () {
            return assert.isEmpty(coffeelint.lint(`\
class Foo
  foo = ->\
`, config));
        },
    },

}).export(module);
