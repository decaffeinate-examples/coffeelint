/* eslint-disable
    func-names,
    import/no-dynamic-require,
    import/no-unresolved,
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

const RULE = 'colon_assignment_spacing';

vows.describe(RULE).addBatch({

    'Equal spacing around assignment': {
        topic:
            `\
object = {spacing : true}
class Dog
  barks : true
stringyObject =
  'stringkey' : 'ok'\
`,

        'will not return an error': function (source) {
            const config = {
                colon_assignment_spacing: {
                    level: 'error',
                    spacing: {
                        left: 1,
                        right: 1,
                    },
                },
            };
            const errors = coffeelint.lint(source, config);
            return assert.isEmpty(errors);
        },
    },

    'No space before assignment': {
        topic:
            `\
object = {spacing: true}
object =
  spacing: true
class Dog
  barks: true
stringyObject =
  'stringkey': 'ok'\
`,

        'will not return an error': function (source) {
            const config = {
                colon_assignment_spacing: {
                    level: 'error',
                    spacing: {
                        left: 0,
                        right: 1,
                    },
                },
            };
            const errors = coffeelint.lint(source, config);
            return assert.isEmpty(errors);
        },
    },

    'Newline to the right of assignment': {
        topic:
            `\
query:
  method: 'GET'
  isArray: false\
`,

        'will not return an error': function (source) {
            const config = {
                colon_assignment_spacing: {
                    level: 'error',
                    spacing: {
                        left: 0,
                        right: 1,
                    },
                },
            };
            const errors = coffeelint.lint(source, config);
            return assert.isEmpty(errors);
        },
    },

    'Improper spacing around assignment': {
        topic:
            `\
object = {spacing: false}
class Cat
  barks: false
stringyObject =
  'stringkey': 'notcool'\
`,

        'will return an error': function (source) {
            const config = {
                colon_assignment_spacing: {
                    level: 'error',
                    spacing: {
                        left: 1,
                        right: 1,
                    },
                },
            };
            const errors = coffeelint.lint(source, config);
            for (const { rule } of Array.from(errors)) { assert.equal(rule, RULE); }
            return assert.lengthOf(errors, 3);
        },

        'will ignore an error': function (source) {
            const config = {
                colon_assignment_spacing: {
                    level: 'ignore',
                    spacing: {
                        left: 1,
                        right: 1,
                    },
                },
            };
            const errors = coffeelint.lint(source, config);
            return assert.isEmpty(errors);
        },
    },

    'Should not complain about strings': {
        topic:
            `\
foo = (stuff) ->
  throw new Error("Error: stuff required") unless stuff?
  # do real work\
`,

        'will return an error': function (source) {
            const config = {
                colon_assignment_spacing: {
                    level: 'error',
                    spacing: {
                        left: 1,
                        right: 1,
                    },
                },
            };
            const errors = coffeelint.lint(source, config);
            return assert.isEmpty(errors);
        },
    },

}).export(module);
