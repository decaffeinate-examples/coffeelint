/* eslint-disable
    class-methods-use-this,
    global-require,
    import/no-unresolved,
    import/order,
    no-multi-assign,
    no-return-assign,
    no-shadow,
    no-undef,
    no-unused-vars,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let Cache;
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ltVer = require('./../package.json').version;
const csVer = ((typeof window !== 'undefined' && window !== null ? window.CoffeeScript : undefined) || require('coffeescript')).VERSION;


module.exports = (Cache = class Cache {
    constructor(basepath) {
        this.basepath = basepath;
        if (!fs.existsSync(this.basepath)) {
            fs.mkdirSync(this.basepath, 0o755);
        }
    }


    path(source) {
        return path.join(this.basepath, `${csVer}-${ltVer}-${this.prefix}-${this.hash(source)}`);
    }


    get(source) { return JSON.parse(fs.readFileSync(this.path(source), 'utf8')); }


    set(source, result) {
        return fs.writeFileSync(this.path(source), JSON.stringify(result));
    }


    has(source) { return fs.existsSync(this.path(source)); }


    hash(data) {
        return crypto.createHash('md5').update(`${data}`).digest('hex').substring(0, 8);
    }


    // Use user config as a "namespace" so that
    // when he/she changes it the cache becomes invalid
    setConfig(config) { return this.prefix = this.hash(JSON.stringify(config)); }
});
