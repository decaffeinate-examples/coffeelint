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

/*
 * # This will work from 3rd party code
 * coffeelint = require 'coffeelint'
 * RawReporter = require 'coffeelint/lib/reporters/raw'
 */

const coffeelint = require(path.join('..', 'lib', 'coffeelint'));
const PassThroughReporter = require(path.join('..', 'lib', 'reporters', 'passthrough'));

vows.describe('reporters').addBatch({

    'Can be used by 3rd party projects': {
        topic:
            `\
if true
    undefined\
`,

        '(example)': function (code) {
            // Grab your own ErrorReport
            const errorReport = coffeelint.getErrorReport();
            // Lint your files, no need to save the results.
            // They're captured inside the ErrorReport.
            errorReport.lint('stdin', code);

            // Construct a new reporter and publish the results.
            // You can use the built in reporters, or make your own.
            const reporter = new PassThroughReporter(errorReport);
            const result = reporter.publish();

            assert.equal(result.stdin.length, 1);
            const error = result.stdin[0];
            return assert.equal(error.name, 'indentation');
        },
    },

}).export(module);
