/* eslint-disable
    func-names,
    import/no-dynamic-require,
    import/no-unresolved,
    no-multi-str,
    no-unused-vars,
    prefer-destructuring,
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

const RULE = 'indentation';

vows.describe(RULE).addBatch({

    Indentation: {
        topic:
            `\
x = () ->
  'two spaces'

a = () ->
    'four spaces'\
`,

        'defaults to two spaces': function (source) {
            const errors = coffeelint.lint(source);
            assert.equal(errors.length, 1);
            const error = errors[0];
            const msg = 'Line contains inconsistent indentation';
            assert.equal(error.message, msg);
            assert.equal(error.rule, RULE);
            assert.equal(error.lineNumber, 5);
            return assert.equal(error.context, 'Expected 2 got 4');
        },

        'can be overridden': function (source) {
            const config = {
                indentation: {
                    level: 'error',
                    value: 4,
                },
            };
            const errors = coffeelint.lint(source, config);
            assert.equal(errors.length, 1);
            const error = errors[0];
            return assert.equal(error.lineNumber, 2);
        },

        'is optional': function (source) {
            const config = {
                indentation: {
                    level: 'ignore',
                    value: 4,
                },
            };
            const errors = coffeelint.lint(source, config);
            return assert.equal(errors.length, 0);
        },
    },

    'Nested indentation errors': {
        topic:
            `\
x = () ->
  y = () ->
      1234\
`,

        'are caught': function (source) {
            const errors = coffeelint.lint(source);
            assert.lengthOf(errors, 1);
            const error = errors[0];
            return assert.equal(error.lineNumber, 3);
        },
    },

    'Compiler generated indentation': {
        topic:
            `\
() ->
    if 1 then 2 else 3\
`,

        'is ignored when not using two spaces': function (source) {
            const config = {
                indentation: {
                    value: 4,
                },
            };
            const errors = coffeelint.lint(source, config);
            return assert.isEmpty(errors);
        },
    },

    'Indentation inside interpolation': {
        topic:
            '\
a = "#{ 1234 }"\
',

        'is ignored': function (source) {
            const errors = coffeelint.lint(source);
            return assert.isEmpty(errors);
        },
    },

    'Indentation in multi-line expressions': {
        topic:
            `\
x = '1234' + '1234' + '1234' +
        '1234' + '1234'\
`,

        'is ignored': function (source) {
            const errors = coffeelint.lint(source);
            return assert.isEmpty(errors);
        },
    },

    'Indentation across line breaks': {
        topic:
            `\
days = ["mon", "tues", "wed",
           "thurs", "fri"
                    "sat", "sun"]

x = myReallyLongFunctionName =
        1234

arr = [() ->
        1234
]\
`,

        'is ignored': function (source) {
            const errors = coffeelint.lint(source);
            return assert.isEmpty(errors);
        },
    },

    'Indentation on seperate line invocation': {
        topic:
            `\
rockinRockin
        .around ->
          3

rockrockrock.
        around ->
          1234\
`,

        'is ignored. Issue #4': function (source) {
            const errors = coffeelint.lint(source);
            return assert.isEmpty(errors);
        },
    },

    'Consecutive indented chained invocations': {
        topic:
            `\
$('body')
    .addClass('k')
    .removeClass 'k'
    .animate()
    .hide()\
`,

        'is permitted': function (source) {
            return assert.isEmpty(coffeelint.lint(source));
        },
    },

    'Consecutive chained invocations and blank line': {
        topic:
            `\
$('body')

    .addClass('k').hide()\
`,

        'is permitted': function (source) {
            return assert.isEmpty(coffeelint.lint(source));
        },
    },

    'Consecutive chained invocations with a prop method call': {
        topic:
            `\
$('<input>')
    .addClass('k')
    .prop('placeholder', @$el.prop('placeholder'))
    .hide()\
`,

        'is permitted': function (source) {
            return assert.isEmpty(coffeelint.lint(source));
        },
    },

    'Consecutive chained invocations with string concatenation': {
        topic:
            `\
$('body')
    .addClass("hello-" + world).addClass("red")\
`,

        'is permitted': function (source) {
            return assert.isEmpty(coffeelint.lint(source));
        },
    },

    'Consecutive indented chained invocations and multi-line expression': {
        topic:
            `\
$('body')
  .addClass ->
    return $(this).name + $(this).that +
      $(this).this
  .removeClass 'k'\
`,

        'is permitted': function (source) {
            return assert.isEmpty(coffeelint.lint(source));
        },
    },

    'Consecutive indented chained invocations with bad indents': {
        topic:
            `\
$('body')
  .addClass('k')
     # bad indented comments are ignored
  .removeClass 'k'
  # comments are ignored in checking, so are blank lines

  .animate()
    # comments are ignored
     .hide() # this will check with '.animated()' and complain\
`,
        'fails with indent error': function (source) {
            const errors = coffeelint.lint(source);
            assert.equal(errors.length, 1);
            const error = errors[0];

            assert.equal(error.rule, RULE);
            assert.equal(error.lineNumber, 9);
            return assert.equal(error.context, 'Expected 2 got 1');
        },
    },

    'One chain invocations with bad indents': {
        topic:
            `\
$('body')
   .addClass('k')\
`,
        'fails with indent error': function (source) {
            const errors = coffeelint.lint(source);
            assert.equal(errors.length, 1);
            const error = errors[0];

            assert.equal(error.rule, RULE);
            assert.equal(error.lineNumber, 2);
            return assert.equal(error.context, 'Expected 2 got 3');
        },
    },

    'Separate chained invocations with bad indents': {
        topic:
            `\
$('body')
  .addClass ->
    return name + that +
      there
   .removeClass 'k'

$('html')
   .hello()\
`,

        'correctly identifies two errors': function (source) {
            const errors = coffeelint.lint(source);
            assert.equal(errors.length, 2);
            let error = errors[0];

            assert.equal(error.rule, RULE);
            assert.equal(error.lineNumber, 5);
            assert.equal(error.context, 'Expected 2 got 3');

            error = errors[1];

            assert.equal(error.rule, RULE);
            assert.equal(error.lineNumber, 8);
            return assert.equal(error.context, 'Expected 2 got 3');
        },
    },


    'Ignore comment in indented chained invocations': {
        topic:
            `\
test()
    .r((s) ->
        # Ignore this comment
        # Ignore this one too
        # Ignore this one three
        ab()
        x()
        y()
    )
    .s()\
`,
        'no error when comment is in first line of a chain': function (source) {
            const config = {
                indentation: {
                    value: 4,
                },
            };
            const errors = coffeelint.lint(source, config);
            return assert.isEmpty(errors);
        },
    },

    'Ignore blank line in indented chained invocations': {
        topic:
            `\
test()
    .r((s) ->


        ab()
        x()
        y()
    )
    .s()\
`,
        'no error when blank line is in first line of a chain': function (source) {
            const config = {
                indentation: {
                    value: 4,
                },
            };
            const errors = coffeelint.lint(source, config);
            return assert.isEmpty(errors);
        },
    },

    'Arbitrarily indented arguments': {
        topic:
            `\
myReallyLongFunction withLots,
                     ofArguments,
                     everywhere\
`,

        'are permitted': function (source) {
            const errors = coffeelint.lint(source);
            return assert.isEmpty(errors);
        },
    },

    'Indenting a callback in a chained call inside a function': {
        topic:
            `\
someFunction = ->
  $.when(somePromise)
    .done (result) ->
      foo = result.bar\
`,
        'is permitted. See issue #88': function (source) {
            const errors = coffeelint.lint(source);
            return assert.isEmpty(errors);
        },
    },

    'Handle multiple chained calls': {
        topic:
            `\
anObject
  .firstChain (f) ->
    doStepOne()
    doAnotherStep()
    prepSomethingElse()
  .secondChain (s) ->
    moreStuff()
    return s\
`,
        'is permitted': function (source) {
            const errors = coffeelint.lint(source);
            return assert.isEmpty(errors);
        },
    },

    'Handle multiple chained calls (4 spaces)': {
        topic:
            `\
anObject
    .firstChain (f) ->
        doStepOne()
        doAnotherStep()
        prepSomethingElse()
    .secondChain (s) ->
        moreStuff()
        return s\
`,
        'fails when using 2 space indentation default': function (source) {
            const msg = 'Line contains inconsistent indentation';

            const errors = coffeelint.lint(source);
            assert.equal(errors.length, 2);
            let error = errors[0];

            assert.equal(error.message, msg);
            assert.equal(error.rule, RULE);
            assert.equal(error.lineNumber, 3);
            assert.equal(error.context, 'Expected 2 got 4');

            error = errors[1];

            assert.equal(error.message, msg);
            assert.equal(error.rule, RULE);
            assert.equal(error.lineNumber, 7);
            return assert.equal(error.context, 'Expected 2 got 4');
        },

        'is permitted when changing configuration to use 4 spaces': function (source) {
            const config = {
                indentation: {
                    value: 4,
                },
            };
            const errors = coffeelint.lint(source, config);
            return assert.isEmpty(errors);
        },
    },

    'Handle multiple chained calls inside more indentation': {
        topic:
            `\
someLongFunction = (a, b, c, d) ->
  retValue = anObject
    .firstChain (f) ->
      doStepOne()
      doAnotherStep()
      prepSomethingElse()
    .secondChain (s) ->
      moreStuff()
      return s

  retValue + [1]
\
`,
        'is permitted': function (source) {
            const errors = coffeelint.lint(source);
            return assert.isEmpty(errors);
        },
    },

    'Handle chains where there are tokens with generated property': {
        topic:
            `\
anObject 'bar'
  .firstChain ->
    doStepOne()
    doStepTwo()
  .secondChain ->
    a = b
    secondObject
      .then ->
        e ->
      .finally x\
`,
        'is permitted': function (source) {
            const errors = coffeelint.lint(source);
            return assert.isEmpty(errors);
        },
    },

    'Handle nested chain calls': {
        topic:
            `\
anObject
  .firstChain (f) ->
    doStepOne()
      .doAnotherStep()
      .prepSomethingElse()
  .secondChain (s) ->
    moreStuff()
    return s\
`,
        'is permitted': function (source) {
            const errors = coffeelint.lint(source);
            return assert.isEmpty(errors);
        },
    },

    'Make sure indentation check is not affected outside proper scope': {
        topic:
            `\
a
  .b

c = ->
  return d + e

->
  if a is c and
    (false or
      long.expression.that.necessitates(linebreak))
    @foo()\
`,
        'returns no errors outside scope': function (source) {
            const errors = coffeelint.lint(source);
            return assert.isEmpty(errors);
        },
    },

    'Handle edge-case weirdness with strings in objects': {
        // see test_no_empty_functions to understand why i needed to add this
        // and to add the code to handle it
        topic:
            `\
call(
  "aaaaaaaaaaaaaaaaaaaaaaaaaaa
  bbbbbbbbbbbbbbbbbbbbbbb"      : first(
    'x = (@y) ->')
)\
`,

        'is permitted': function (source) {
            const errors = coffeelint.lint(source);
            return assert.isEmpty(errors);
        },
    },

    // Fixes people wanted to heavily indent if statements attached to assignment
    // See: #468, #345
    'Handle different if statements indentations': {
        topic:
            `\
r = unless p1
  if p2
    1
  else
    2
else
  3

s = unless p1
      if p2
        1
      else
        2
    else
      3

t =
  if z
    true
  else
    true

u = if p1
      if p2
        1
      else
        2
    else
      3

->
  x = unless y1
    if y2
      1
    else
      y2
  else
    3\
`,

        'is permitted': function (source) {
            const errors = coffeelint.lint(source);
            return assert.isEmpty(errors);
        },
    },

    // See #469
    'Handle paren alignment issues': {
        topic:
            `\
foo
  .bar (
    baz
  ) ->
    return

foo
  .bar (baz) ->
    return

bar (
  baz
) ->
  return\
`,

        'is permitted': function (source) {
            const errors = coffeelint.lint(source);
            return assert.isEmpty(errors);
        },
    },

    // Fixes #312
    'Handles empty if statements': {
        topic:
            `\
x = ->
  for a in tokens
    if a.type is "image"
      "image"
    else if a.type is "video" # ignore video for now!
    else
      "unknown"\
`,

        'is permitted': function (source) {
            const errors = coffeelint.lint(source);
            return assert.isEmpty(errors);
        },
    },

    // Fix #504, a regression caused by bffa2532efd8bcca5d9c1b3a9d3b5914e882dd5f
    // Reverted test for now that fixed #348, since the alignment was a bit
    // unorthodox
    'Handle leakage of (.) chained calls': {
        topic:
            `\
func = ->
  """
    multiline string
     .looksLikeAFunc 'but its just a string, man!'
  """
func()
  .length\
`,

        'is permitted': function (source) {
            const errors = coffeelint.lint(source);
            return assert.isEmpty(errors);
        },
    },

    // Fix #511 by ignoring explicitly generated indentation tabs.
    'Handle empty try/catch/finally': {
        topic:
            `\
try
  a
catch
  # catch but do nothing

try
catch
finally

try a catch b finally

try
  a
catch
  # nothing
finally
  c
  d\
`,

        'is permitted': function (source) {
            const errors = coffeelint.lint(source);
            return assert.isEmpty(errors);
        },
    },
    // a property/method in a class is now checked against in indentation
    'Handle property/method in class': {
        topic:
            `\
class A
  B: (a, b, \
c) ->
    a + b + c\
`,

        'returns no errors': function (source) {
            const errors = coffeelint.lint(source);
            return assert.isEmpty(errors);
        },
    },
    'Handle new keywords': {
        topic:
            `\
ABCD
  .e()
  .f (abc) -> 1 + 1
  .g (def) -> 2 + 2
  .h ijk.lmn\
`,
        'returns no errors': function (source) {
            const config = {
                indentation: {
                    level: 'error',
                    value: 2,
                },
            };
            const errors = coffeelint.lint(source);
            return assert.isEmpty(errors);
        },
    },
    'Make sure chain method with a same name later on isnt counted': {
        topic:
            `\
newMethod: ->
  getInfo('abc')
    .def
      tree: true
    .ghi @abc.ghi()\
`,
        'returns no errors': function (source) {
            const config = {
                indentation: {
                    level: 'error',
                    value: 2,
                },
            };
            const errors = coffeelint.lint(source);
            return assert.isEmpty(errors);
        },
    },

}).export(module);
