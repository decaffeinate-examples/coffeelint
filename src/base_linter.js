/* eslint-disable
    class-methods-use-this,
    consistent-return,
    func-names,
    guard-for-in,
    no-multi-assign,
    no-param-reassign,
    no-restricted-syntax,
    no-shadow,
    no-unused-vars,
    no-var,
    vars-on-top,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Patch the source properties onto the destination.
let BaseLinter;
const extend = function (destination, ...sources) {
    for (const source of Array.from(sources)) {
        for (const k in source) { const v = source[k]; destination[k] = v; }
    }
    return destination;
};

// Patch any missing attributes from defaults to source.
const defaults = (source, defaults) => extend({}, defaults, source);

module.exports = (BaseLinter = class BaseLinter {
    constructor(source, config, rules) {
        this.source = source;
        this.config = config;
        this.setupRules(rules);
    }

    isObject(obj) {
        return obj === Object(obj);
    }

    // Create an error object for the given rule with the given
    // attributes.
    createError(ruleName, attrs) {
        // Level should default to what's in the config, but can be overridden.
        if (attrs == null) { attrs = {}; }
        if (attrs.level == null) { attrs.level = this.config[ruleName].level; }

        const {
            level,
        } = attrs;
        if (!['ignore', 'warn', 'error'].includes(level)) {
            throw new Error(`unknown level ${level} for rule: ${ruleName}`);
        }

        if (['error', 'warn'].includes(level)) {
            attrs.rule = ruleName;
            return defaults(attrs, this.config[ruleName]);
        }
        return null;
    }

    acceptRule(rule) {
        throw new Error('acceptRule needs to be overridden in the subclass');
    }

    // Only rules that have a level of error or warn will even get constructed.
    setupRules(rules) {
        this.rules = [];
        return (() => {
            const result = [];
            for (const name in rules) {
                var rule;
                const RuleConstructor = rules[name];
                const {
                    level,
                } = this.config[name];
                if (['error', 'warn'].includes(level)) {
                    rule = new RuleConstructor(this, this.config);
                    if (this.acceptRule(rule)) {
                        result.push(this.rules.push(rule));
                    } else {
                        result.push(undefined);
                    }
                } else if (level !== 'ignore') {
                    throw new Error(`unknown level ${level} for rule: ${rule}`);
                } else {
                    result.push(undefined);
                }
            }
            return result;
        })();
    }

    normalizeResult(p, result) {
        if (result === true) {
            return this.createError(p.rule.name);
        }
        if (this.isObject(result)) {
            return this.createError(p.rule.name, result);
        }
    }
});
