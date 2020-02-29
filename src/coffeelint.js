/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS201: Simplify complex destructure assignments
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
/*
CoffeeLint

Copyright (c) 2011 Matthew Perpick.
CoffeeLint is freely distributable under the MIT license.
*/

// Coffeelint's namespace.
// Browserify wrapps this file in a UMD that will set window.coffeelint to
// exports
let CoffeeScript, RULES;
const coffeelint = exports;

// Hide from browserify
const nodeRequire = require;

if (typeof window !== 'undefined' && window !== null) {
    // If we're in the browser assume CoffeeScript is already loaded.
    ({
        CoffeeScript
    } = window);
}
// By using nodeRequire it prevents browserify from finding this dependency.
// If it isn't hidden there is an error attempting to inline CoffeeScript.
// if browserify uses `-i` to ignore the dependency it creates an empty shim
// which breaks NodeJS
// https://github.com/substack/node-browserify/issues/471
//
// Atom has a `window`, but not a `window.CoffeeScript`. Calling `nodeRequire`
// here should fix Atom without breaking anything else.
if (CoffeeScript == null) { CoffeeScript = nodeRequire('coffeescript'); }

if (CoffeeScript == null) {
    throw new Error('Unable to find CoffeeScript');
}

// Browserify will inline the file at compile time.
const packageJSON = require('./../package.json');

// The current version of Coffeelint.
coffeelint.VERSION = packageJSON.version;

// CoffeeLint error levels.
const ERROR   = 'error';
const WARN    = 'warn';
const IGNORE  = 'ignore';

coffeelint.RULES = (RULES = require('./rules.coffee'));

// Patch the source properties onto the destination.
const extend = function(destination, ...sources) {
    for (let source of Array.from(sources)) {
        for (let k in source) { const v = source[k]; destination[k] = v; }
    }
    return destination;
};

// Patch any missing attributes from defaults to source.
const defaults = (source, defaults) => extend({}, defaults, source);

// Helper to add rules to disabled list
const union = function(a, b) {
    let x;
    const c = {};
    for (x of Array.from(a)) {
        c[x] = true;
    }
    for (x of Array.from(b)) {
        c[x] = true;
    }

    return (() => {
        const result = [];
        for (x in c) {
            result.push(x);
        }
        return result;
    })();
};

// Helper to remove rules from disabled list
const difference = (a, b) => Array.from(a).filter((x) => !Array.from(b).includes(x));

const LineLinter = require('./line_linter.coffee');
const LexicalLinter = require('./lexical_linter.coffee');
const ASTLinter = require('./ast_linter.coffee');

// Cache instance, disabled by default
let cache = null;

// Merge default and user configuration.
const mergeDefaultConfig = function(userConfig) {
    // When run from the browser it may not be able to find the ruleLoader.
    try {
        const ruleLoader = nodeRequire('./ruleLoader');
        ruleLoader.loadFromConfig(coffeelint, userConfig);
    } catch (error) {}

    const config = {};
    if (userConfig.coffeelint) {
        config.coffeelint = userConfig.coffeelint;
    }
    for (let rule in RULES) {
        const ruleConfig = RULES[rule];
        config[rule] = defaults(userConfig[rule], ruleConfig);
    }
    return config;
};

const sameJSON = (a, b) => JSON.stringify(a) === JSON.stringify(b);

coffeelint.trimConfig = function(userConfig) {
    const newConfig = {};
    userConfig = mergeDefaultConfig(userConfig);
    for (let rule in userConfig) {
        const config = userConfig[rule];
        const dConfig = RULES[rule];

        if (rule === 'coffeelint') {
            config.transforms = config._transforms;
            delete config._transforms;

            config.coffeescript = config._coffeescript;
            delete config._coffeescript;

            newConfig[rule] = config;
        } else if (config.level === dConfig.level && dConfig.level === 'ignore') {
            // If the rule is going to be ignored and would be by default it
            // doesn't matter what you may have configured
            undefined;
        } else if (config.level === 'ignore') {
            // If the rule is being ignored you don't need the rest of the
            // config.
            newConfig[rule] = { level: 'ignore' };
        } else {
            config.module = config._module;
            delete config._module;
            for (let key in config) {
                const value = config[key];
                if (['message', 'description', 'name'].includes(key)) { continue; }

                const dValue = dConfig[key];
                if ((value !== dValue) && !sameJSON(value, dValue)) {
                    if (newConfig[rule] == null) { newConfig[rule] = {}; }
                    newConfig[rule][key] = value;
                }
            }
        }
    }
    return newConfig;
};

