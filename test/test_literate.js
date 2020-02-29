/* eslint-disable
    func-names,
    import/no-dynamic-require,
    import/no-unresolved,
    no-tabs,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// The post-test process involves linting all of the files under `test/`. By
// writing this file in Literate (style?) it verifies that literate files are
// automatically detected.
const path = require('path');
const vows = require('vows');
const assert = require('assert');

const coffeelint = require(path.join('..', 'lib', 'coffeelint'));

vows.describe('literate').addBatch({

    // Markdown uses trailing spaces to force a line break.
    'Trailing whitespace in markdown': {

        topic:

        // The line of code is written weird because I had trouble getting the 4 space
        // prefix in place.
            `This is some \`Markdown\`.  \n\n
\n    x = 1234  \n    y = 1\
`,

        'is ignored': function (source) {
            // The 3rd parameter here indicates that the incoming source is literate.
            const errors = coffeelint.lint(source, {}, true);

            // This intentionally includes trailing whitespace in code so it also verifies
            // that the way `Markdown` spaces are stripped are not also stripping code.
            return assert.equal(errors.length, 1);
        },
    },

    'Tab indented markdown': {

        topic:

        // Second line in this topic is used to test support for a tab indented lines.
        // Third line verifies that only a first tab is removed.
            `This is some \`Markdown\`.\n\n
\n	x = 1\n				y = 1\
`,

        'is ignored': function (source) {
            const errors = coffeelint.lint(source, {}, true);
            return assert.equal(errors.length, 3);
        },
    },

}).export(module);
