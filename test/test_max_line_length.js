/* eslint-disable
    func-names,
    import/no-dynamic-require,
    import/no-unresolved,
    no-restricted-syntax,
    no-return-assign,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
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

const RULE = 'max_line_length';
vows.describe(RULE).addBatch({

    'Maximum line length': {
        topic() {
            // Every line generated here is a comment.
            const line = (length) => `# ${new Array(length - 1).join('-')}`;
            const lengths = [50, 79, 80, 81, 100, 200];
            return (Array.from(lengths).map((l) => line(l))).join('\n');
        },

        'defaults to 80': function (source) {
            const errors = coffeelint.lint(source);
            assert.equal(errors.length, 3);
            const error = errors[0];
            assert.equal(error.lineNumber, 4);
            assert.equal(error.message, 'Line exceeds maximum allowed length');
            return assert.equal(error.rule, RULE);
        },

        'is configurable': function (source) {
            const config = {
                max_line_length: {
                    value: 99,
                    level: 'error',
                },
            };
            const errors = coffeelint.lint(source, config);
            return assert.equal(errors.length, 2);
        },

        'is optional': function (source) {
            return (() => {
                const result = [];
                for (const length of [null, 0, false]) {
                    const config = {
                        max_line_length: {
                            value: length,
                            level: 'ignore',
                        },
                    };
                    const errors = coffeelint.lint(source, config);
                    result.push(assert.isEmpty(errors));
                }
                return result;
            })();
        },

        'can ignore comments': function (source) {
            const config = {
                max_line_length: {
                    limitComments: false,
                },
            };

            const errors = coffeelint.lint(source, config);
            return assert.isEmpty(errors);
        },

        'respects Windows line breaks': function () {
            const source = `${new Array(81).join('X')}\r\n`;

            const errors = coffeelint.lint(source, {});
            return assert.isEmpty(errors);
        },
    },

    'Literate Line Length': {
        topic() {
            // This creates a line with 80 Xs.
            let source = `${new Array(81).join('X')}\n`;

            // Long URLs are ignored by default even in Literate code.
            return source += 'http://testing.example.com/really-really-long-url-'
                + 'that-shouldnt-have-to-be-split-to-avoid-the-lint-error';
        },

        'long urls are ignored': function (source) {
            const errors = coffeelint.lint(source, {}, true);
            return assert.isEmpty(errors);
        },
    },

    'Maximum length exceptions': {
        topic:
            `\
# Since the line length check only reads lines in isolation it will
# see the following line as a comment even though it's in a string.
# I don't think that's a problem.
#
# http://testing.example.com/really-really-long-url-that-shouldnt-have-to-be-split-to-avoid-the-lint-error\
`,

        'excludes long urls': function (source) {
            const errors = coffeelint.lint(source);
            return assert.isEmpty(errors);
        },
    },

}).export(module);
