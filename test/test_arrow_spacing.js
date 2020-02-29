/* eslint-disable
    func-names,
    import/no-dynamic-require,
    import/no-unresolved,
    no-dupe-keys,
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

const RULE = 'arrow_spacing';

vows.describe(RULE).addBatch({

    'No spacing around the arrow operator': {
        topic:
            `\
test1 = (foo, bar)->console.log("foobar")
test2 = (foo, bar) ->console.log("foo->bar")
test3 = (foo, bar)-> console.log("foo->bar")
test4 = (foo, bar)->
  console.log("foo->bar")
test5 = (foo, bar) ->
  console.log("foo->bar")
test6 = (foo, bar)=>@baz
test7 = (foo, bar) =>@baz
test8 = (foo, bar)=> @baz
test9 = (foo, bar)=>
  @baz
test10 = (foo, bar) =>
  @baz\
`,

        'will return an error': function (source) {
            const config = {
                indentation: { value: 2, level: 'error' },
                arrow_spacing: { level: 'error' },
            };
            const errors = coffeelint.lint(source, config);
            assert.equal(errors.length, 8);
            assert.equal(errors[0].lineNumber, 1);
            assert.equal(errors[1].lineNumber, 2);
            assert.equal(errors[2].lineNumber, 3);
            assert.equal(errors[3].lineNumber, 4);
            assert.equal(errors[4].lineNumber, 8);
            assert.equal(errors[5].lineNumber, 9);
            assert.equal(errors[6].lineNumber, 10);
            assert.equal(errors[7].lineNumber, 11);
            assert.equal(errors[0].rule, RULE);
            assert.equal(errors[1].rule, RULE);
            assert.equal(errors[2].rule, RULE);
            assert.equal(errors[3].rule, RULE);
            assert.equal(errors[4].rule, RULE);
            assert.equal(errors[5].rule, RULE);
            assert.equal(errors[6].rule, RULE);
            return assert.equal(errors[7].rule, RULE);
        },

        'will be ignored (no error)': function (source) {
            const config = { arrow_spacing: { level: 'ignore' } };
            const errors = coffeelint.lint(source, config);
            return assert.isEmpty(errors);
        },
    },

    'Handles good spacing when parentheses are generated': {
        topic:
            `\
testingThis
  .around ->
    -> 4

testingThis
  .around ->
    4

testingThis
  .around -> 4

testingThis =
  -> 5

testingThis.around (a, b) ->
  -> "4"
\
`,

        'when spacing is not required around arrow operator': function (source) {
            const config = {
                indentation: { value: 2, level: 'error' },
                arrow_spacing: { level: 'ignore' },
            };
            const errors = coffeelint.lint(source, config);
            return assert.isEmpty(errors);
        },

        'when spacing is required around arrow operator': function (source) {
            const config = {
                indentation: { value: 2, level: 'error' },
                arrow_spacing: { level: 'error' },
            };
            const errors = coffeelint.lint(source, config);
            return assert.isEmpty(errors);
        },
    },

    'Handles bad spacing when parentheses are generated': {
        topic:
            `\
testingThis
  .around ->
    ->4

testingThis
  .around ->4

testingThis =
  ->5

testingThis.around (a, b) ->
  ->"4"

testingThis ->-> "X"

testingThis ->->"X"\
`,

        'when spacing is required around arrow operator': function (source) {
            const config = { arrow_spacing: { level: 'error' } };
            const errors = coffeelint.lint(source, config);
            assert.equal(errors[0].lineNumber, 3);
            assert.equal(errors[1].lineNumber, 6);
            assert.equal(errors[2].lineNumber, 9);
            assert.equal(errors[3].lineNumber, 12);
            assert.equal(errors[4].lineNumber, 14);
            assert.equal(errors[5].lineNumber, 16);
            assert.equal(errors[6].lineNumber, 16);
            for (const { rule } of Array.from(errors)) { assert.equal(rule, RULE); }
            return assert.lengthOf(errors, 7);
        },

        'when spacing is not required around arrow operator': function (source) {
            const config = { arrow_spacing: { level: 'ignore' } };
            const errors = coffeelint.lint(source, config);
            return assert.isEmpty(errors);
        },
    },

    'Ignore spacing for non-generated parentheses': {
        // if the function has no parameters (and thus no parentheses),
        // it will accept a lack of spacing preceding the arrow (first example)
        topic:
            `\
x(-> 3)
x( -> 3)
x((a,b) -> c)
(-> true)()\
`,
        'when spacing is required around arrow operator': function (source) {
            const config = { arrow_spacing: { level: 'error' } };
            const errors = coffeelint.lint(source, config);
            return assert.equal(errors.length, 0);
        },

        'when spacing is not required around arrow operator': function (source) {
            const config = { arrow_spacing: { level: 'ignore' } };
            const errors = coffeelint.lint(source, config);
            return assert.isEmpty(errors, 0);
        },
    },

    'Handle an arrow at beginning of statement': {
        topic:
            `\
@waitForSelector ".application",
  -> @test.pass "homepage loaded ok"
  -> @test.fail "homepage didn't load"
  2000\
`,

        'when spacing is required around arrow operator': function (source) {
            const config = { arrow_spacing: { level: 'error' } };
            const errors = coffeelint.lint(source, config);
            return assert.equal(errors.length, 0);
        },

        'when spacing is not required around arrow operator': function (source) {
            const config = { arrow_spacing: { level: 'ignore' } };
            const errors = coffeelint.lint(source, config);
            return assert.isEmpty(errors, 0);
        },
    },

    'Handle an empty arrow at end of expression': {
        topic:
            `\
(x = ->)
{x: ->}
(x: ->)\
`,

        'when spacing is required around arrow operator': function (source) {
            const config = { arrow_spacing: { level: 'error' } };
            const errors = coffeelint.lint(source, config);
            return assert.equal(errors.length, 0);
        },

        'when spacing is not required around arrow operator': function (source) {
            const config = { arrow_spacing: { level: 'ignore' } };
            const errors = coffeelint.lint(source, config);
            return assert.isEmpty(errors, 0);
        },
    },

    'Handle a nested arrow at end of file': {
        topic:
            '\
class A\n  f: ->\
',

        'when spacing is required around arrow operator': function (source) {
            const config = { arrow_spacing: { level: 'error' } };
            const errors = coffeelint.lint(source, config);
            return assert.equal(errors.length, 0);
        },

        'when spacing is not required around arrow operator': function (source) {
            const config = { arrow_spacing: { level: 'ignore' } };
            const errors = coffeelint.lint(source, config);
            return assert.isEmpty(errors, 0);
        },
    },

    'Handle a nested arrow at end of file': {
        topic:
            '\
define ->\n  class A\n    f: ->\
',

        'when spacing is required around arrow operator': function (source) {
            const config = { arrow_spacing: { level: 'error' } };
            const errors = coffeelint.lint(source, config);
            return assert.equal(errors.length, 0);
        },

        'when spacing is not required around arrow operator': function (source) {
            const config = { arrow_spacing: { level: 'ignore' } };
            const errors = coffeelint.lint(source, config);
            return assert.isEmpty(errors, 0);
        },
    },

    'Handle an arrow at end of file': {
        topic:
            '\
f: ->\
',

        'when spacing is required around arrow operator': function (source) {
            const config = { arrow_spacing: { level: 'error' } };
            const errors = coffeelint.lint(source, config);
            return assert.equal(errors.length, 0);
        },

        'when spacing is not required around arrow operator': function (source) {
            const config = { arrow_spacing: { level: 'ignore' } };
            const errors = coffeelint.lint(source, config);
            return assert.isEmpty(errors, 0);
        },
    },

    'Handles empty functions': {
        topic:
            '\
console ?= log: (->), error: (->)\
',

        'when spacing is required around arrow operator': function (source) {
            const config = { arrow_spacing: { level: 'error' } };
            const errors = coffeelint.lint(source, config);
            return assert.equal(errors.length, 0);
        },
    },

    'Handle an arrow at beginning of file': {
        topic:
            '\
-> foo()\
',

        'when spacing is required around arrow operator': function (source) {
            const config = { arrow_spacing: { level: 'error' } };
            const errors = coffeelint.lint(source, config);
            return assert.equal(errors.length, 0);
        },

        'when spacing is not required around arrow operator': function (source) {
            const config = { arrow_spacing: { level: 'ignore' } };
            const errors = coffeelint.lint(source, config);
            return assert.isEmpty(errors, 0);
        },
    },

}).export(module);
