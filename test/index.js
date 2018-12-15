const assert = require('assert');

Array.prototype.contains = function (key) {
    return this.indexOf(key) >= 0;
}

const CommandFramework = require('../dist');
const keys = Object.keys(CommandFramework);

assert(keys.contains('AbstractPlugin'));
assert(keys.contains('CommandContext'));
assert(keys.contains('CommandError'));
assert(keys.contains('CommandHandler'));
assert(keys.contains('CommandParser'));
assert(keys.contains('CommandService'));
assert(keys.contains('types'));
assert(keys.contains('Buffer'));
assert(keys.contains('Builder'));
assert(keys.contains('Entity'));
assert(keys.contains('Info'));
assert(keys.contains('Model'));
assert(keys.contains('Reader'));
assert(keys.contains('Result'));
assert(keys.contains('Security'));
