/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const path = require('path');
const vows = require('vows');
const assert = require('assert');
const coffeelint = require(path.join('..', 'lib', 'coffeelint'));

const configError = { no_this: { level: 'error' } };

const RULE = 'no_this';

vows.describe(RULE).addBatch({

    'this': {
        'should warn when \'this\' is used'() {
            const result = coffeelint.lint('this.foo()', configError)[0];
            assert.equal(result.lineNumber, 1);
            return assert.equal(result.rule, RULE);
        }
    },

    '@': {
        'should not warn when \'@\' is used'() {
            return assert.isEmpty(coffeelint.lint('@foo()', configError));
        }
    },

    'Comments': {
        topic:
            `\
# this.foo()
###
this.foo()
###\
`,

        'should not warn when \'this\' is used in a comment'(source) {
            return assert.isEmpty(coffeelint.lint(source, configError));
        }
    },

    'Strings': {
        'should not warn when \'this\' is used in a single-quote string'() {
            return assert.isEmpty(coffeelint.lint('\'this.foo()\'', configError));
        },

        'should not warn when \'this\' is used in a double-quote string'() {
            return assert.isEmpty(coffeelint.lint('"this.foo()"', configError));
        },

        'should not warn when \'this\' is used in a multiline string'() {
            const source = `\
"""
this.foo()
"""\
`;
            return assert.isEmpty(coffeelint.lint(source, configError));
        }
    },

    'Compatibility with no_stand_alone_at': {
        topic:
            `\
class X
  constructor: ->
    this

class Y extends X
  constructor: ->
    this.hello
\
`,

        'returns an error if no_stand_alone_at is on ignore'(source) {
            const config = {
                no_stand_alone_at: {
                    level: 'ignore'
                },
                no_this: {
                    level: 'error'
                }
            };

            const errors = coffeelint.lint(source, config);
            assert.equal(errors.length, 2);
            let error = errors[0];
            assert.equal(error.lineNumber, 3);
            assert.equal(error.rule, RULE);

            error = errors[1];
            assert.equal(error.lineNumber, 7);
            return assert.equal(error.rule, RULE);
        },

        'returns no errors if no_stand_alone_at is on warn/error'(source) {
            let config = {
                no_stand_alone_at: {
                    level: 'warn'
                },
                no_this: {
                    level: 'error'
                }
            };

            let errors = coffeelint.lint(source, config);
            assert.equal(errors.length, 1);

            let error = errors[0];
            assert.equal(error.lineNumber, 7);
            assert.equal(error.rule, RULE);

            config = {
                no_stand_alone_at: {
                    level: 'error'
                },
                no_this: {
                    level: 'error'
                }
            };

            errors = coffeelint.lint(source, config);
            assert.equal(errors.length, 1);

            error = errors[0];
            assert.equal(error.lineNumber, 7);
            return assert.equal(error.rule, RULE);
        }
    }

}).export(module);
