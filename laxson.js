//@ts-check
/// <reference types="typescript" />

/** @type {{ parse?(str: string): any }} */
var LAXSON;
(
    /**
     * @param LAXSON
     * @param {typeof import('typescript')} ts
     */
    function (LAXSON, ts) {

        /**
         * @param {string} str
         */
        function parse(str) {

            var rootAst = ts.parseJsonText('file.json', str);

            if (!rootAst.statements.length)
                return void 0;

            var printer = ts.createPrinter();

            var srcfi = ts.createSourceFile('file.json', '', ts.ScriptTarget.JSON);

            return parseNode(rootAst.statements[0]);

            /**
             * @param {import('typescript').Node} node
             */
            function parseNode(node) {
                var root;
                var rootFound = false;
                seekRoot(node);
                return root;

                /**
                 * @param {import('typescript').Node} node
                 */
                function seekRoot(node) {
                    if (ts.isObjectLiteralExpression(node)) {
                        rootFound = true;
                        root = {};
                        ts.forEachChild(node, seekPropertyAssignments);
                    }
                    else if (ts.isArrayLiteralExpression(node)) {
                        rootFound = true;
                        root = [];
                        ts.forEachChild(node, seekArrayElements);
                    }
                    else if (node.kind === ts.SyntaxKind.TrueKeyword) {
                        rootFound = true;
                        root = true;
                    }
                    else if (node.kind === ts.SyntaxKind.FalseKeyword) {
                        rootFound = true;
                        root = false;
                    }
                    else if (node.kind === ts.SyntaxKind.NullKeyword) {
                        rootFound = true;
                        root = null;
                    }
                    else if (node.kind === ts.SyntaxKind.StringLiteral || node.kind === ts.SyntaxKind.FirstLiteralToken) {
                        var text = printer.printNode(ts.EmitHint.Expression, node, srcfi);
                        rootFound = true;
                        root = JSON.parse(text);
                    }
                    else if (node.kind === ts.SyntaxKind.FirstTemplateToken || node.kind === ts.SyntaxKind.TemplateExpression) {
                        rootFound = true;
                        root = nodeText(node).slice(1, -1);
                    }
                    if (!rootFound) {
                        ts.forEachChild(node, seekRoot);
                    }
                    return rootFound;
                }
                function seekPropertyAssignments(node) {
                    if (!ts.isPropertyAssignment(node))
                        return;
                    var name = node.name;
                    var nameStr;
                    if (ts.isStringLiteral(name)) {
                        nameStr = JSON.parse(printer.printNode(ts.EmitHint.Expression, name, srcfi));
                    }
                    else {
                        nameStr = nodeText(name);
                    }
                    var value = parseNode(node.initializer);
                    root[nameStr] = value;
                }
                function seekArrayElements(node) {
                    if (ts.isOmittedExpression(node)) {
                        root.push(void 0);
                    }
                    else {
                        root.push(parseNode(node));
                    }
                }
            }
            function nodeText(node) {
                return typeof node.text === 'string' ?
                    node.text :
                    str.slice(node.pos, node.end);
            }
        }
        LAXSON.parse = parse;
    })(
        typeof exports !== 'undefined' && exports ? exports :
        LAXSON || (LAXSON = {}),
            typeof ts !== 'undefined' && ts ? ts :
                require('typescript')
    );
