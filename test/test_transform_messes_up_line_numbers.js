/* eslint-disable
    func-names,
    import/no-dynamic-require,
    import/no-unresolved,
    no-multi-str,
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

const fs = require('fs');

const thisdir = path.dirname(fs.realpathSync(__filename));

const prefix = path.join(thisdir, 'fixtures', 'prefix_transform.coffee');
const cloud = path.join(thisdir, 'fixtures', 'cloud_transform.coffee');

vows.describe('transform_messes_up_line_numbers').addBatch({

    transform_messes_up_line_numbers: {
        topic:
            '\
console.log(\'Hello cloud\')\
',

        'will warn if the number of lines changes': function (source) {
            const config = {
                coffeelint: {
                    transforms: [prefix, cloud],
                },
            };

            const errors = coffeelint.lint(source, config);
            assert.equal(errors.length, 1);
            return assert.equal(errors[0].name, 'transform_messes_up_line_numbers');
        },

        "will not warn if the number of lines doesn't change": function (source) {
            const config = {
                coffeelint: {
                    transforms: [cloud],
                },
            };

            const errors = coffeelint.lint(source, config);
            return assert.equal(errors.length, 0);
        },
    },

}).export(module);
