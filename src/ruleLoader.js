/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const path = require('path');
const resolve = require('resolve').sync;

// moduleName is a NodeJS module, or a path to a module NodeJS can load.
module.exports = {
    require(moduleName) {
        try {
            // Try to find the project-level rule first.
            const rulePath = resolve(moduleName, {
                basedir: process.cwd(),
                extensions: ['.js', '.coffee', '.litcoffee', '.coffee.md']
            });
            return require(rulePath);
        } catch (error) {}
        try {
            // Globally installed rule
            return require(moduleName);
        } catch (error1) {}
        try {
            // Maybe the user used a relative path from the command line. This
            // doesn't make much sense from a config file, but seems natural
            // with the --rules option.
            //
            // No try around this one, an exception here should abort the rest of
            // this function.
            return require(path.resolve(process.cwd(), moduleName));
        } catch (error2) {}

        // This was already tried once. It will definitely fail, but it will
        // fail with a more sensible error message than the last require()
        // above.
        return require(moduleName);
    },

    loadFromConfig(coffeelint, config) {
        return (() => {
            const result = [];
            for (let ruleName in config) {
                const data = config[ruleName];
                if ((data != null ? data.module : undefined) != null) {
                    result.push(this.loadRule(coffeelint, data.module, ruleName));
                }
            }
            return result;
        })();
    },

    // moduleName is a NodeJS module, or a path to a module NodeJS can load.
    loadRule(coffeelint, moduleName, ruleName) {
        if (ruleName == null) { ruleName = undefined; }
        try {
            const ruleModule = this.require(moduleName);

            // Most rules can export as a single constructor function
            if (typeof ruleModule === 'function') {
                return coffeelint.registerRule(ruleModule, ruleName);
            } else {
                // Or it can export an array of rules to load.
                return Array.from(ruleModule).map((rule) =>
                    coffeelint.registerRule(rule));
            }
        } catch (e) {
            // coffeelint: disable=no_debugger
            console.error(`Error loading ${moduleName}`);
            throw e;
        }
    }
};
            // coffeelint: enable=no_debugger
