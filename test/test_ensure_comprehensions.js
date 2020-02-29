/* eslint-disable
    func-names,
    import/no-dynamic-require,
    import/no-unresolved,
    no-multi-str,
    prefer-destructuring,
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

const RULE = 'ensure_comprehensions';
const errorMessage = 'Comprehensions must have parentheses around them';
const config = {};

vows.describe(RULE).addBatch({

    'Ignore for-loops': {
        topic:
            `\
y = y + 5

for x in xlist
  console.log x

if a is b
  for x in xlist
    console.log x\
`,

        'are ignored': function (source) {
            config[RULE] = { level: 'error' };
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            return assert.isEmpty(errors);
        },
    },

    'When forgetting parens': {
        topic:
            `\
for x in xlist
  console.log x

doubleIt = x * 2 for x in singles

if a is b
  for x in xlist
    console.log x\
`,

        'throws an error': function (source) {
            config[RULE] = { level: 'error' };

            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            assert.lengthOf(errors, 1);

            const error = errors[0];
            assert.equal(error.lineNumber, 4);
            assert.equal(error.message, errorMessage);
            return assert.equal(error.rule, RULE);
        },

        'doesn\'t throw an error when rule is ignore': function (source) {
            config[RULE] = { level: 'ignore' };
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            return assert.isEmpty(errors);
        },
    },

    'Doesn\'t trigger if we encounter key/value of the loop before equal sign': {
        topic:
            `\
sum = 0
nums = [1, 2, 3, 4, 5]
for n in nums
  sum += n

sum = n for n in nums # error triggers without parens

# this triggers for lack of parens as well
x = y(food) for food in foods when food isnt 'chocolate'

# this shouldn't trigger
yak(food) for food in foods when food isnt 'chocolate'

newConfig[key] = value for key, value of config\
`,

        'doesn\'t throw an error': function (source) {
            config[RULE] = { level: 'error' };
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            assert.lengthOf(errors, 2);

            let error = errors[0];
            assert.equal(error.lineNumber, 6);
            assert.equal(error.message, errorMessage);
            assert.equal(error.rule, RULE);

            error = errors[1];
            assert.equal(error.lineNumber, 9);
            assert.equal(error.message, errorMessage);
            return assert.equal(error.rule, RULE);
        },
    },

    'Doesn\'t trigger if we encounter key/value and there is no equal sign': {
        topic:
            `\
sum = 0
nums = [1, 2, 3, 4, 5]
for n in nums
  sum += n

sum += n for n in nums

eat food for food in foods when food isnt 'chocolate'\
`,

        'doesn\'t throw an error': function (source) {
            config[RULE] = { level: 'error' };
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            return assert.isEmpty(errors);
        },
    },

    'Doesn\'t trigger when variable is set to a for-loop with a block': {
        topic:
            `\
myLines = for row in [start..end]
  if row[start] is ' '
    line = true
  else
    line = false
  line\
`,

        'doesn\'t throw an error': function (source) {
            config[RULE] = { level: 'error' };
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            return assert.isEmpty(errors);
        },
    },

    'Functions return all comprehensions as an array': {
        topic:
            `\
myLines = ->
  (row[start] + "!" for row in [start..end])

myLines = ->
  row[start] + "!" for row in [start..end]

myLines = -> row[start] + "!" for row in [start..end]

myLines = -> (row[start] + "!" for row in [start..end])
\
`,

        'doesn\'t throw an error': function (source) {
            config[RULE] = { level: 'error' };
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            return assert.isEmpty(errors);
        },
    },

    'Comprehensions that are called as a function parameter should not error': {
        topic:
            '\
b = a(food for food in foods when food isnt \'chocolate\')\
',

        'doesn\'t throw an error': function (source) {
            config[RULE] = { level: 'error' };
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            return assert.isEmpty(errors);
        },
    },

    "Nested loops don't trigger errors unless set to something": {
        topic:
            `\
# FINE
((transform(col) for cols, col of rows) for rows in mtx)
matrix = ((col for cols, col of rows) for rows in mtx)
matrix2 = (col for cols, col of rows for rows in mtx)
((nobj[key] = val for own key, val of obj) for obj in objects)

# BAD
matrix3 = k for k,v in mtx\
`,

        'doesn\'t throw an error': function (source) {
            config[RULE] = { level: 'error' };
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            assert.lengthOf(errors, 1);

            const error = errors[0];
            assert.equal(error.lineNumber, 8);
            assert.equal(error.message, errorMessage);
            return assert.equal(error.rule, RULE);
        },
    },

}).export(module);
