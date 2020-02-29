/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const path = require('path');
const vows = require('vows');
const assert = require('assert');
const coffeelint = require(path.join('..', 'lib', 'coffeelint'));

const RULE = 'cyclomatic_complexity';

// Return the cyclomatic complexity of a code snippet with one function.
const getComplexity = function(source) {
    const config = {cyclomatic_complexity: { level: 'error', value: 0 }};
    const errors = coffeelint.lint(source, config);
    assert.isNotEmpty(errors);
    assert.lengthOf(errors, 1);
    const error = errors[0];
    assert.equal(error.rule, RULE);
    return error.context;
};

vows.describe(RULE).addBatch({

    'Cyclomatic complexity': {
        topic:
            `\
x = ->
  1 and 2 and 3 and
  4 and 5 and 6 and
  7 and 8 and 9 and
  10 and 11\
`,

        'defaults to ignore'(source) {
            const errors = coffeelint.lint(source);
            assert.isArray(errors);
            return assert.isEmpty(errors);
        },

        'can be enabled'(source) {
            const config = {cyclomatic_complexity: { level: 'error' }};
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            assert.lengthOf(errors, 1);
            const error = errors[0];
            assert.equal(error.rule, RULE);
            assert.equal(error.context, 11);
            assert.equal(error.lineNumber, 1);
            return assert.equal(error.lineNumberEnd, 5);
        },

        'can be enabled with configurable complexity'(source) {
            const config = { cyclomatic_complexity: { level: 'error', value: 12 } };
            const errors = coffeelint.lint(source);
            assert.isArray(errors);
            return assert.isEmpty(errors);
        }
    },

    'An empty function': {
        topic:
            `\
x = () -> 1234\
`,

        'has a complexity of one'(source) {
            const complexity = getComplexity(source);
            return assert.equal(complexity, 1);
        }
    },

    'If statement': {
        topic:
            `\
x = () -> 2 if $ == true\
`,

        'increments the complexity'(source) {
            const complexity = getComplexity(source);
            return assert.equal(complexity, 2);
        }
    },


    'If Else statement': {
        topic:
            `\
y = -> if $ then 1 else 3\
`,

        'increments the complexity'(source) {
            const complexity = getComplexity(source);
            return assert.equal(complexity, 2);
        }
    },

    'If ElseIf statement': {
        topic:
            `\
x = ->
  if 1233
    'abc'
  else if 456
    'xyz'\
`,

        'has a complexity of three'(source) {
            const complexity = getComplexity(source);
            return assert.equal(complexity, 3);
        }
    },

    'If If-Else Else statement': {
        topic:
            `\
z = () ->
  if x
    1
  else if y
    2
  else
    3\
`,

        'has a complexity of three'(source) {
            const complexity = getComplexity(source);
            return assert.equal(complexity, 3);
        }
    },

    'Nested if statements': {
        topic:
            `\
z = () ->
  if abc?
    if other?
      123\
`,

        'has a complexity of three'(source) {
            const complexity = getComplexity(source);
            return assert.equal(complexity, 3);
        }
    },

    'A while loop': {
        topic:
            `\
x = () ->
  while 1
    'asdf'\
`,
        'increments complexity'(source) {
            const complexity = getComplexity(source);
            return assert.equal(complexity, 2);
        }
    },

    'An until loop': {
        topic:
            `\
x = () -> log 'a' until $?\
`,

        'increments complexity'(source) {
            const complexity = getComplexity(source);
            return assert.equal(complexity, 2);
        }
    },

    'A for loop': {
        topic:
            `\
x = () ->
  for i in window
    log i\
`,

        'increments complexity'(source) {
            const complexity = getComplexity(source);
            return assert.equal(complexity, 2);
        }
    },

    'A list comprehension': {
        topic:
            `\
x = -> [a for a in window]\
`,

        'increments complexity'(source) {
            const complexity = getComplexity(source);
            return assert.equal(complexity, 2);
        }
    },

    'Try / Catch blocks': {
        topic:
            `\
x = () ->
  try
    divide("byZero")
  catch error
    log("uh oh")\
`,

        'increments complexity'(source) {
            return assert.equal(getComplexity(source), 2);
        }
    },

    'Try / Catch / Finally blocks': {
        topic:
            `\
x = () ->
  try
    divide("byZero")
  catch error
    log("uh oh")
  finally
    clean()\
`,

        'increments complexity'(source) {
            return assert.equal(getComplexity(source), 2);
        }
    },

    'Switch statements without an else': {
        topic:
            `\
x = () ->
  switch a
    when "b" then "b"
    when "c" then "c"
    when "d" then "d"\
`,

        'increase complexity by the number of cases'(source) {
            const complexity = getComplexity(source);
            return assert.equal(complexity, 4);
        }
    },

    'Switch statements with an else': {
        topic:
            `\
x = () ->
  switch a
    when "b" then "b"
    when "c" then "c"
    when "d" then "d"
    else "e"\
`,

        'increase complexity by the number of cases'(source) {
            const complexity = getComplexity(source);
            return assert.equal(complexity, 4);
        }
    },

    'And operators': {
        topic:
            `\
x = () -> $ and window\
`,

        'increments the complexity'(source) {
            const complexity = getComplexity(source);
            return assert.equal(complexity, 2);
        }
    },

    'Or operators': {
        topic:
            `\
x = () -> $ or window\
`,

        'increments the complexity'(source) {
            const complexity = getComplexity(source);
            return assert.equal(complexity, 2);
        }
    },

    'Nested functions': {
        topic:
            `\
x = () ->
  a = () ->
    1 or 2\
`,

        'complexity are not aggregated into the parent function'(source) {
            const config = {cyclomatic_complexity: { level: 'error', value: 1 }};
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            assert.lengthOf(errors, 1);
            const error = errors[0];
            assert.equal(error.rule, RULE);
            assert.equal(error.lineNumber, 2);
            assert.equal(error.lineNumberEnd, 3);
            return assert.equal(error.context, 2);
        }
    },

    'A complicated example': {
        topic:
            `\
x = () ->
  if a and b and c or d and c or e
    if x or d or e of f
      1
  else if window
    while 1 and 3
      2
  while false
    y
  return false\
`,

        'works'(source) {
            const config = {cyclomatic_complexity: { level: 'error' }};
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            assert.lengthOf(errors, 1);
            const error = errors[0];
            assert.equal(error.rule, RULE);
            assert.equal(error.lineNumber, 1);
            assert.equal(error.lineNumberEnd, 10);
            return assert.equal(error.context, 14);
        }
    }

}).export(module);
