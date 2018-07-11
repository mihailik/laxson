// @ts-check
/// <reference types="typescript" />
/// <reference types="node" />

if (typeof require === 'function' && typeof process !== 'undefined' && typeof process) {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  TSON = require('../tson.js');

  var lingeringLine = "";

  process.stdin.on('data', function (chunk) {
    lines = chunk.split("\n");
    lines[0] = lingeringLine + lines[0];
    lingeringLine = lines.pop();

    lines.forEach(processLine);

    function processLine(line) {
      var obj = TSON.parse(line);
      console.log(JSON.stringify(obj, null, 2));
    }
  });
}
else if (typeof window !== 'undefined' && window) {

  var TSON;

  /** @type {typeof import('typescript')} */
  var ts;

  var src = /** @type {HTMLTextAreaElement} */(document.getElementById('src'));
  var out = /** @type {HTMLTextAreaElement} */(document.getElementById('out'));

  function parse() {
    var srcText = src.value || '';
    var res = TSON.parse(srcText);

    out.value = JSON.stringify(res, null, 2);
  }

  parse();

  src.onchange = src.onkeydown = src.onkeyup = function () {
    clearTimeout(/** @type {any} */(src).__timeout);
  /** @type {any} */(src).__timeout = setTimeout(parse, 300);
  }
}