/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const path = require('path');
const vows = require('vows');
const assert = require('assert');
const coffeelint = require(path.join('..', 'lib', 'coffeelint'));

const RULE = 'newlines_after_classes';

vows.describe(RULE).addBatch({

    'File ends with end of class': {
        topic:
            `\
class Foo

    constructor: () ->
        bla()

    a: 'b'
    c: 'd'\
`,

        "won't match"(source) {
            const config = {
                newlines_after_classes: {
                    level: 'error',
                    value: 3
                },
                indentation: {
                    level: 'ignore',
                    value: 4
                }
            };
            const errors = coffeelint.lint(source, config);
            return assert.equal(errors.length, 0);
        }
    },

    'Class with arbitrary Code following': {
        topic:
            `\
class Foo

    constructor: () ->
        bla()

    a: "b"
    c: "d"



class Bar extends Foo

    constructor: () ->
        bla()\
`,

        'defaults to ignore newlines_after_classes'(source) {
            const config = {
                indentation: {
                    level: 'ignore',
                    value: 4
                }
            };
            const errors = coffeelint.lint(source, config);
            return assert.equal(errors.length, 0);
        },

        'has too few newlines after class'(source) {
            const config = {
                newlines_after_classes: {
                    level: 'error',
                    value: 4
                },
                indentation: {
                    level: 'ignore',
                    value: 4
                }
            };
            const errors = coffeelint.lint(source, config);
            assert.equal(errors.length, 1);
            const error = errors[0];
            const msg = 'Wrong count of newlines between a class and other code';
            assert.equal(error.message, msg);
            assert.equal(error.rule, 'newlines_after_classes');
            assert.equal(error.lineNumber, 8);
            return assert.equal(error.context, 'Expected 4 got 3');
        },

        'has too many newlines after class'(source) {
            const config = {
                newlines_after_classes: {
                    level: 'error',
                    value: 2
                },
                indentation: {
                    level: 'ignore',
                    value: 4
                }
            };
            const errors = coffeelint.lint(source, config);
            assert.equal(errors.length, 1);
            const error = errors[0];
            const msg = 'Wrong count of newlines between a class and other code';
            assert.equal(error.message, msg);
            assert.equal(error.rule, 'newlines_after_classes');
            assert.equal(error.lineNumber, 8);
            return assert.equal(error.context, 'Expected 2 got 3');
        },

        'has no errors'(source) {
            const config = {
                newlines_after_classes: {
                    level: 'error',
                    value: 3
                },
                indentation: {
                    level: 'ignore',
                    value: 4
                }
            };
            const errors = coffeelint.lint(source, config);
            return assert.equal(errors.length, 0);
        }
    },

    'Fix #230, error when class ends with function': {
        topic:
            `\
class Foo
  bar: ->
    "foo"

return Foo\
`,

        'passes properly with value of 2'(source) {
            const config = {
                newlines_after_classes: {
                    level: 'error',
                    value: 2
                }
            };

            const errors = coffeelint.lint(source, config);
            const error = errors[0];
            return assert.equal(errors.length, 1);
        }
    },

    'Fix #245, error of class inside function call': {
        topic:
            `\
test(->

  class SomeClass

    someFunction: ->
      someCode()


  someCode()
  return
)\
`,

        'fails with value of 1'(source) {
            const config = {
                newlines_after_classes: {
                    level: 'error',
                    value: 1
                }
            };

            const errors = coffeelint.lint(source, config);
            const error = errors[0];
            assert.equal(errors.length, 1);
            assert.equal(errors[0].lineNumber, 7);
            assert.equal(errors[0].line, '');
            assert.equal(errors[0].rule, RULE);
            return assert.equal(errors[0].context, 'Expected 1 got 2');
        },

        'passes properly with value of 2'(source) {
            const config = {
                newlines_after_classes: {
                    level: 'error',
                    value: 2
                }
            };

            const errors = coffeelint.lint(source, config);
            return assert.equal(errors.length, 0);
        },

        'fails with value of 3'(source) {
            const config = {
                newlines_after_classes: {
                    level: 'error',
                    value: 3
                }
            };

            const errors = coffeelint.lint(source, config);
            const error = errors[0];
            assert.equal(errors.length, 1);
            assert.equal(errors[0].lineNumber, 7);
            assert.equal(errors[0].line, '');
            assert.equal(errors[0].rule, RULE);
            return assert.equal(errors[0].context, 'Expected 3 got 2');
        }
    },

    'Fix #245, other case': {
        topic:
            `\
a 'test case', ->
  b 'sub-test case', ->
    class C extends D
      @hello: ->
        @exit()

    f = result()\
`,

        'fails with value of 0'(source) {
            const config = {
                newlines_after_classes: {
                    level: 'error',
                    value: 0
                }
            };

            const errors = coffeelint.lint(source, config);
            const error = errors[0];
            assert.equal(errors.length, 1);
            assert.equal(errors[0].lineNumber, 6);
            assert.equal(errors[0].line, '');
            assert.equal(errors[0].rule, RULE);
            return assert.equal(errors[0].context, 'Expected 0 got 1');
        },

        'passes with value of 1'(source) {
            const config = {
                newlines_after_classes: {
                    level: 'error',
                    value: 1
                }
            };

            const errors = coffeelint.lint(source, config);
            return assert.equal(errors.length, 0);
        },

        'fails with value of 2'(source) {
            const config = {
                newlines_after_classes: {
                    level: 'error',
                    value: 2
                }
            };

            const errors = coffeelint.lint(source, config);
            const error = errors[0];
            assert.equal(errors.length, 1);
            assert.equal(errors[0].lineNumber, 6);
            assert.equal(errors[0].line, '');
            assert.equal(errors[0].rule, RULE);
            return assert.equal(errors[0].context, 'Expected 2 got 1');
        }
    },

    'Fix #347, error when class ends with non-function property': {
        topic:
            `\
class WhitespaceTest
  key1: 'a'
  key2: 'b'
\
`,

        'passes properly with value of 2'(source) {
            const config = {
                newlines_after_classes: {
                    level: 'error',
                    value: 2
                }
            };

            const errors = coffeelint.lint(source, config);
            const error = errors[0];
            return assert.equal(errors.length, 0);
        }
    },

    'Handles same line class declarations': {
        topic:
            `\
hello = 'world'

A = class extends B
  C: ->
    'ABC'

Z = {}\
`,

        'passes when value is set to 1'(source) {
            const config = {
                newlines_after_classes: {
                    level: 'error',
                    value: 1
                }
            };
            const errors = coffeelint.lint(source, config);
            return assert.equal(errors.length, 0);
        },

        'fails when value is set to 2'(source) {
            const config = {
                newlines_after_classes: {
                    level: 'error',
                    value: 2
                }
            };
            const errors = coffeelint.lint(source, config);

            assert.equal(errors.length, 1);
            assert.equal(errors[0].lineNumber, 6);
            assert.equal(errors[0].line, '');
            assert.equal(errors[0].rule, RULE);
            return assert.equal(errors[0].context, 'Expected 2 got 1');
        }
    },

    'Handle comments out after a class': {
        topic:
            `\
class Bar extends Foo
  constructor: () ->
    bla()

# a: 'b'
# c: 'd'
# r = {}
#  b

s = 3\
`,

        'throws error when newlines_after_classes is set to 0'(source) {
            const config = {
                newlines_after_classes: {
                    level: 'error',
                    value: 0
                }
            };

            const errors = coffeelint.lint(source, config);
            assert.equal(errors.length, 1);
            assert.equal(errors[0].lineNumber, 4);
            assert.equal(errors[0].line, '');
            assert.equal(errors[0].rule, RULE);
            return assert.equal(errors[0].context, 'Expected 0 got 2');
        },

        'throws error when newlines_after_classes is set to 1'(source) {
            const config = {
                newlines_after_classes: {
                    level: 'error',
                    value: 1
                }
            };

            const errors = coffeelint.lint(source, config);
            assert.equal(errors.length, 1);
            assert.equal(errors[0].lineNumber, 4);
            assert.equal(errors[0].line, '');
            assert.equal(errors[0].rule, RULE);
            return assert.equal(errors[0].context, 'Expected 1 got 2');
        },

        'passes when newlines_after_classes is set to 2'(source) {
            const config = {
                newlines_after_classes: {
                    level: 'error',
                    value: 2
                }
            };

            const errors = coffeelint.lint(source, config);
            return assert.equal(errors.length, 0);
        }
    },

    'Fix #375, comments should not count as an empty line': {
        topic:
            `\
class A
  B: ->

# comment
FooBar()\
`,

        'defaults to ignore newlines_after_classes'(source) {
            const errors = coffeelint.lint(source);
            return assert.equal(errors.length, 0);
        },

        'throws error when newlines_after_classes is set to 0'(source) {
            const config = {
                newlines_after_classes: {
                    level: 'error',
                    value: 0
                }
            };

            const errors = coffeelint.lint(source, config);
            assert.equal(errors.length, 1);
            assert.equal(errors[0].lineNumber, 3);
            assert.equal(errors[0].line, '');
            assert.equal(errors[0].rule, RULE);
            return assert.equal(errors[0].context, 'Expected 0 got 1');
        },

        'ignores comment when newlines_after_classes is set to 1'(source) {
            const config = {
                newlines_after_classes: {
                    level: 'error',
                    value: 1
                }
            };

            const errors = coffeelint.lint(source, config);
            return assert.equal(errors.length, 0);
        },

        'throws error when newlines_after_classes is set to 2'(source) {
            const config = {
                newlines_after_classes: {
                    level: 'error',
                    value: 2
                }
            };

            const errors = coffeelint.lint(source, config);
            assert.equal(errors.length, 1);
            assert.equal(errors[0].lineNumber, 3);
            assert.equal(errors[0].line, '');
            assert.equal(errors[0].rule, RULE);
            return assert.equal(errors[0].context, 'Expected 2 got 1');
        },

        'throws error when newlines_after_classes is set to 3'(source) {
            const config = {
                newlines_after_classes: {
                    level: 'error',
                    value: 3
                }
            };

            const errors = coffeelint.lint(source, config);
            assert.equal(errors.length, 1);
            assert.equal(errors[0].lineNumber, 3);
            assert.equal(errors[0].line, '');
            assert.equal(errors[0].rule, RULE);
            return assert.equal(errors[0].context, 'Expected 3 got 1');
        }
    }

}).export(module);
