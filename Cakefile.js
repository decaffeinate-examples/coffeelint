/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const browserify = require('browserify');
const CoffeeScript = require('coffeescript');
const { exec } = require('child_process');

const copySync = (src, dest) => fs.writeFileSync(dest, fs.readFileSync(src));

const coffeeSync = function(input, output) {
    const coffee = fs.readFileSync(input).toString();
    return fs.writeFileSync(output, CoffeeScript.compile(coffee));
};

task('compile', 'Compile Coffeelint', function() {
    console.log('Compiling Coffeelint...');
    if (!fs.existsSync('lib')) { fs.mkdirSync('lib'); }
    invoke('compile:browserify');
    return invoke('compile:commandline');
});

task('compile:commandline', 'Compiles commandline.js', function() {
    coffeeSync('src/commandline.coffee', 'lib/commandline.js');
    coffeeSync('src/configfinder.coffee', 'lib/configfinder.js');
    coffeeSync('src/cache.coffee', 'lib/cache.js');
    coffeeSync('src/ruleLoader.coffee', 'lib/ruleLoader.js');
    if (!fs.existsSync('lib/reporters')) { fs.mkdirSync('lib/reporters'); }
    return (() => {
        const result = [];
        for (let src of Array.from(glob.sync('reporters/*.coffee', { cwd: 'src' }))) {
        // Slice the "coffee" extension of the end and replace with js
            const dest = src.slice(0, -6) + 'js';
            result.push(coffeeSync(`src/${src}`, `lib/${dest}`));
        }
        return result;
    })();
});

task('compile:browserify', 'Uses browserify to compile coffeelint', function() {
    const opts =
        {standalone: 'coffeelint'};
    const b = browserify(opts);
    b.add([ './src/coffeelint.coffee' ]);
    b.transform(require('coffeeify'));
    return b.bundle().pipe(fs.createWriteStream('lib/coffeelint.js'));
});

task('prepublish', 'Prepublish', function() {
    const { npm_config_argv } = process.env;
    if ((npm_config_argv != null) && (JSON.parse(npm_config_argv).original[0] === 'install')) {
        return;
    }

    copySync('package.json', '.package.json');
    const packageJson = require('./package.json');

    delete packageJson.dependencies.browserify;
    delete packageJson.dependencies.coffeeify;
    delete packageJson.scripts.install;

    fs.writeFileSync('package.json', JSON.stringify(packageJson, undefined, 2));

    return invoke('compile');
});

task('postpublish', 'Postpublish', () => // Revert the package.json back to it's original state
exec('git checkout ./package.json', function(err) {
  if (err) {
    return console.error('Error reverting package.json: ' + err);
}
}));

task('publish', 'publish', () => copySync('.package.json', 'package.json'));

task('install', 'Install', function() {
    if (!require("fs").existsSync("lib/commandline.js")) {
        return invoke('compile');
    }
});
