/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const path = require('path');
const vows = require('vows');
const assert = require('assert');
const coffeelint = require(path.join('..', 'lib', 'coffeelint'));

const configError = {eol_last: { level: 'error' }};

const RULE = 'eol_last';

vows.describe(RULE).addBatch({

    'eol': {
        'should not warn by default'() {
            return assert.isEmpty(coffeelint.lint('foobar'));
        },

        'should warn when enabled'() {
            const result = coffeelint.lint('foobar', configError);
            assert.equal(result.length, 1);
            assert.equal(result[0].level, 'error');
            return assert.equal(result[0].rule, RULE);
        },

        'should warn when enabled with multiple newlines'() {
            const result = coffeelint.lint('foobar\n\n', configError);
            assert.equal(result.length, 1);
            assert.equal(result[0].level, 'error');
            return assert.equal(result[0].rule, RULE);
        },

        'should not warn with newline'() {
            return assert.isEmpty(coffeelint.lint('foobar\n', configError));
        }
    }

}).export(module);
