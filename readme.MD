Laxson: lax JSON
================

Sometimes it is useful to parse non-compliant JSON for whatever reason:
* single quoted strings
* 0x00 hexadecimal numbers
* trailing commas
* comments
* missing delimiters/quotes/typos
* non-quoted property names

Laxson uses TypeScript fault-tolerant parser, and processes generated AST back to objects.

Parsing uses no unsafe `eval` and such, so even though it's lax, it's still safe.
Except data might be a bit garbage, if input is too garbled.

```javascript
var LAXSON = require('laxson');
console.log(JSON.stringify(LAXSON.parse('{ apple: [1, 0x2, 3_000] }')));
```