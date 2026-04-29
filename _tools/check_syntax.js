// Verificacion de sintaxis pura usando el parser de TypeScript.
// Solo comprueba que el archivo se PARSEE bien (sin errores de tipos),
// porque tsc no conoce las APIs de MakeCode Arcade (img`...`, sprites, etc.).
const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const archivos = [
    "../main.ts",
    "../tilemap.g.ts",
];

let totalErrores = 0;

for (const rel of archivos) {
    const f = path.join(__dirname, rel);
    const src = fs.readFileSync(f, "utf8");
    const sf = ts.createSourceFile(rel, src, ts.ScriptTarget.ES5, true);

    // Recorre el AST para detectar errores de sintaxis (no de tipos).
    const errores = [];
    function visit(node) {
        if (node.kind === ts.SyntaxKind.Unknown) {
            errores.push("Unknown node at pos " + node.pos);
        }
        ts.forEachChild(node, visit);
    }
    visit(sf);

    // Use ts.getPreEmitDiagnostics-like, but only for syntactic errors.
    const program = ts.createProgram([f], { noEmit: true, allowJs: false, target: ts.ScriptTarget.ES5, skipLibCheck: true });
    const diags = program.getSyntacticDiagnostics(program.getSourceFile(f));

    if (diags.length === 0) {
        console.log(`OK ${rel} (${src.length} chars, ${src.split("\n").length} lineas)`);
    } else {
        console.log(`FAIL ${rel}: ${diags.length} errores de sintaxis`);
        for (const d of diags.slice(0, 10)) {
            const pos = ts.getLineAndCharacterOfPosition(d.file, d.start);
            const msg = ts.flattenDiagnosticMessageText(d.messageText, "\n");
            console.log(`  L${pos.line + 1}:${pos.character + 1}  ${msg}`);
        }
        totalErrores += diags.length;
    }
}

if (totalErrores === 0) {
    console.log("\nSin errores de sintaxis. El codigo se parsea bien.");
    console.log("(Nota: los errores de tipo son falsos positivos porque tsc");
    console.log(" no conoce las APIs de MakeCode Arcade.)");
} else {
    console.log(`\nHay ${totalErrores} errores de sintaxis.`);
    process.exit(1);
}
