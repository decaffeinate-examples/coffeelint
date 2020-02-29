/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const path = require('path');
const vows = require('vows');
const assert = require('assert');
const coffeelint = require(path.join('..', 'lib', 'coffeelint'));

let configError = { prefer_english_operator: { level: 'error' } };

const RULE = 'prefer_english_operator';

vows.describe(RULE).addBatch({

    'non-English operators': {
        'should warn when == is used'() {
            const result = coffeelint.lint('1 == 1', configError)[0];
            return assert.equal(result.context, 'Replace "==" with "is"');
        },

        'should warn when != is used'() {
            const result = coffeelint.lint('1 != 1', configError)[0];
            return assert.equal(result.context, 'Replace "!=" with "isnt"');
        },

        'should warn when && is used'() {
            const result = coffeelint.lint('1 && 1', configError)[0];
            return assert.equal(result.context, 'Replace "&&" with "and"');
        },

        'should warn when || is used'() {
            const result = coffeelint.lint('1 || 1', configError)[0];
            return assert.equal(result.context, 'Replace "||" with "or"');
        },

        'should warn when ! is used'() {
            const result = coffeelint.lint('x = !y', configError)[0];
            return assert.equal(result.context, 'Replace "!" with "not"');
        }
    },

    'double not (!!)': {
        'is ignored by default'() {
            const result = coffeelint.lint('x = !!y', configError);
            return assert.equal(result.length, 0);
        },

        'can be configred at an independent level'() {
            configError = {
                prefer_english_operator: {
                    level: 'error',
                    doubleNotLevel: 'warn'
                }
            };

            const result = coffeelint.lint('x = !!y', configError);
            assert.equal(result.length, 1);
            assert.equal(result[0].level, 'warn');
            return assert.equal(result[0].rule, RULE);
        }
    },

    'English operators': {
        'should not warn when \'is\' is used'() {
            return assert.isEmpty(coffeelint.lint('1 is 1', configError));
        },

        'should not warn when \'isnt\' is used'() {
            return assert.isEmpty(coffeelint.lint('1 isnt 1', configError));
        },

        'should not warn when \'and\' is used'() {
            return assert.isEmpty(coffeelint.lint('1 and 1', configError));
        },

        'should not warn when \'or\' is used'() {
            return assert.isEmpty(coffeelint.lint('1 or 1', configError));
        }
    },

    'Comments'() {
        return {
            topic:
                `\
# 1 == 1
# 1 != 1
# 1 && 1
# 1 || 1
###
1 == 1
1 != 1
1 && 1
1 || 1
###\
`,

            'should not warn when == is used in a comment'(source) {
                return assert.isEmpty(coffeelint.lint(source, configError));
            }
        };
    },

    'Strings': {
        'should not warn when == is used in a single-quote string'() {
            return assert.isEmpty(coffeelint.lint('\'1 == 1\'', configError));
        },

        'should not warn when == is used in a double-quote string'() {
            return assert.isEmpty(coffeelint.lint('"1 == 1"', configError));
        },

        'should not warn when == is used in a multiline string'() {
            const source = `\
"""
1 == 1
"""\
`;
            return assert.isEmpty(coffeelint.lint(source, configError));
        }
    }

}).export(module);
