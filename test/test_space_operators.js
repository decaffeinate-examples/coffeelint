/* eslint-disable
    func-names,
    import/no-dynamic-require,
    import/no-unresolved,
    max-len,
    no-plusplus,
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

const RULE = 'space_operators';

vows.describe(RULE).addBatch({

    'No spaces around binary operators': {
        topic:
            `\
x= 1
1+ 1
1- 1
1/ 1
1* 1
1== 1
1>= 1
1> 1
1< 1
1<= 1
1% 1
(a= 'b') -> a
a| b
a& b
a*= -5
a*= -b
a*= 5
a*= a
-a+= -2
-a+= -a
-a+= 2
-a+= a
a* -b
a** b
a// b
a%% b
x =1
1 +1
1 -1
1 /1
1 *1
1 ==1
1 >=1
1 >1
1 <1
1 <=1
1 %1
(a ='b') -> a
a |b
a &b
a *=-5
a *=-b
a *=5
a *=a
-a +=-2
-a +=-a
-a +=2
-a +=a
a *-b
a **b
a //b
a %%b
x=1
1+1
1-1
1/1
1*1
1==1
1>=1
1>1
1<1
1<=1
1%1
(a='b') -> a
a|b
a&b
a*=-5
a*=-b
a*=5
a*=a
-a+=-2
-a+=-a
-a+=2
-a+=a
a*-b
a**b
a//b
a%%b\
`,

        'are permitted by default': function (source) {
            const config = { no_nested_string_interpolation: { level: 'ignore' } };
            const errors = coffeelint.lint(source, config);
            return assert.isEmpty(errors);
        },

        'can be forbidden': function (source) {
            const config = {
                space_operators: { level: 'error' },
                no_nested_string_interpolation: { level: 'ignore' },
            };

            const errors = coffeelint.lint(source, config);
            const sources = source.split('\n');

            for (let i = 0; i < errors.length; i++) { const err = errors[i]; assert.equal(err.line, sources[i]); }
            assert.equal(errors.length, sources.length);

            const error = errors[0];
            assert.equal(error.rule, RULE);
            assert.equal(error.lineNumber, 1);
            return assert.equal(error.message, 'Operators must be spaced properly');
        },
    },

    'Correctly spaced operators': {
        topic:
            `\
x = 1
1 + 1
1 - 1
1 / 1
1 * 1
1 == 1
1 >= 1
1 > 1
1 < 1
1 <= 1
(a = 'b') -> a
+1
-1
y = -2
x = -1
y = x++
x = y++
1 + (-1)
-1 + 1
x(-1)
x(-1, 1, -1)
x[..-1]
x[-1..]
x[-1...-1]
1 < -1
a if -1
a unless -1
a if -1 and 1
a if -1 or 1
1 and -1
1 or -1
"#{a}#{b}"
"#{"#{a}"}#{b}"
[+1, -1]
[-1, +1]
{a: -1}
/// #{a} ///
if -1 then -1 else -1
a | b
a & b
a *= 5
a *= -5
a *= b
a *= -b
-a *= 5
-a *= -5
-a *= b
-a *= -b
a * -b
a ** b
a // b
a %% b
return -1
for x in xs by -1 then x

switch x
  when -1 then 42\
`,

        'are permitted': function (source) {
            const config = {
                space_operators: { level: 'error' },
                no_nested_string_interpolation: { level: 'ignore' },
            };

            const errors = coffeelint.lint(source, config);
            return assert.isEmpty(errors);
        },
    },

    'Spaces around unary operators': {
        topic:
            `\
+ 1
- - 1\
`,

        'are permitted by default': function (source) {
            const errors = coffeelint.lint(source);
            return assert.isEmpty(errors);
        },

        'can be forbidden': function (source) {
            const config = {
                space_operators: { level: 'error' },
                no_nested_string_interpolation: { level: 'ignore' },
            };

            const errors = coffeelint.lint(source, config);
            assert.lengthOf(errors, 2);
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
