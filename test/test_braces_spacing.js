/* eslint-disable
    func-names,
    import/no-dynamic-require,
    import/no-unresolved,
    no-param-reassign,
    no-plusplus,
    no-use-before-define,
    no-useless-escape,
    no-var,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const path = require('path');
const vows = require('vows');
const assert = require('assert');

const coffeelint = require(path.join('..', 'lib', 'coffeelint'));

const sources = {
    emptyObject: {
        noSpaces: '{}',
        oneSpace: '{ }',
        twoSpaces: '{  }',
    },
    implicit: 'foo: bar',
    ownLine: `\
x = {
  foo: bar
}\
`,
    sameLine: {
        noSpaces: '{foo: bar}',
        oneSpace: '{ foo: bar }',
        twoSpaces: '{  foo: bar  }',
    },
    splitLine: {
        noSpaces: `\
{foo,
 bar} = x\
`,
        oneSpace: `\
{ foo,
  bar } = x\
`,
        twoSpaces: `\
{  foo,
   bar  } = x\
`,
    },
    stringInterpolation: {
        noSpaces: '"\#{foo}"',
        oneSpace: '"\#{ foo }"',
    },

    fnImplicitParens:
        `\
[
  {
    foo: ->
      bar ->
        1
  }
]\
`,
};

const configs = {
    oneEmptyObjectSpace: {
        braces_spacing: { level: 'error', empty_object_spaces: 1 },
    },
    oneSpace: {
        braces_spacing: { level: 'error', spaces: 1 },
    },
    zeroEmptyObjectSpaces: {
        braces_spacing: { level: 'error', empty_object_spaces: 0 },
    },
    zeroSpaces: {
        braces_spacing: { level: 'error', spaces: 0 },
    },
};

const shouldPass = function (source, config) {
    if (config == null) { config = {}; }
    return {
        topic: coffeelint.lint(source, config),
        'returns no errors': function (errors) {
            return assert.isEmpty(errors);
        },
    };
};

const shouldFail = function (source, config, errorMessages) {
    if (errorMessages == null) { errorMessages = []; }
    const context = {};
    context.topic = coffeelint.lint(source, config);
    context[`returns ${errorMessages.length} errors`] = function (errors) {
        assert.equal(errors.length, errorMessages.length);
        return (() => {
            const result = [];
            for (let index = 0; index < errors.length; index++) {
                const error = errors[index];
                assert.equal(error.context, errorMessages[index]);
                result.push(assert.equal(error.rule, RULE));
            }
            return result;
        })();
    };
    return context;
};

var RULE = 'braces_spacing';

vows.describe(RULE).addBatch({

    'disabled by default': {
        'with no spaces': shouldPass(sources.sameLine.noSpaces),
        'with one space': shouldPass(sources.sameLine.oneSpace),
    },


    'enabled with spaces set to 0': {
        'implicit braces':
            shouldPass(sources.implicit, configs.zeroSpaces),

        'braces on their own lines':
            shouldPass(sources.ownLine, configs.zeroSpaces),

        'braces on the line': {
            'no spaces inside both braces':
                shouldPass(sources.sameLine.noSpaces, configs.zeroSpaces),

            'one space inside on both braces':
                shouldFail(sources.sameLine.oneSpace,
                    configs.zeroSpaces,
                    ['There should be 0 spaces inside "{"',
                        'There should be 0 spaces inside "}"']),

            'two spaces inside on both braces':
                shouldFail(sources.sameLine.twoSpaces,
                    configs.zeroSpaces,
                    ['There should be 0 spaces inside "{"',
                        'There should be 0 spaces inside "}"']),
        },

        'braces on separate lines': {
            'no spaces inside both braces':
                shouldPass(sources.splitLine.noSpaces, configs.zeroSpaces),

            'one space inside on both braces':
                shouldFail(sources.splitLine.oneSpace,
                    configs.zeroSpaces,
                    ['There should be 0 spaces inside "{"',
                        'There should be 0 spaces inside "}"']),

            'two spaces inside on both braces':
                shouldFail(sources.splitLine.twoSpaces,
                    configs.zeroSpaces,
                    ['There should be 0 spaces inside "{"',
                        'There should be 0 spaces inside "}"']),
        },

        'string interpolation': {
            'no spaces inside both braces': function () {
                return shouldPass(sources.stringInterpolation.noSpaces,
                    configs.zeroSpaces);
            },

            'one space inside on both braces':
                shouldPass(sources.stringInterpolation.oneSpace,
                    configs.zeroSpaces),
        },
    },

    'enabled with spaces set to 1': {
        'implicit braces':
            shouldPass(sources.implicit, configs.oneSpace),

        'braces on their own lines':
            shouldPass(sources.ownLine, configs.oneSpace),

        'braces on the line': {
            'no spaces inside both braces':
                shouldFail(sources.sameLine.noSpaces,
                    configs.oneSpace,
                    ['There should be 1 space inside "{"',
                        'There should be 1 space inside "}"']),

            'one space inside on both braces':
                shouldPass(sources.sameLine.oneSpace, configs.oneSpace),

            'two spaces inside on both braces':
                shouldFail(sources.sameLine.twoSpaces,
                    configs.oneSpace,
                    ['There should be 1 space inside "{"',
                        'There should be 1 space inside "}"']),
        },

        'braces on separate lines': {
            'no spaces inside both braces':
                shouldFail(sources.splitLine.noSpaces,
                    configs.oneSpace,
                    ['There should be 1 space inside "{"',
                        'There should be 1 space inside "}"']),

            'one space inside on both braces':
                shouldPass(sources.splitLine.oneSpace, configs.oneSpace),

            'two spaces inside on both braces':
                shouldFail(sources.splitLine.twoSpaces,
                    configs.oneSpace,
                    ['There should be 1 space inside "{"',
                        'There should be 1 space inside "}"']),
        },

        'string interpolation': {
            'no spaces inside both braces':
                shouldPass(sources.stringInterpolation.noSpaces,
                    configs.oneSpace),

            'one space inside on both braces':
                shouldPass(sources.stringInterpolation.oneSpace,
                    configs.oneSpace),
        },
    },


    'enabled with empty object spaces set to 0': {
        'no spaces inside both braces':
            shouldPass(sources.emptyObject.noSpaces,
                configs.zeroEmptyObjectSpaces),

        'one space inside on both braces':
            shouldFail(sources.emptyObject.oneSpace,
                configs.zeroEmptyObjectSpaces,
                ['There should be 0 spaces inside "{"',
                    'There should be 0 spaces inside "}"']),

        'two spaces inside on both braces':
            shouldFail(sources.emptyObject.twoSpaces,
                configs.zeroEmptyObjectSpaces,
                ['There should be 0 spaces inside "{"',
                    'There should be 0 spaces inside "}"']),
    },


    'enabled with empty object spaces set to 1': {
        'no spaces inside both braces':
            shouldFail(sources.emptyObject.noSpaces,
                configs.oneEmptyObjectSpace,
                ['There should be 1 space inside "{"',
                    'There should be 1 space inside "}"']),

        'one space inside on both braces':
            shouldPass(sources.emptyObject.oneSpace,
                configs.oneEmptyObjectSpace),

        'two spaces inside on both braces':
            shouldFail(sources.emptyObject.twoSpaces,
                configs.oneEmptyObjectSpace,
                ['There should be 1 space inside "{"',
                    'There should be 1 space inside "}"']),
    },

    'handles generated tokens being on the same line (in outputted code)': {
        'no spaces inside both braces':
            shouldPass(sources.fnImplicitParens,
                configs.zeroSpaces),

        'should pass with one space on both braces':
            shouldPass(sources.fnImplicitParens,
                configs.oneSpace),
    },

}).export(module);
