/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const path = require('path');
const vows = require('vows');
const assert = require('assert');
const coffeelint = require(path.join('..', 'lib', 'coffeelint'));

const RULE = 'no_implicit_parens';

vows.describe(RULE).addBatch({

    'Implicit parens': {
        topic:
            `\
console.log 'implict parens'
blah = (a, b) ->
blah 'a', 'b'

class A
  @configure(1, 2, 3)

  constructor: ->

class B
  _defaultC = 5

  constructor: (a) ->
    @c = a ? _defaultC\
`,

        'are allowed by default'(source) {
            const errors = coffeelint.lint(source);
            assert.isArray(errors);
            return assert.isEmpty(errors);
        },

        'can be forbidden'(source) {
            const config = {no_implicit_parens: { level: 'error' }};
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            assert.lengthOf(errors, 2);
            const error = errors[0];
            assert.equal(error.lineNumber, 1);
            assert.equal(error.message, 'Implicit parens are forbidden');
            return assert.equal(error.rule, RULE);
        }
    },

    'No implicit parens strict': {
        topic:
            `\
blah = (a) ->
blah
  foo: 'bar'

blah = (a, b) ->
blah 'a'
, 'b'\
`,

        'blocks all implicit parens by default'(source) {
            const config = {no_implicit_parens: { level: 'error' }};
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            assert.lengthOf(errors, 2);
            return (() => {
                const result = [];
                for (let { rule } of Array.from(errors)) {                     result.push(assert.equal(rule, RULE));
                }
                return result;
            })();
        },

        'allows parens at the end of lines when strict is false'(source) {
            const config = {
                no_implicit_parens: {
                    level: 'error',
                    strict: false
                }
            };
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            return assert.isEmpty(errors);
        }
    },

    'Nested no implicit parens strict': {
        topic:
            `\
blah = (a) ->
blah
  foo: blah('a')

blah = (a, b) ->

blah 'a'
, blah('c', 'd')

blah 'a'
, (blah 'c'
, 'd')\
`,

        'blocks all implicit parens by default'(source) {
            const config = {no_implicit_parens: { level: 'error' }};
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            assert.lengthOf(errors, 4);
            return (() => {
                const result = [];
                for (let { rule } of Array.from(errors)) {                     result.push(assert.equal(rule, RULE));
                }
                return result;
            })();
        },

        'allows parens at the end of lines when strict is false'(source) {
            const config = {
                no_implicit_parens: {
                    level: 'error',
                    strict: false
                }
            };
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            return assert.isEmpty(errors);
        }
    },

    'Test for when implicit parens are on the last line': {
        topic:
            `\
class Something
  constructor: ->
    return $ '#something'

  yo: ->

class AnotherSomething
  constructor: ->
    return $ '#something'

blah 'a'
, blah('c', 'd')\
`,

        'throws three errors when strict is true'(source) {
            const config = {
                no_implicit_parens: {
                    level: 'error',
                    strict: true
                }
            };

            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            assert.lengthOf(errors, 3);
            assert.equal(errors[0].rule, RULE);
            assert.equal(errors[1].rule, RULE);
            return assert.equal(errors[2].rule, RULE);
        },

        // When implicit parens are separated out on multiple lines
        // and strict is set to false, do not return an error.
        'throws two errors when strict is false'(source) {
            const config = {
                no_implicit_parens: {
                    level: 'error',
                    strict: false
                }
            };

            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            assert.lengthOf(errors, 2);
            assert.equal(errors[0].rule, RULE);
            return assert.equal(errors[1].rule, RULE);
        }
    }

}).export(module);
