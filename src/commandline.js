/* eslint-disable
    consistent-return,
    func-names,
    global-require,
    import/no-dynamic-require,
    import/no-unresolved,
    max-len,
    new-cap,
    no-cond-assign,
    no-console,
    no-empty,
    no-multi-str,
    no-nested-ternary,
    no-param-reassign,
    no-restricted-syntax,
    no-return-assign,
    no-shadow,
    no-use-before-define,
    no-var,
    prefer-rest-params,
    vars-on-top,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
/*
CoffeeLint

Copyright (c) 2011 Matthew Perpick.
CoffeeLint is freely distributable under the MIT license.
*/


const resolve = require('resolve').sync;
const path = require('path');
const fs = require('fs');
const os = require('os');
const glob = require('glob');
const optimist = require('optimist');
const ignore = require('ignore');
const stripComments = require('strip-json-comments');

const thisdir = path.dirname(fs.realpathSync(__filename));
const coffeelint = require(path.join(thisdir, 'coffeelint'));
const configfinder = require(path.join(thisdir, 'configfinder'));
const ruleLoader = require(path.join(thisdir, 'ruleLoader'));
const Cache = require(path.join(thisdir, 'cache'));
const CoffeeScript = require('coffeescript');

CoffeeScript.register();

const log = function () {
    // coffeelint: disable=no_debugger
    return console.log(...arguments);
};
    // coffeelint: enable=no_debugger

let jsonIndentation = 2;
const logConfig = function (config) {
    const filter = function (k, v) { if (!['message', 'description', 'name'].includes(k)) { return v; } };
    return log(JSON.stringify(config, filter, jsonIndentation));
};

// Return the contents of the given file synchronously.
const read = function (path) {
    const realPath = fs.realpathSync(path);
    return fs.readFileSync(realPath).toString();
};

// build all extentions to search
const getAllExtention = function (extension) {
    if (extension != null) {
        extension = ['coffee'].concat(extension != null ? extension.split(',') : undefined);
        return `@(${extension.join('|')})`;
    }
    return 'coffee';
};

// Return a list of CoffeeScript's in the given paths.
const findCoffeeScripts = function (paths, extension) {
    let files = [];
    const allExtention = getAllExtention(extension);
    const opts = { ignore: 'node_modules/**' };
    for (const p of Array.from(paths)) {
        if (fs.statSync(p).isDirectory()) {
            // The glob library only uses forward slashes.
            files = files.concat(glob.sync(`${p}/**/*.${allExtention}`, opts));
        } else {
            files.push(p);
        }
    }
    // Normalize paths, converting './test/fixtures' to 'test/fixtures'.
    // Ignore pattern 'test/fixtures' does NOT match './test/fixtures',
    // because if there is a slash(/) in the pattern, the pattern will not
    // act as a glob pattern.
    // Use `path.join()` instead of `path.normalize()` for better compatibility.
    return files.map((p) => path.join(p));
};

// Return an error report from linting the given paths.
const lintFiles = function (files, config) {
    const errorReport = new coffeelint.getErrorReport();
    for (const file of Array.from(files)) {
        const source = read(file);
        const literate = CoffeeScript.helpers.isLiterate(file);

        const fileConfig = config || getFallbackConfig(file);

        errorReport.lint(file, source, fileConfig, literate);
    }
    return errorReport;
};

// Return an error report from linting the given coffeescript source.
const lintSource = function (source, config, literate) {
    if (literate == null) { literate = false; }
    const errorReport = new coffeelint.getErrorReport();
    if (!config) { config = getFallbackConfig(); }

    errorReport.lint('stdin', source, config, literate);
    return errorReport;
};

// Load a config file given a path/filename
const readConfigFile = function (path) {
    const text = read(path);
    try {
        jsonIndentation = text.split('\n')[1].match(/^\s+/)[0].length;
    } catch (error) {}
    return JSON.parse(stripComments(text));
};

const loadConfig = function (options) {
    let config = null;
    if (!options.argv.noconfig) {
        if (options.argv.f) {
            config = readConfigFile(options.argv.f);

            // If -f was specifying a package.json, extract the config
            if (config.coffeelintConfig) {
                config = config.coffeelintConfig;
            }
        }
    }
    return config;
};

// Get fallback configuration. With the -F flag found configs in standard places
// will be used for each file being linted. Standard places are package.json or
// coffeelint.json in a project's root folder or the user's home folder.
var getFallbackConfig = function (filename = null) {
    if (!options.argv.noconfig) {
        return configfinder.getConfig(filename);
    }
};

// These reporters are usually parsed by other software, so I can't just echo a
// warning.  Creating a fake file is my best attempt.
const deprecatedReporter = function (errorReport, reporter) {
    if (errorReport.paths['coffeelint_fake_file.coffee'] == null) { errorReport.paths['coffeelint_fake_file.coffee'] = []; }
    errorReport.paths['coffeelint_fake_file.coffee'].push({
        level: 'warn',
        rule: 'commandline',
        message: `parameter --${reporter} is deprecated. \
Use --reporter ${reporter} instead`,
        lineNumber: 0,
    });
    return reporter;
};