coffeelint.invertLiterate = function(source) {
    source = CoffeeScript.helpers.invertLiterate(source);
    // Strip the first 4 spaces or a tab from every line.
    // After this the markdown is commented and all of the other code
    // should be at their natural location.
    let newSource = '';
    for (let line of Array.from(source.split('\n'))) {
        if (line.match(/^#/)) {
            // strip trailing space
            line = line.replace(/\s*$/, '');
        }
        // Strip the first 4 spaces or a tab of every line. This is how Markdown
        // indicates code, so in the end this pulls everything back to where it
        // would be indented if it hadn't been written in literate style.
        line = line.replace(/^[ ]{4}|^\t/g, '');
        newSource += `${line}\n`;
    }

    return newSource;
};

const _rules = {};
coffeelint.registerRule = function(RuleConstructor, ruleName) {
    if (ruleName == null) { ruleName = undefined; }
    const p = new RuleConstructor;

    const name = __guard__(p != null ? p.rule : undefined, x => x.name) || '(unknown)';
    const e = function(msg) { throw new Error(`Invalid rule: ${name} ${msg}`); };
    if (p.rule == null) {
        e('Rules must provide rule attribute with a default configuration.');
    }

    if (p.rule.name == null) { e('Rule defaults require a name'); }

    if ((ruleName != null) && (ruleName !== p.rule.name)) {
        e(`Mismatched rule name: ${ruleName}`);
    }

    if (p.rule.message == null) { e('Rule defaults require a message'); }
    if (p.rule.description == null) { e('Rule defaults require a description'); }
    if (!['ignore', 'warn', 'error'].includes(p.rule.level)) {
        e("Default level must be 'ignore', 'warn', or 'error'");
    }

    if (typeof p.lintToken === 'function') {
        if (!p.tokens) { e("'tokens' is required for 'lintToken'"); }
    } else if ((typeof p.lintLine !== 'function') &&
            (typeof p.lintAST !== 'function')) {
        e('Rules must implement lintToken, lintLine, or lintAST');
    }

    // Capture the default options for the new rule.
    RULES[p.rule.name] = p.rule;
    return _rules[p.rule.name] = RuleConstructor;
};

coffeelint.getRules = function() {
    const output = {};
    for (let key of Array.from(Object.keys(RULES).sort())) {
        output[key] = RULES[key];
    }
    return output;
};

// These all need to be explicitly listed so they get picked up by browserify.
coffeelint.registerRule(require('./rules/arrow_spacing.coffee'));
coffeelint.registerRule(require('./rules/braces_spacing.coffee'));
coffeelint.registerRule(require('./rules/no_tabs.coffee'));
coffeelint.registerRule(require('./rules/no_trailing_whitespace.coffee'));
coffeelint.registerRule(require('./rules/max_line_length.coffee'));
coffeelint.registerRule(require('./rules/line_endings.coffee'));
coffeelint.registerRule(require('./rules/no_trailing_semicolons.coffee'));
coffeelint.registerRule(require('./rules/indentation.coffee'));
coffeelint.registerRule(require('./rules/camel_case_classes.coffee'));
coffeelint.registerRule(require('./rules/colon_assignment_spacing.coffee'));
coffeelint.registerRule(require('./rules/no_implicit_braces.coffee'));
coffeelint.registerRule(require('./rules/no_nested_string_interpolation.coffee'));
coffeelint.registerRule(require('./rules/no_plusplus.coffee'));
coffeelint.registerRule(require('./rules/no_throwing_strings.coffee'));
coffeelint.registerRule(require('./rules/no_backticks.coffee'));
coffeelint.registerRule(require('./rules/no_implicit_parens.coffee'));
coffeelint.registerRule(require('./rules/no_empty_param_list.coffee'));
coffeelint.registerRule(require('./rules/no_stand_alone_at.coffee'));
coffeelint.registerRule(require('./rules/space_operators.coffee'));
coffeelint.registerRule(require('./rules/duplicate_key.coffee'));
coffeelint.registerRule(require('./rules/empty_constructor_needs_parens.coffee'));
coffeelint.registerRule(require('./rules/cyclomatic_complexity.coffee'));
coffeelint.registerRule(require('./rules/newlines_after_classes.coffee'));
coffeelint.registerRule(require('./rules/no_unnecessary_fat_arrows.coffee'));
coffeelint.registerRule(require('./rules/missing_fat_arrows.coffee'));
coffeelint.registerRule(
    require('./rules/non_empty_constructor_needs_parens.coffee')
);
coffeelint.registerRule(require('./rules/no_unnecessary_double_quotes.coffee'));
coffeelint.registerRule(require('./rules/no_debugger.coffee'));
coffeelint.registerRule(
    require('./rules/no_interpolation_in_single_quotes.coffee')
);
coffeelint.registerRule(require('./rules/no_empty_functions.coffee'));
coffeelint.registerRule(require('./rules/prefer_english_operator.coffee'));
coffeelint.registerRule(require('./rules/spacing_after_comma.coffee'));
coffeelint.registerRule(
    require('./rules/transform_messes_up_line_numbers.coffee')
);
coffeelint.registerRule(require('./rules/ensure_comprehensions.coffee'));
coffeelint.registerRule(require('./rules/no_this.coffee'));
coffeelint.registerRule(require('./rules/eol_last.coffee'));
coffeelint.registerRule(require('./rules/no_private_function_fat_arrows.coffee'));

const hasSyntaxError = function(source) {
    try {
        // If there are syntax errors this will abort the lexical and line
        // linters.
        CoffeeScript.tokens(source);
        return false;
    } catch (error) {}
    return true;
};

const ErrorReport = require('./error_report.coffee');
coffeelint.getErrorReport = () => new ErrorReport(coffeelint);

// Check the source against the given configuration and return an array
// of any errors found. An error is an object with the following
// properties:
//
//   {
//       rule :      'Name of the violated rule',
//       lineNumber: 'Number of the line that caused the violation',
//       level:      'The error level of the violated rule',
//       message:    'Information about the violated rule',
//       context:    'Optional details about why the rule was violated'
//   }
//
coffeelint.lint = function(source, userConfig, literate) {
    let inlineConfig, name, rule, ruleLoader, set;
    if (userConfig == null) { userConfig = {}; }
    if (literate == null) { literate = false; }
    let errors = [];

    if (cache != null) {
        cache.setConfig(userConfig);
    }
    if (cache != null ? cache.has(source) : undefined) { return (cache != null ? cache.get(source) : undefined); }
    const config = mergeDefaultConfig(userConfig);

    if (literate) { source = this.invertLiterate(source); }
    if (__guard__(userConfig != null ? userConfig.coffeelint : undefined, x => x.transforms) != null) {
        const sourceLength = source.split('\n').length;
        for (let m of Array.from(__guard__(userConfig != null ? userConfig.coffeelint : undefined, x1 => x1.transforms))) {
            try {
                ruleLoader = nodeRequire('./ruleLoader');
                const transform = ruleLoader.require(m);
                source = transform(source);
            } catch (error) {}
        }

        // NOTE: This can have false negatives. For example if your transformer
        // changes one line into two early in the file and later condenses two
        // into one you'll end up with the same length and not get the warning
        // even though everything in between will be off by one.
        if ((sourceLength !== source.split('\n').length) &&
                (config.transform_messes_up_line_numbers.level !== 'ignore')) {

            errors.push(extend(
                {
                    lineNumber: 1,
                    context: `File was transformed from \
${sourceLength} lines to \
${source.split("\n").length} lines`
                },
                config.transform_messes_up_line_numbers
            ));
        }
    }

    if (__guard__(userConfig != null ? userConfig.coffeelint : undefined, x2 => x2.coffeescript) != null) {
        CoffeeScript = ruleLoader.require(userConfig.coffeelint.coffeescript);
    }

    // coffeescript_error is unique because it's embedded in the ASTLinter. It
    // indicates a syntax error and would not work well as a stand alone rule.
    //
    // Why can't JSON just support comments?
    for (name in userConfig) {
        if (!['coffeescript_error', '_comment'].includes(name)) {
            if (_rules[name] == null) {
                // TODO: Figure out a good way to notify the user that they have
                // configured a rule that doesn't exist. throwing an Error was
                // definitely a mistake. I probably need a good way to generate lint
                // warnings for configuration.
                undefined;
            }
        }
    }

    // disabledInitially is to prevent the rule from becoming active before
    // the actual inlined comment appears
    const disabledInitially = [];
    // Check ahead for inline enabled rules
    for (let l of Array.from(source.split('\n'))) {
        var array, regex;
        array = LineLinter.getDirective(l) || [],
            regex = array[0],
            set = array[1],
            rule = array[array.length - 1];
        if (['enable', 'enable-line'].includes(set) && ((config[rule] != null ? config[rule].level : undefined) === 'ignore')) {
            disabledInitially.push(rule);
            config[rule].level = 'error';
        }
    }

    // Do AST linting first so all compile errors are caught.
    const astErrors = new ASTLinter(source, config, _rules, CoffeeScript).lint();
    errors = errors.concat(astErrors);

    // only do further checks if the syntax is okay, otherwise they just fail
    // with syntax error exceptions
    if (!hasSyntaxError(source)) {
        // Do lexical linting.
        const lexicalLinter = new LexicalLinter(source, config, _rules, CoffeeScript);
        const lexErrors = lexicalLinter.lint();
        errors = errors.concat(lexErrors);

        // Do line linting.
        const {
            tokensByLine
        } = lexicalLinter;
        const lineLinter = new LineLinter(source, config, _rules, tokensByLine,
            literate);
        const lineErrors = lineLinter.lint();
        errors = errors.concat(lineErrors);
        ({
            inlineConfig
        } = lineLinter);
    } else {
        // default this so it knows what to do
        inlineConfig = {
            enable: {},
            disable: {},
            'enable-line': {},
            'disable-line': {}
        };
    }

    // Sort by line number and return.
    errors.sort((a, b) => a.lineNumber - b.lineNumber);

    // Create a list of all errors
    const disabledEntirely = (function() {
        const result = [];
        const map = {};
        for ({ name } of Array.from(errors || [])) {
            if (!map[name]) {
                result.push(name);
                map[name] = true;
            }
        }
        return result;
    })();

    // Disable/enable rules for inline blocks
    const allErrors = errors;
    errors = [];
    let disabled = disabledInitially;
    let nextLine = 0;
    for (let i = 0, end = source.split('\n').length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
        var disabledLine = disabled;
        for (let cmd in inlineConfig) {
            var rules = inlineConfig[cmd][i];
            if (rules != null) { ({
                'disable'() {
                    if (rules.length) {
                        disabled = union(disabled, rules);
                        return disabledLine = union(disabledLine, rules);
                    } else {
                        return disabled = (disabledLine = disabledEntirely);
                    }
                },
                'disable-line'() {
                    if (rules.length) {
                        return disabledLine = union(disabledLine, rules);
                    } else {
                        return disabledLine = disabledEntirely;
                    }
                },
                'enable'() {
                    if (rules.length) {
                        disabled = difference(disabled, rules);
                        return disabledLine = difference(disabledLine, rules);
                    } else {
                        return disabled = (disabledLine = disabledInitially);
                    }
                },
                'enable-line'() {
                    if (rules.length) {
                        return disabledLine = difference(disabledLine, rules);
                    } else {
                        return disabledLine = disabledInitially;
                    }
                }
            }[cmd]()); }
        }
        // advance line and append relevant messages
        while ((nextLine === i) && (allErrors.length > 0)) {
            nextLine = allErrors[0].lineNumber - 1;
            let e = allErrors[0];
            if ((e.lineNumber === (i + 1)) || (e.lineNumber == null)) {
                e = allErrors.shift();
                if (!Array.from(disabledLine).includes(e.rule)) { errors.push(e); }
            }
        }
    }

    if (cache != null) {
        cache.set(source, errors);
    }

    return errors;
};

coffeelint.setCache = obj => cache = obj;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}