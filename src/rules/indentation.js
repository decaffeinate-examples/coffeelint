/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let Indentation;
module.exports = (Indentation = (function() {
    Indentation = class Indentation {
        static initClass() {
    
            this.prototype.rule = {
                name: 'indentation',
                value: 2,
                level: 'error',
                message: 'Line contains inconsistent indentation',
                description: `\
This rule imposes a standard number of spaces to be used for
indentation. Since whitespace is significant in CoffeeScript, it's
critical that a project chooses a standard indentation format and
stays consistent. Other roads lead to darkness. <pre> <code>#
Enabling this option will prevent this ugly
# but otherwise valid CoffeeScript.
twoSpaces = () ->
  fourSpaces = () ->
      eightSpaces = () ->
            'this is valid CoffeeScript'
    
</code>
</pre>
Two space indentation is enabled by default.\
`
            };
    
            this.prototype.tokens = ['INDENT', '[', ']', '.'];
    
            this.prototype.keywords = [
              '->', '=>', '@', 'CATCH', 'CLASS', 'DEFAULT', 'ELSE', 'EXPORT',
              'FINALLY', 'FOR', 'FORIN', 'FOROF', 'IDENTIFIER', 'IF', 'IMPORT',
              'LEADING_WHEN', 'LOOP', 'PROPERTY', 'RETURN', 'SWITCH', 'THROW',
              'TRY', 'UNTIL', 'WHEN', 'WHILE', 'YIELD'
            ];
        }

        constructor() {
            this.arrayTokens = [];   // A stack tracking the array token pairs.
        }

        // Return an error if the given indentation token is not correct.
        lintToken(token, tokenApi) {
            let [type, numIndents] = Array.from(token);
            const { first_column: dotIndent } = token[2];
            const { lines, lineNumber } = tokenApi;

            const expected = tokenApi.config[this.rule.name].value;
            // See: 'Indented chained invocations with bad indents'
            // This actually checks the chained call to see if its properly indented
            if (type === '.') {
                // Keep this if statement separately, since we still need to let
                // the linting pass if the '.' token is not at the beginning of
                // the line
                const currentLine = lines[lineNumber];
                if (__guard__(currentLine.match(/\S/), x => x[0]) === '.') {
                    const next = tokenApi.peek(1);
                    if (next[0] === 'PROPERTY') {
                        const chain = '.' + next[1];
                        const startsWith = new RegExp('^(\\s*)(\\' + chain + ')');
                        const regExRes = currentLine.match(startsWith);
                        const spaces = (regExRes != null ? regExRes[1].length : undefined) || -1;
                        if (((regExRes != null ? regExRes.index : undefined) === 0) && (spaces === dotIndent)) {
                            let got = dotIndent;
                            if ((dotIndent - expected) > expected) {
                                got %= expected;
                            }

                            if ((dotIndent % expected) !== 0) {
                                return {
                                    context: `Expected ${expected} got ${got}`
                                };
                            }
                        }
                    }
                }

                return undefined;
            }

            if (['[', ']'].includes(type)) {
                this.lintArray(token);
                return undefined;
            }

            if ((token.generated != null) || (token.explicit != null)) { return null; }

            // Ignore the indentation inside of an array, so that
            // we can allow things like:
            //   x = ["foo",
            //             "bar"]
            const previous = tokenApi.peek(-1);
            const isArrayIndent = this.inArray() && (previous != null ? previous.newLine : undefined);

            // Ignore indents used to for formatting on multi-line expressions, so
            // we can allow things like:
            //   a = b =
            //     c = d
            const previousSymbol = __guard__(tokenApi.peek(-1), x1 => x1[0]);
            const isMultiline = ['=', ','].includes(previousSymbol);

            // Summarize the indentation conditions we'd like to ignore
            const ignoreIndent = isArrayIndent || isMultiline;

            // Correct CoffeeScript's incorrect INDENT token value when functions
            // get chained. See https://github.com/jashkenas/coffeescript/issues/3137
            // Also see CoffeeLint Issues: #4, #88, #128, and many more.
            numIndents = this.getCorrectIndent(tokenApi);

            // Now check the indentation.
            if (!ignoreIndent && !(Array.from(numIndents).includes(expected))) {
                return { context: `Expected ${expected} got ${numIndents[0]}` };
            }
        }

        // Return true if the current token is inside of an array.
        inArray() {
            return this.arrayTokens.length > 0;
        }

        // Lint the given array token.
        lintArray(token) {
            // Track the array token pairs
            if (token[0] === '[') {
                this.arrayTokens.push(token);
            } else if (token[0] === ']') {
                this.arrayTokens.pop();
            }
            // Return null, since we're not really linting
            // anything here.
            return null;
        }

        grabLineTokens(tokenApi, lineNumber, all) {
            if (all == null) { all = false; }
            const { tokensByLine } = tokenApi;
            while ((tokensByLine[lineNumber] == null) && (lineNumber !== 0)) { lineNumber--; }

            if (all) {
                return (() => {
                    const result = [];
                    for (let tok of Array.from(tokensByLine[lineNumber])) {                         result.push(tok);
                    }
                    return result;
                })();
            } else {
                return (() => {
                    const result1 = [];
                    for (let tok of Array.from(tokensByLine[lineNumber])) {                         if ((tok.generated == null) && (tok[0] !== 'OUTDENT')) {
                            result1.push(tok);
                        }
                    }
                    return result1;
                })();
            }
        }

        // Returns a corrected INDENT value if the current line is part of
        // a chained call. Otherwise returns original INDENT value.
        getCorrectIndent(tokenApi) {
            let prevIndent;
            const { lineNumber, lines, tokens } = tokenApi;

            const curIndent = __guard__(lines[lineNumber].match(/\S/), x => x.index);

            let prevNum = 1;
            while (/^\s*(#|$)/.test(lines[lineNumber - prevNum])) { prevNum += 1; }

            let prevTokens = this.grabLineTokens(tokenApi, lineNumber - prevNum);

            if ((prevTokens[0] != null ? prevTokens[0][0] : undefined) === 'INDENT') {
                // Pass both the INDENT value and the location of the first token
                // after the INDENT because sometimes CoffeeScript doesn't return
                // the correct INDENT if there is something like an if/else
                // inside an if/else inside of a -> function definition: e.g.
                //
                // ->
                //   r = if a
                //     if b
                //       2
                //     else
                //       3
                //   else
                //     4
                //
                // will error without: curIndent - prevTokens[1]?[2].first_column

                return [curIndent - (prevTokens[1] != null ? prevTokens[1][2].first_column : undefined),
                    curIndent - prevTokens[0][1]];
            } else {
                prevIndent = prevTokens[0] != null ? prevTokens[0][2].first_column : undefined;
                // This is a scan to handle extra indentation from if/else
                // statements to make them look nicer: e.g.
                //
                // r = if a
                //   true
                // else
                //   false
                //
                // is valid.
                //
                // r = if a
                //       true
                //     else
                //       false
                //
                // is also valid.
                for (let j = 0; j < prevTokens.length; j++) {
                    const _ = prevTokens[j];
                    if ((prevTokens[j][0] === '=') &&
                        (__guard__(prevTokens[j + 1], x1 => x1[0]) === 'IF')) {
                        const skipAssign = curIndent - prevTokens[j + 1][2].first_column;
                        const ret = curIndent - prevIndent;
                        if (skipAssign < 0) { return [ret]; }
                        return [skipAssign, ret];
                    }
                }

                // This happens when there is an extra indent to maintain long
                // conditional statements (IF/UNLESS): e.g.
                //
                // ->
                //   if a is c and
                //     (false or
                //       long.expression.that.necessitates(linebreak))
                //     @foo()
                //
                // is valid (note that there an only an extra indent in the last
                // statement is required and not the line above it
                //
                // ->
                //   if a is c and
                //       (false or
                //       long.expression.that.necessitates(linebreak))
                //     @foo()
                // is also OK.
                while (prevIndent > curIndent) {
                    const tryLine = lineNumber - prevNum;
                    prevTokens = this.grabLineTokens(tokenApi, tryLine, true);

                    // This is to handle weird object/string indentation.
                    // See: 'Handle edge-case weirdness with strings in objects'
                    //   test case in test_indentation.coffee or in the file,
                    //   test_no_empty_functions.coffee, which is why/how I
                    //   caught this.
                    if ((prevTokens[0] != null ? prevTokens[0][0] : undefined) === 'INDENT') {
                        prevIndent = prevTokens[0][1];
                        prevTokens = prevTokens.slice(1);
                    }

                    let t = 0;
                    // keep looping prevTokens until we find a token in @keywords
                    // or we just run out of tokens in prevTokens
                    while (!(prevTokens[t] == null) && !Array.from(this.keywords).includes(prevTokens[t][0])) {
                        t++;
                    }

                    // slice off everything before 't'
                    prevTokens = prevTokens.slice(t);
                    prevNum++;

                    // if there isn't a valid token, restart the while loop
                    if (prevTokens[0] == null) { continue; }

                    // set new "prevIndent"
                    prevIndent = prevTokens[0] != null ? prevTokens[0][2].first_column : undefined;
                }
            }

            return [curIndent - prevIndent];
        }
    };
    Indentation.initClass();
    return Indentation;
})());

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}