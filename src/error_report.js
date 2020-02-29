/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// A summary of errors in a CoffeeLint run.
let ErrorReport;
module.exports = (ErrorReport = class ErrorReport {

    constructor(coffeelint) {
        this.coffeelint = coffeelint;
        this.paths = {};
    }

    lint(filename, source, config, literate) {
        if (config == null) { config = {}; }
        if (literate == null) { literate = false; }
        return this.paths[filename] = this.coffeelint.lint(source, config, literate);
    }

    getExitCode() {
        for (let path in this.paths) {
            if (this.pathHasError(path)) { return 1; }
        }
        return 0;
    }

    getSummary() {
        let errorCount, warningCount;
        let pathCount = (errorCount = (warningCount = 0));
        for (let path in this.paths) {
            const errors = this.paths[path];
            pathCount++;
            for (let error of Array.from(errors)) {
                if (error.level === 'error') { errorCount++; }
                if (error.level === 'warn') { warningCount++; }
            }
        }
        return { errorCount, warningCount, pathCount };
    }

    getErrors(path) {
        return this.paths[path];
    }

    pathHasWarning(path) {
        return this._hasLevel(path, 'warn');
    }

    pathHasError(path) {
        return this._hasLevel(path, 'error');
    }

    hasError() {
        for (let path in this.paths) {
            if (this.pathHasError(path)) { return true; }
        }
        return false;
    }

    _hasLevel(path, level) {
        for (let error of Array.from(this.paths[path])) {
            if (error.level === level) { return true; }
        }
        return false;
    }
});
