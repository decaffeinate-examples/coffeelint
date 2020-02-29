/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let LexicalLinter;
class TokenApi {
    static initClass() {  // A map of tokens by line.
    
        this.prototype.i = 0;
    }

    constructor(CoffeeScript, source, config, tokensByLine) {
        this.config = config;
        this.tokensByLine = tokensByLine;
        this.tokens = CoffeeScript.tokens(source);
        this.lines = source.split('\n');
        this.tokensByLine = {}; // The index of the current token we're linting.
    }

    // Return the token n places away from the current token.
    peek(n) {
        if (n == null) { n = 1; }
        return this.tokens[this.i + n] || null;
    }
}
TokenApi.initClass();

const BaseLinter = require('./base_linter.coffee');

//
// A class that performs checks on the output of CoffeeScript's lexer.
//
module.exports = (LexicalLinter = class LexicalLinter extends BaseLinter {

    constructor(source, config, rules, CoffeeScript) {
        super(source, config, rules);

        this.tokenApi = new TokenApi(CoffeeScript, source, this.config, this.tokensByLine);
        // This needs to be available on the LexicalLinter so it can be passed
        // to the LineLinter when this finishes running.
        this.tokensByLine = this.tokenApi.tokensByLine;
    }

    acceptRule(rule) {
        return typeof rule.lintToken === 'function';
    }

    // Return a list of errors encountered in the given source.
    lint() {
        const errors = [];

        for (let i = 0; i < this.tokenApi.tokens.length; i++) {
            const token = this.tokenApi.tokens[i];
            this.tokenApi.i = i;
            for (let error of Array.from(this.lintToken(token))) { errors.push(error); }
        }
        return errors;
    }


    // Return an error if the given token fails a lint check, false otherwise.
    lintToken(token) {
        const [type, value, { first_line: lineNumber }] = Array.from(token);

        if (this.tokensByLine[lineNumber] == null) { this.tokensByLine[lineNumber] = []; }
        this.tokensByLine[lineNumber].push(token);
        // CoffeeScript loses line numbers of interpolations and multi-line
        // regexes, so fake it by using the last line number we know.
        this.lineNumber = lineNumber || this.lineNumber || 0;

        this.tokenApi.lineNumber = this.lineNumber;

        // Multiple rules might run against the same token to build context.
        // Every rule should run even if something has already produced an
        // error for the same token.
        const errors = [];
        for (let rule of Array.from(this.rules)) {
            if (Array.from(rule.tokens).includes(token[0])) {
                const v = this.normalizeResult(rule, rule.lintToken(token, this.tokenApi));
                if (v != null) { errors.push(v); }
            }
        }
        return errors;
    }

    createError(ruleName, attrs) {
        if (attrs == null) { attrs = {}; }
        if (attrs.lineNumber == null) { attrs.lineNumber = this.lineNumber; }
        attrs.lineNumber += 1;
        attrs.line = this.tokenApi.lines[attrs.lineNumber - 1];
        return super.createError(ruleName, attrs);
    }
});
