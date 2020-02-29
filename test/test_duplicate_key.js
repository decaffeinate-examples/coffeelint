/* eslint-disable
    func-names,
    import/no-dynamic-require,
    import/no-unresolved,
    no-restricted-syntax,
    no-unused-vars,
    prefer-destructuring,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const path = require('path');
const vows = require('vows');
const assert = require('assert');

const coffeelint = require(path.join('..', 'lib', 'coffeelint'));

const RULE = 'duplicate_key';

vows.describe(RULE).addBatch({

    'Duplicate Keys': {
        topic:
            `\
class SomeThing
  getConfig: ->
    one = 1
    one = 5
    @config =
      keyA: one
      keyB: one
      keyA: 2
  getConfig: ->
    @config =
      foo: 1

  @getConfig: ->
    config =
      foo: 1\
`,

        'should error by default': function (source) {
            // Moved to a variable to avoid lines being too long.
            const message = 'Duplicate key defined in object or class';
            const errors = coffeelint.lint(source);
            // Verify the two actual duplicate keys are found and it is not
            // mistaking @getConfig as a duplicate key
            assert.equal(errors.length, 2);
            let error = errors[0];
            assert.equal(error.lineNumber, 8); // 2nd getA
            assert.equal(error.message, message);
            assert.equal(error.rule, RULE);
            error = errors[1];
            assert.equal(error.lineNumber, 9); // 2nd getConfig
            assert.equal(error.message, message);
            return assert.equal(error.rule, RULE);
        },

        'is optional': function (source) {
            return (() => {
                const result = [];
                for (const length of [null, 0, false]) {
                    const config = {
                        duplicate_key: {
                            level: 'ignore',
                        },
                    };
                    const errors = coffeelint.lint(source, config);
                    result.push(assert.isEmpty(errors));
                }
                return result;
            })();
        },
    },

}).export(module);
