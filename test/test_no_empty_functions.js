/* eslint-disable
    func-names,
    import/no-dynamic-require,
    import/no-unresolved,
    max-len,
    no-param-reassign,
    no-shadow,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const path = require('path');
const vows = require('vows');
const assert = require('assert');

const coffeelint = require(path.join('..', 'lib', 'coffeelint'));

const RULE = 'no_empty_functions';

const runLint = function (source) {
    const config = { no_empty_functions: { level: 'error' } };
    return coffeelint.lint(source, config);
};

const shouldError = function (source, numErrors, errorNames) {
    if (numErrors == null) { numErrors = 1; }
    if (errorNames == null) { errorNames = ['no_empty_functions']; }
    return {
        topic: source,
        'errors for empty function': function (source) {
            const errors = runLint(source);
            assert.lengthOf(errors, numErrors, `Expected ${numErrors} errors, got \
[${errors.map((error) => error.name).join(', ')}] instead`);
            return Array.from(errorNames).map((errorName) => assert.notEqual(errors.indexOf(errorName, -1)));
        },
    };
};

const shouldPass = (source) => ({
    topic: source,

    'does not error for empty function': function (source) {
        const errors = runLint(source);
        return assert.isEmpty(errors, `Expected no errors, got \
[${errors.map((error) => error.name).join(', ')}] instead`);
    },
});

vows.describe(RULE).addBatch({
    'empty fat-arrow function': shouldError(
        '=>', 2,
    ),
    'empty function': shouldError(
        '->',
    ),
    'function with undefined statement': shouldPass(
        '-> undefined',
    ),
    'function within function with undefined statement': shouldPass(
        '-> -> undefined',
    ),
    'empty fat arrow function within a function ': shouldError(
        '-> =>', 2,
    ),
    'empty function within a function ': shouldError(
        '-> ->',
    ),
    "empty function as param's default value": shouldError(
        'foo = (empty=(->)) -> undefined',
    ),
    "non-empty function as param's default value": shouldPass(
        'foo = (empty=(-> undefined)) -> undefined',
    ),
    'empty function with implicit instance member assignment as param':
        shouldError('foo = (@_fooMember) ->'),

}).export(module);
