/* eslint-disable
    camelcase,
    class-methods-use-this,
    consistent-return,
    constructor-super,
    max-classes-per-file,
    max-len,
    no-constant-condition,
    no-eval,
    no-loop-func,
    no-multi-assign,
    no-param-reassign,
    no-restricted-syntax,
    no-shadow,
    no-this-before-super,
    no-underscore-dangle,
    no-unused-vars,
    no-use-before-define,
    no-var,
    vars-on-top,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS203: Remove `|| {}` from converted for-own loops
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let ASTLinter;
const BaseLinter = require('./base_linter');

const node_children = {
    Class: ['variable', 'parent', 'body'],
    Code: ['params', 'body'],
    For: ['body', 'source', 'guard', 'step'],
    If: ['condition', 'body', 'elseBody'],
    Obj: ['properties'],
    Op: ['first', 'second'],
    Switch: ['subject', 'cases', 'otherwise'],
    Try: ['attempt', 'recovery', 'ensure'],
    Value: ['base', 'properties'],
    While: ['condition', 'guard', 'body'],
};

const hasChildren = (node, children) => (__guard__(node != null ? node.children : undefined, (x) => x.length) === children.length)
&& (node != null ? node.children.every((elem, i) => elem === children[i]) : undefined);

class ASTApi {
    constructor(config) {
        this.config = config;
    }

    getNodeName(node) {
        let name = __guard__(node != null ? node.constructor : undefined, (x) => x.name);
        if (node_children[name]) {
            return name;
        }
        for (name of Object.keys(node_children || {})) {
            const children = node_children[name];
            if (hasChildren(node, children)) {
                return name;
            }
        }
    }
}


// A class that performs static analysis of the abstract
// syntax tree.
module.exports = (ASTLinter = class ASTLinter extends BaseLinter {
    constructor(source, config, rules, CoffeeScript) {
        {
            // Hack: trick Babel/TypeScript into allowing this before super.
            if (false) { super(); }
            const thisFn = (() => this).toString();
            const thisName = thisFn.match(/return (?:_assertThisInitialized\()*(\w+)\)*;/)[1];
            eval(`${thisName} = this;`);
        }
        this.CoffeeScript = CoffeeScript;
        super(source, config, rules);
        this.astApi = new ASTApi(this.config);
    }

    // This uses lintAST instead of lintNode because I think it makes it a bit
    // more clear that the rule needs to walk the AST on its own.
    acceptRule(rule) {
        return typeof rule.lintAST === 'function';
    }

    lint() {
        const errors = [];
        try {
            this.node = this.CoffeeScript.nodes(this.source);
        } catch (coffeeError) {
            // If for some reason you shut off the 'coffeescript_error' rule err
            // will be null and should NOT be added to errors
            const err = this._parseCoffeeScriptError(coffeeError);
            if (err != null) { errors.push(err); }
            return errors;
        }

        for (var rule of Array.from(this.rules)) {
            this.astApi.createError = (attrs) => {
                if (attrs == null) { attrs = {}; }
                return this.createError(rule.rule.name, attrs);
            };

            // HACK: Push the local errors object into the plugin. This is a
            // temporary solution until I have a way for it to really return
            // multiple errors.
            rule.errors = errors;
            const v = this.normalizeResult(rule, rule.lintAST(this.node, this.astApi));

            if (v != null) { return v; }
        }
        return errors;
    }

    _parseCoffeeScriptError(coffeeError) {
        const rule = this.config.coffeescript_error;

        const message = coffeeError.toString();

        // Parse the line number
        let lineNumber = -1;
        if (coffeeError.location != null) {
            lineNumber = coffeeError.location.first_line + 1;
        } else {
            const match = /line (\d+)/.exec(message);
            if ((match != null ? match.length : undefined) > 1) { lineNumber = parseInt(match[1], 10); }
        }
        const attrs = {
            message,
            level: rule.level,
            lineNumber,
        };
        return this.createError('coffeescript_error', attrs);
    }
});

function __guard__(value, transform) {
    return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
