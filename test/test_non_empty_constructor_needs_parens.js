/* eslint-disable
    func-names,
    import/no-dynamic-require,
    import/no-unresolved,
    no-restricted-syntax,
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

const RULE = 'non_empty_constructor_needs_parens';

vows.describe(RULE).addBatch({

    'Missing Parentheses on "new Foo 1, 2"': {
        topic:
            `\
class Foo

a = new Foo
b = new Foo()
# Warn about missing parens here
c = new Foo 1, 2
d = new Foo
  config: 'parameter'
e = new bar.foo.Foo 1, 2
f = new bar.foo.Foo
  config: 'parameter'
# But not here
g = new Foo(1, 2)
h = new Foo(
  config: 'parameter'
)
i = new bar.foo.Foo(1, 2)
j = new bar.foo.Foo(
  config: 'parameter'
)\
`,

        'warns about missing parens': function (source) {
            const config = {
                non_empty_constructor_needs_parens: {
                    level: 'error',
                },
            };

            const errors = coffeelint.lint(source, config);
            assert.equal(errors.length, 4);
            assert.equal(errors[0].lineNumber, 6);
            assert.equal(errors[1].lineNumber, 7);
            assert.equal(errors[2].lineNumber, 9);
            assert.equal(errors[3].lineNumber, 10);
            return (() => {
                const result = [];
                for (const { rule } of Array.from(errors)) {
                    result.push(assert.equal(rule, RULE));
                }
                return result;
            })();
        },
    },

}).export(module);
