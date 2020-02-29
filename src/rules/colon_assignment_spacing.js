/* eslint-disable
    consistent-return,
    default-case,
    func-names,
    no-multi-assign,
    no-shadow,
    no-unused-vars,
    radix,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let ColonAssignmentSpacing;
module.exports = (ColonAssignmentSpacing = (function () {
    ColonAssignmentSpacing = class ColonAssignmentSpacing {
        static initClass() {
            this.prototype.rule = {
                name: 'colon_assignment_spacing',
                level: 'ignore',
                message: 'Colon assignment without proper spacing',
                spacing: {
                    left: 0,
                    right: 0,
                },
                description: `\
<p>This rule checks to see that there is spacing before and
after the colon in a colon assignment (i.e., classes, objects).
The spacing amount is specified by
spacing.left and spacing.right, respectively.
A zero value means no spacing required.
</p>
<pre><code>
#
# If spacing.left and spacing.right is 1
#
    
# Doesn't throw an error
object = {spacing : true}
class Dog
  canBark : true
    
# Throws an error
object = {spacing: true}
class Cat
  canBark: false
</code></pre>\
`,
            };

            this.prototype.tokens = [':'];
        }

        lintToken(token, tokenApi) {
            const spaceRules = tokenApi.config[this.rule.name].spacing;
            const previousToken = tokenApi.peek(-1);
            const nextToken = tokenApi.peek(1);

            const getSpaceFromToken = function (direction) {
                switch (direction) {
                case 'left':
                    return token[2].first_column - previousToken[2].last_column - 1;
                case 'right':
                    return nextToken[2].first_column - token[2].first_column - 1;
                }
            };

            const checkSpacing = function (direction) {
                const spacing = getSpaceFromToken(direction);
                // when spacing is negative, the neighboring token is a newline
                const isSpaced = spacing < 0
                    ? true
                    : spacing === parseInt(spaceRules[direction]);

                return [isSpaced, spacing];
            };

            const [isLeftSpaced, leftSpacing] = Array.from(checkSpacing('left'));
            const [isRightSpaced, rightSpacing] = Array.from(checkSpacing('right'));

            if (isLeftSpaced && isRightSpaced) {
                return null;
            }
            return { context: `Incorrect spacing around column ${token[2].first_column}` };
        }
    };
    ColonAssignmentSpacing.initClass();
    return ColonAssignmentSpacing;
}()));
