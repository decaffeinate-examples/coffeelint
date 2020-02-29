/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const path = require('path');
const vows = require('vows');
const assert = require('assert');
const coffeelint = require(path.join('..', 'lib', 'coffeelint'));

const runLint = function(source) {
    const config = { no_unnecessary_fat_arrows: { level: 'error' } };
    return coffeelint.lint(source, config);
};

const shouldError = function(source, numErrors) {
    if (numErrors == null) { numErrors = 1; }
    return {
        topic: source,

        'errors for unnecessary arrow'(source) {
            const errors = runLint(source);
            assert.lengthOf(errors, numErrors, `Expected ${numErrors} errors`);
            const error = errors[0];
            return assert.equal(error.rule, RULE);
        }
    };
};

const shouldPass = source => ({
    topic: source,

    'does not error for necessary arrow'(source) {
        const errors = runLint(source);
        return assert.isEmpty(errors, `Expected no errors, got ${errors}`);
    }
});

var RULE = 'no_unnecessary_fat_arrows';

vows.describe(RULE).addBatch({

    'empty function': shouldError('=>'),
    'simple function': shouldError('=> 1'),
    'function with this': shouldPass('=> this'),
    'function with this.a': shouldPass('=> this.a'),
    'function with @': shouldPass('=> @'),
    'function with @a': shouldPass('=> @a'),

    'nested simple functions': {
        'with inner fat arrow': shouldError('-> => 1'),
        'with outer fat arrow': shouldError('=> -> 1'),
        'with both fat arrows': shouldError('=> => 1', 2)
    },

    'nested functions with this inside': {
        'with inner fat arrow': shouldPass('-> => this'),
        'with outer fat arrow': shouldError('=> -> this'),
        'with both fat arrows': shouldPass('=> => this')
    },

    'nested functions with this outside': {
        'with inner fat arrow': shouldError('-> (this; =>)'),
        'with outer fat arrow': shouldPass('=> (this; ->)'),
        'with both fat arrows': shouldError('=> (this; =>)')
    },

    'deeply nested simple function': shouldError('-> -> -> -> => 1'),
    'deeply nested function with this': shouldPass('-> -> -> -> => this'),

    'functions with multiple statements': shouldError(`\
f = ->
  x = 2
  z ((a) => x; a)\
`
    ),

    'functions with parameters': shouldError('(a) =>'),
    'functions with parameter assignment': shouldPass('(@a) =>'),
    'functions with destructuring parameter assignment': shouldPass('({@a}) =>'),

    'RequireJS modules containing classes with static methods': shouldPass(`\
define [], ->
  class MyClass
    @omg: ->
\
`
    )

}).export(module);
