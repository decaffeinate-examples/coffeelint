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

const RULE = 'camel_case_classes';

vows.describe(RULE).addBatch({

    'Camel cased class names': {
        topic:
            `\
class Animal

class Wolf extends Animal

class BurmesePython extends Animal

class Band

class ELO extends Band

class Eiffel65 extends Band

class nested.Name

class deeply.nested.Name\
`,

        'are valid by default': function (source) {
            const errors = coffeelint.lint(source);
            return assert.isEmpty(errors);
        },
    },

    'Non camel case class names': {
        topic:
            `\
class animal

class wolf extends Animal

class Burmese_Python extends Animal

class canadaGoose extends Animal

class _PrivatePrefix\
`,

        'are rejected by default': function (source) {
            const errors = coffeelint.lint(source);
            assert.lengthOf(errors, 4);
            const error = errors[0];
            assert.equal(error.lineNumber, 1);
            assert.equal(error.message, 'Class name should be UpperCamelCased');
            assert.equal(error.context, 'class name: animal');
            return assert.equal(error.rule, RULE);
        },

        'can be permitted': function (source) {
            const config = { camel_case_classes: { level: 'ignore' } };
            const errors = coffeelint.lint(source, config);
            return assert.isEmpty(errors);
        },
    },

    'Anonymous class names': {
        topic:
            `\
x = class
  m : -> 123

y = class extends x
  m : -> 456

z = class

r = class then 1:2\
`,

        'are permitted': function (source) {
            const errors = coffeelint.lint(source);
            return assert.isEmpty(errors);
        },
    },

    'Inner classes are permitted': {
        topic:
            `\
class X
  class @Y
    f : 123
  class @constructor.Z
    f : 456\
`,

        'are permitted': function (source) {
            const errors = coffeelint.lint(source);
            return assert.lengthOf(errors, 0);
        },
    },

}).export(module);
