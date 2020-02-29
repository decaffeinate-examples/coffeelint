/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let BracesSpacing;
module.exports = (BracesSpacing = (function() {
    BracesSpacing = class BracesSpacing {
        static initClass() {
    
            this.prototype.rule = {
                name: 'braces_spacing',
                level: 'ignore',
                spaces: 0,
                empty_object_spaces: 0,
                message: 'Curly braces must have the proper spacing',
                description: `\
This rule checks to see that there is the proper spacing inside
curly braces. The spacing amount is specified by "spaces".
The spacing amount for empty objects is specified by
"empty_object_spaces".
    
<pre><code>
# Spaces is 0
{a: b}     # Good
{a: b }    # Bad
{ a: b}    # Bad
{ a: b }   # Bad
    
# Spaces is 1
{a: b}     # Bad
{a: b }    # Bad
{ a: b}    # Bad
{ a: b }   # Good
{ a: b  }  # Bad
{  a: b }  # Bad
{  a: b  } # Bad
    
# Empty Object Spaces is 0
{}         # Good
{ }        # Bad
    
# Empty Object Spaces is 1
{}         # Bad
{ }        # Good
</code></pre>
    
This rule is disabled by default.\
`
            };
    
            this.prototype.tokens = ['{', '}'];
        }

        distanceBetweenTokens(firstToken, secondToken) {
            return secondToken[2].first_column - firstToken[2].last_column - 1;
        }

        findNearestToken(token, tokenApi, difference) {
            let totalDifference = 0;
            while (true) {
                totalDifference += difference;
                const nearestToken = tokenApi.peek(totalDifference);
                if ((nearestToken[0] === 'OUTDENT') || (nearestToken.generated != null)) { continue; }
                return nearestToken;
            }
        }

        tokensOnSameLine(firstToken, secondToken) {
            return firstToken[2].first_line === secondToken[2].first_line;
        }

        getExpectedSpaces(tokenApi, firstToken, secondToken) {
            const config = tokenApi.config[this.rule.name];
            if ((firstToken[0] === '{') && (secondToken[0] === '}')) {
                return config.empty_object_spaces != null ? config.empty_object_spaces : config.spaces;
            } else {
                return config.spaces;
            }
        }

        lintToken(token, tokenApi) {
            if (token.generated) { return null; }

            const [firstToken, secondToken] = Array.from(token[0] === '{' ?
                [token, this.findNearestToken(token, tokenApi, 1)]
            :
                [this.findNearestToken(token, tokenApi, -1), token]);

            if (!this.tokensOnSameLine(firstToken, secondToken)) { return null; }

            const expected = this.getExpectedSpaces(tokenApi, firstToken, secondToken);
            const actual = this.distanceBetweenTokens(firstToken, secondToken);

            if (actual === expected) {
                return null;
            } else {
                let msg = `There should be ${expected} space`;
                if (expected !== 1) { msg += 's'; }
                msg += ` inside \"${token[0]}\"`;
                return {context: msg};
            }
        }
    };
    BracesSpacing.initClass();
    return BracesSpacing;
})());
