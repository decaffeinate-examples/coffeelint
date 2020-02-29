/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const vows = require('vows');
const assert = require('assert');

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const batch = {};

const thisdir = path.dirname(fs.realpathSync(__filename));
const rulesDir = path.join(thisdir, '..', 'src', 'rules');

const rules = glob.sync(path.join(rulesDir, '*.coffee'));

const hasTests = {
    'has tests'() {
        const ruleFilename = this.context.name;
        const testFilename = path.join(thisdir, 'test_' + ruleFilename);
        return assert(fs.existsSync(testFilename), `expected ${testFilename} to exist`);
    },

    'has correct filename'() {
        const ruleFilename = this.context.name;
        const Rule = require(path.join(rulesDir, ruleFilename));

        const tmp = new Rule;
        const expectedFilename = tmp.rule.name + '.coffee';

        return assert.equal(ruleFilename, expectedFilename);
    }
};

rules.forEach(function(rule) {
    const filename = path.basename(rule);
    return batch[filename] = hasTests;
});

vows.describe('filenames').addBatch(batch).export(module);
