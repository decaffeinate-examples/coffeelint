/* eslint-disable
    class-methods-use-this,
    max-classes-per-file,
    no-multi-assign,
    no-param-reassign,
    no-plusplus,
    no-restricted-syntax,
    no-shadow,
    no-unused-vars,
    no-useless-escape,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

let LineLinter;
class LineApi {
    static initClass() {
        this.prototype.lineNumber = 0;
    }

    constructor(source, config, tokensByLine, literate) {
        this.config = config;
        this.tokensByLine = tokensByLine;
        this.literate = literate;
        this.line = null;
        this.lines = source.split('\n');
        this.lineCount = this.lines.length;

        // maintains some contextual information
        //   inClass: bool; in class or not
        //   lastUnemptyLineInClass: null or lineNumber, if the last not-empty
        //                     line was in a class it holds its number
        //   classIndents: the number of indents within a class
        this.context = {
            class: {
                inClass: false,
                lastUnemptyLineInClass: null,
                classIndents: null,
            },
        };
    }

    isLiterate() { return this.literate; }

    // maintain the contextual information for class-related stuff
    maintainClassContext(line) {
        if (this.context.class.inClass) {
            if (this.lineHasToken('INDENT')) {
                this.context.class.classIndents++;
            } else if (this.lineHasToken('OUTDENT')) {
                this.context.class.classIndents--;
                if (this.context.class.classIndents === 0) {
                    this.context.class.inClass = false;
                    this.context.class.classIndents = null;
                }
            }
            if (!line.match(/^\s*$/)) {
                this.context.class.lastUnemptyLineInClass = this.lineNumber;
            }
        } else {
            if (!line.match(/\\s*/)) {
                this.context.class.lastUnemptyLineInClass = null;
            }

            if (this.lineHasToken('CLASS')) {
                this.context.class.inClass = true;
                this.context.class.lastUnemptyLineInClass = this.lineNumber;
                this.context.class.classIndents = 0;
            }
        }

        return null;
    }

    isLastLine() {
        return this.lineNumber === (this.lineCount - 1);
    }

    // Return true if the given line actually has tokens.
    // Optional parameter to check for a specific token type and line number.
    lineHasToken(tokenType = null, lineNumber = null) {
        lineNumber = lineNumber != null ? lineNumber : this.lineNumber;
        if (tokenType == null) {
            return (this.tokensByLine[lineNumber] != null);
        }
        const tokens = this.tokensByLine[lineNumber];
        if (tokens == null) { return null; }
        for (const token of Array.from(tokens)) {
            if (token[0] === tokenType) { return true; }
        }
        return false;
    }

    // Return tokens for the given line number.
    getLineTokens() {
        return this.tokensByLine[this.lineNumber] || [];
    }
}
LineApi.initClass();


const BaseLinter = require('./base_linter');

// Some repeatedly used regular expressions.
const configStatement = /coffeelint:\s*((disable|enable)(-line)?)(?:=([\w\s,]*))?/;
const configShortcuts = [
    // TODO: make this user (and / or api) configurable
    [/\#.*noqa/, 'coffeelint: disable-line'],
];

//
// A class that performs regex checks on each line of the source.
//
module.exports = (LineLinter = class LineLinter extends BaseLinter {
    static getDirective(line) {
        for (const [shortcut, replacement] of Array.from(configShortcuts)) {
            if (line.match(shortcut)) {
                return configStatement.exec(replacement);
            }
        }
        return configStatement.exec(line);
    }

    constructor(source, config, rules, tokensByLine, literate) {
        if (literate == null) { literate = false; }
        super(source, config, rules);

        this.lineApi = new LineApi(source, config, tokensByLine, literate);

        // Store suppressions in the form of { line #: type }
        this.inlineConfig = {
            enable: {},
            disable: {},
            'enable-line': {},
            'disable-line': {},
        };
    }

    acceptRule(rule) {
        return typeof rule.lintLine === 'function';
    }

    lint() {
        const errors = [];
        for (let lineNumber = 0; lineNumber < this.lineApi.lines.length; lineNumber++) {
            const line = this.lineApi.lines[lineNumber];
            this.lineApi.lineNumber = (this.lineNumber = lineNumber);
            this.lineApi.line = this.lineApi.lines[lineNumber];
            this.lineApi.maintainClassContext(line);
            this.collectInlineConfig(line);

            for (const error of Array.from(this.lintLine(line))) { errors.push(error); }
        }
        return errors;
    }

    // Return an error if the line contained failed a rule, null otherwise.
    lintLine(line) {
        // Multiple rules might run against the same line to build context.
        // Every every rule should run even if something has already produced an
        // error for the same token.
        const errors = [];
        for (const rule of Array.from(this.rules)) {
            const v = this.normalizeResult(rule, rule.lintLine(line, this.lineApi));
            if (v != null) { errors.push(v); }
        }
        return errors;
    }

    collectInlineConfig(line) {
        // Check for block config statements enable and disable
        const result = this.constructor.getDirective(line);
        if (result != null) {
            const cmd = result[1];
            const rules = [];
            if (result[4] != null) {
                for (const r of Array.from(result[4].split(','))) {
                    rules.push(r.replace(/^\s+|\s+$/g, ''));
                }
            }
            this.inlineConfig[cmd][this.lineNumber] = rules;
        }
        return null;
    }


    createError(rule, attrs) {
        if (attrs == null) { attrs = {}; }
        attrs.lineNumber = this.lineNumber + 1; // Lines are indexed by zero.
        attrs.level = this.config[rule] != null ? this.config[rule].level : undefined;
        return super.createError(rule, attrs);
    }
});