const coreReporters = {
    default: require(path.join(thisdir, 'reporters', 'default')),
    csv: require(path.join(thisdir, 'reporters', 'csv')),
    jslint: require(path.join(thisdir, 'reporters', 'jslint')),
    checkstyle: require(path.join(thisdir, 'reporters', 'checkstyle')),
    raw: require(path.join(thisdir, 'reporters', 'raw')),
};

// Publish the error report and exit with the appropriate status.
const reportAndExit = function (errorReport, options) {
    let strReporter = options.argv.jslint
        ? deprecatedReporter(errorReport, 'jslint')
        : options.argv.csv
            ? deprecatedReporter(errorReport, 'csv')
            : options.argv.checkstyle
                ? deprecatedReporter(errorReport, 'checkstyle')
                : options.argv.reporter;

    if (strReporter == null) { strReporter = 'default'; }
    const SelectedReporter = coreReporters[strReporter] != null ? coreReporters[strReporter] : (function () {
        let reporterPath;
        try {
            reporterPath = resolve(strReporter, {
                basedir: process.cwd(),
                extensions: ['.js', '.coffee', '.litcoffee', '.coffee.md'],
            });
        } catch (error) {
            reporterPath = strReporter;
        }
        return require(reporterPath);
    }());

    if (options.argv.color == null) { options.argv.color = options.argv.nocolor ? 'never' : 'auto'; }

    const colorize = (() => {
        switch (options.argv.color) {
        case 'always': return true;
        case 'never': return false;
        default: return process.stdout.isTTY;
        }
    })();

    const reporter = new SelectedReporter(errorReport, {
        colorize,
        quiet: options.argv.q,
    });
    reporter.publish();

    return process.on('exit', () => process.exit(errorReport.getExitCode()));
};

// Declare command line options.
var options = optimist
    .usage('Usage: coffeelint [options] source [...]')
    .alias('f', 'file')
    .alias('h', 'help')
    .alias('v', 'version')
    .alias('s', 'stdin')
    .alias('q', 'quiet')
    .alias('c', 'cache')
    .describe('f', 'Specify a custom configuration file.')
    .describe('rules', 'Specify a custom rule or directory of rules.')
    .describe('makeconfig', 'Prints a default config file')
    .describe('trimconfig', 'Compares your config with the default and \
prints a minimal configuration')
    .describe('noconfig', 'Ignores any config file.')
    .describe('h', 'Print help information.')
    .describe('v', 'Print current version number.')
    .describe('r', '(not used, but left for backward compatibility)')
    .describe('reporter', 'built in reporter (default, csv, jslint, \
checkstyle, raw), or module, or path to reporter file.')
    .describe('csv', '[deprecated] use --reporter csv')
    .describe('jslint', '[deprecated] use --reporter jslint')
    .describe('nocolor', '[deprecated] use --color=never')
    .describe('checkstyle', '[deprecated] use --reporter checkstyle')
    .describe('color=<when>',
        'When to colorize the output. <when> can be one of always, never \
, or auto.')
    .describe('s', 'Lint the source from stdin')
    .describe('q', 'Only print errors.')
    .describe('literate',
        'Used with --stdin to process as Literate CoffeeScript')
    .describe('c', 'Cache linting results')
    .describe('ext',
        'Specify an additional file extension, separated by comma.')
    .boolean('csv')
    .boolean('jslint')
    .boolean('checkstyle')
    .boolean('nocolor')
    .boolean('noconfig')
    .boolean('makeconfig')
    .boolean('trimconfig')
    .boolean('literate')
    .boolean('r')
    .boolean('s')
    .boolean('q', 'Print errors only.')
    .boolean('c');

if (options.argv.v) {
    log(coffeelint.VERSION);
    process.exit(0);
} else if (options.argv.h) {
    options.showHelp();
    process.exit(0);
} else if (options.argv.trimconfig) {
    let left;
    const userConfig = (left = loadConfig(options)) != null ? left : getFallbackConfig();
    logConfig(coffeelint.trimConfig(userConfig));
} else if (options.argv.makeconfig) {
    logConfig(coffeelint.getRules());
} else if ((options.argv._.length < 1) && !options.argv.s) {
    options.showHelp();
    process.exit(1);
} else {
    // Initialize cache, if enabled
    if (options.argv.cache) {
        coffeelint.setCache(new Cache(path.join(os.tmpdir(), 'coffeelint')));
    }

    // Load configuration.
    const config = loadConfig(options);

    if (options.argv.rules) { ruleLoader.loadRule(coffeelint, options.argv.rules); }

    if (options.argv.s) {
        // Lint from stdin
        let data = '';
        const stdin = process.openStdin();
        stdin.on('data', (buffer) => {
            if (buffer) { return data += buffer.toString(); }
        });
        stdin.on('end', () => {
            const errorReport = lintSource(data, config, options.argv.literate);
            return reportAndExit(errorReport, options);
        });
    } else {
        // Find scripts to lint.
        const paths = options.argv._;
        let scripts = findCoffeeScripts(paths, options.argv.ext);
        if (fs.existsSync('.coffeelintignore')) {
            scripts = ignore()
                .add(fs.readFileSync('.coffeelintignore').toString())
                .filter(scripts);
        }

        // Lint the code.
        const errorReport = lintFiles(scripts, config, options.argv.literate);
        reportAndExit(errorReport, options);
    }
}
