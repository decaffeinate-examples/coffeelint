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

const RULE = 'no_tabs';

vows.describe(RULE).addBatch({

    'Tabs': {
        topic:
            `\
x = () ->
\ty = () ->
\t\treturn 1234\
`,

        'can be forbidden'(source) {
            const errors = coffeelint.lint(source);
            assert.equal(errors.length, 4);
            const error = errors[1];
            assert.equal(error.lineNumber, 2);
            assert.equal(error.message, 'Line contains tab indentation');
            return assert.equal(error.rule, RULE);
        },

        'can be permitted'(source) {
            const config = {
                no_tabs: { level: 'ignore' },
                indentation: { level: 'error', value: 1 }
            };

            const errors = coffeelint.lint(source, config);
            return assert.equal(errors.length, 0);
        },

        'are forbidden by default'(source) {
            const config = {indentation: { level: 'error', value: 1 }};
            const errors = coffeelint.lint(source, config);
            assert.isArray(errors);
            assert.equal(errors.length, 2);
            return (() => {
                const result = [];
                for (let { rule } of Array.from(errors)) {                     result.push(assert.equal(rule, RULE));
                }
                return result;
            })();
        },

        'are allowed in strings'() {
            const source = "x = () -> '\t'";
            const errors = coffeelint.lint(source);
            return assert.equal(errors.length, 0);
        }
    },

    'Tabs in multi-line strings': {
        topic:
            `\
x = 1234
y = """
\t\tasdf
"""\
`,

        'are ignored'(errors) {
            errors = coffeelint.lint(errors);
            return assert.isEmpty(errors);
        }
    },

    'Tabs in Heredocs': {
        topic:
            `\
###
\t\tMy Heredoc
###\
`,

        'are ignored'(errors) {
            errors = coffeelint.lint(errors);
            return assert.isEmpty(errors);
        }
    },

    'Tabs in multi line regular expressions': {
        topic:
            `\
///
\t\tMy Heredoc
///\
`,

        'are ignored'(errors) {
            errors = coffeelint.lint(errors);
            return assert.isEmpty(errors);
        }
    }

}).export(module);
