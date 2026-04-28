// Script auxiliar para generar el archivo images.g.jres con los datos
// binarios (base64) de cada tile, a partir de las definiciones img`...`
// que estan en images.g.ts.
//
// Formato binario MakeCode F4 (4 bits por pixel):
//   byte 0: 0x87 (magic)
//   byte 1: 0x04 (formato F4)
//   bytes 2-3: width (uint16 LE)
//   bytes 4-5: height (uint16 LE)
//   bytes 6-7: padding 0x00 0x00
//   bytes 8+:  pixel data, column-major, 2 pixeles por byte
//              (nibble bajo = pixel superior, nibble alto = siguiente)

const fs = require("fs");
const path = require("path");

function pixelValue(ch) {
    if (ch === "." || ch === "0" || ch === " " || !ch) return 0;
    const n = parseInt(ch, 16);
    return isNaN(n) ? 0 : n;
}

function imgToBase64(imgStr) {
    const rows = imgStr
        .split("\n")
        .map(r => r.replace(/\s+/g, ""))
        .filter(r => r.length > 0);
    if (rows.length === 0) {
        throw new Error("Imagen vacia");
    }
    const H = rows.length;
    const W = rows[0].length;

    // Validacion: todas las filas tienen que medir lo mismo.
    for (let r = 0; r < H; r++) {
        if (rows[r].length !== W) {
            throw new Error(`Fila ${r} mide ${rows[r].length} y deberia ${W}`);
        }
    }

    const headerSize = 8;
    const pixelBytes = Math.ceil((W * H) / 2);
    const bin = Buffer.alloc(headerSize + pixelBytes);

    bin[0] = 0x87;
    bin[1] = 0x04;
    bin.writeUInt16LE(W, 2);
    bin.writeUInt16LE(H, 4);
    bin[6] = 0x00;
    bin[7] = 0x00;

    let idx = headerSize;
    for (let c = 0; c < W; c++) {
        for (let r = 0; r < H; r += 2) {
            const v1 = pixelValue(rows[r][c]);
            const v2 = r + 1 < H ? pixelValue(rows[r + 1][c]) : 0;
            bin[idx++] = (v2 << 4) | v1;
        }
    }

    return bin.toString("base64");
}

function extractImagesFromTs(src) {
    // Captura: export const NAME = img`...contenido...`
    const out = {};
    const re = /export const (\w+)\s*=\s*img`([\s\S]*?)`/g;
    let m;
    while ((m = re.exec(src))) {
        out[m[1]] = m[2];
    }
    return out;
}

const imagesTs = fs.readFileSync(path.join(__dirname, "../images.g.ts"), "utf8");
const tiles = extractImagesFromTs(imagesTs);

const jres = {
    "*": {
        mimeType: "image/x-mkcd-f4",
        dataEncoding: "base64",
        namespace: "myTiles"
    }
};

for (const [nombre, contenido] of Object.entries(tiles)) {
    jres[nombre] = {
        data: imgToBase64(contenido),
        mimeType: "image/x-mkcd-f4",
        tilemapTile: true
    };
}

fs.writeFileSync(
    path.join(__dirname, "../images.g.jres"),
    JSON.stringify(jres, null, 4)
);

// Generar images.g.ts auto-derivado del JRES.
// Cada tile se expone como `image.ofBuffer(hex...)` para que el editor lo
// reconozca y aparezca en la galeria de tiles.
let tsOut = "// Auto-generado a partir de images.g.jres.\n";
tsOut += "// NO editar a mano: cualquier cambio aqui se sobrescribe.\n";
tsOut += "namespace myTiles {\n";
for (const [nombre, contenido] of Object.entries(tiles)) {
    const b64 = imgToBase64(contenido);
    const hex = Buffer.from(b64, "base64").toString("hex");
    tsOut += `    //% fixedInstance jres blockIdentity=images._tile\n`;
    tsOut += `    export const ${nombre} = image.ofBuffer(hex\`${hex}\`);\n`;
}
tsOut += "}\n";
fs.writeFileSync(path.join(__dirname, "../images.g.ts"), tsOut);

console.log(`OK - images.g.jres y images.g.ts generados con ${Object.keys(tiles).length} tiles:`);
for (const n of Object.keys(tiles)) console.log("  - " + n);
