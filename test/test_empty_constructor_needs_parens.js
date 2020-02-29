/* eslint-disable
    func-names,
    import/no-dynamic-require,
    import/no-unresolved,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const path = require('path');
const vows = require('vows');
const assert = require('assert');

const coffeelint = require(path.join('..', 'lib', 'coffeelint'));

const RULE = 'empty_constructor_needs_parens';

vows.describe(RULE).addBatch({

    'Make sure no errors if constructors are indexed (#421)': {
        topic:
            `\
new OPERATIONS[operationSpec.type] operationSpec.field

new Foo[bar].baz[qux] param1\
`,

        'should pass': function (source) {
            const config = {
                empty_constructor_needs_parens: {
                    level: 'error',
                },
            };
            const errors = coffeelint.lint(source, config);
            return assert.equal(errors.length, 0);
        },
    },

    'Missing Parentheses on "new Foo"': {
        topic:
            `\
class Foo

# Warn about missing parens here
a = new Foo
b = new bar.foo.Foo
# The parens make it clear no parameters are intended
c = new Foo()
d = new bar.foo.Foo()
e = new Foo 1, 2
f = new bar.foo.Foo 1, 2
# Since this does have a parameter it should not require parens
g = new bar.foo.Foo
  config: 'parameter'\
`,

        'warns about missing parens': function (source) {
            const config = {
                empty_constructor_needs_parens: {
                    level: 'error',
                },
            };
            const errors = coffeelint.lint(source, config);
            assert.equal(errors.length, 2);
            assert.equal(errors[0].lineNumber, 4);
            assert.equal(errors[0].rule, RULE);
            assert.equal(errors[1].lineNumber, 5);
            return assert.equal(errors[1].rule, RULE);
        },
    },

}).export(module);
