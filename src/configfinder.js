/* eslint-disable
    consistent-return,
    func-names,
    global-require,
    guard-for-in,
    import/no-dynamic-require,
    import/no-unresolved,
    no-param-reassign,
    no-restricted-syntax,
    no-return-assign,
    no-underscore-dangle,
    no-use-before-define,
    no-var,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
/*
Helpers for finding CoffeeLint config in standard locations, similar to how
JSHint does.
*/

const fs = require('fs');
const path = require('path');
const stripComments = require('strip-json-comments');
const resolve = require('resolve').sync;

// Cache for findFile
const findFileResults = {};

// Searches for a file with a specified name starting with 'dir' and going all
// the way up either until it finds the file or hits the root.
var findFile = function (name, dir) {
    dir = dir || process.cwd();
    const filename = path.normalize(path.join(dir, name));
    if (findFileResults[filename]) { return findFileResults[filename]; }
    const parent = path.resolve(dir, '../');
    if (fs.existsSync(filename)) {
        return findFileResults[filename] = filename;
    } if (dir === parent) {
        return findFileResults[filename] = null;
    }
    return findFile(name, parent);
};

// Possibly find CoffeeLint configuration within a package.json file.
const loadNpmConfig = function (dir) {
    const fp = findFile('package.json', dir);
    if (fp) { return __guard__(loadJSON(fp), (x) => x.coffeelintConfig); }
};

// Parse a JSON file gracefully.
var loadJSON = function (filename) {
    try {
        return JSON.parse(stripComments(fs.readFileSync(filename).toString()));
    } catch (e) {
        process.stderr.write(`Could not load JSON file '${filename}': ${e}`);
        return null;
    }
};

// Tries to find a configuration file in either project directory (if file is
// given), as either the package.json's 'coffeelintConfig' property, or a project
// specific 'coffeelint.json' or a global 'coffeelint.json' in the home
// directory.
const getConfig = function (dir) {
    if (process.env.COFFEELINT_CONFIG
            && fs.existsSync(process.env.COFFEELINT_CONFIG)) {
        return loadJSON(process.env.COFFEELINT_CONFIG);
    }

    const npmConfig = loadNpmConfig(dir);
    if (npmConfig) { return npmConfig; }
    const projConfig = findFile('coffeelint.json', dir);
    if (projConfig) { return loadJSON(projConfig); }

    const envs = process.env.USERPROFILE || process.env.HOME || process.env.HOMEPATH;
    const home = path.normalize(path.join(envs, 'coffeelint.json'));
    if (fs.existsSync(home)) {
        return loadJSON(home);
    }
};

// configfinder is the only part of coffeelint that actually has the full
// filename and can accurately resolve module names. This will find all of the
// modules and expand them into full paths so that they can be found when the
// source and config are passed to `coffeelint.lint`
const expandModuleNames = function (dir, config) {
    for (const ruleName in config) {
        const data = config[ruleName];
        if ((data != null ? data.module : undefined) != null) {
            config[ruleName]._module = config[ruleName].module;
            config[ruleName].module = resolve(data.module, {
                basedir: dir,
                extensions: ['.js', '.coffee', '.litcoffee', '.coffee.md'],
            });
        }
    }

    const {
        coffeelint,
    } = config;
    if ((coffeelint != null ? coffeelint.transforms : undefined) != null) {
        coffeelint._transforms = coffeelint.transforms;
        coffeelint.transforms = coffeelint.transforms.map((moduleName) => resolve(moduleName, {
            basedir: dir,
            extensions: ['.js', '.coffee', '.litcoffee', '.coffee.md'],
        }));
    }
    if ((coffeelint != null ? coffeelint.coffeescript : undefined) != null) {
        coffeelint._coffeescript = coffeelint.coffeescript;
        coffeelint.coffeescript = resolve(coffeelint.coffeescript, {
            basedir: dir,
            extensions: ['.js', '.coffee', '.litcoffee', '.coffee.md'],
        });
    }

    return config;
};

const extendConfig = function (config) {
    let rule; let
        ruleName;
    if (!config.extends) {
        return config;
    }

    const parentConfig = require(config.extends);
    const extendedConfig = {};

    for (ruleName in config) {
        rule = config[ruleName];
        extendedConfig[ruleName] = rule;
    }
    for (ruleName in parentConfig) {
        rule = parentConfig[ruleName];
        extendedConfig[ruleName] = config[ruleName] || rule;
    }

    return extendedConfig;
};


exports.getConfig = function (filename = null) {
    let dir;
    if (filename) {
        dir = path.dirname(path.resolve(filename));
    } else {
        dir = process.cwd();
    }

    let config = getConfig(dir);

    if (config) {
        config = extendConfig(config);
        config = expandModuleNames(dir, config);
    }

    return config;
};

function __guard__(value, transform) {
    return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
