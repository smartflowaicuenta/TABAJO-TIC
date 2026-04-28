// ============================================================
//   Generador de tilemap.g.jres y tilemap.g.ts
//   Formato verificado contra proyectos reales de MakeCode Arcade
//   (referencias: marshall-demars/ICS20-tile-map y pxtbase.h).
//
//   Formato de los TILES (image/x-mkcd-f4):
//     header 8 bytes: 87 04 W_lo W_hi H_lo H_hi 00 00
//     pixels: column-major, 4bpp packed (low nibble = pixel arriba)
//
//   Formato del TILEMAP en el JRES (application/mkcd-tilemap):
//     "data" = base64 del STRING ASCII hex (DOBLE codificacion)
//     bytes hex: <escala> + <W LE16> + <H LE16> + <indices de tile>
//        escala: 0x10 = TileScale.Sixteen (8 = Eight, 32 = ThirtyTwo)
//
//   Formato del TILEMAP en el TS (createTilemap):
//     hex SIN byte de escala: <W LE16> + <H LE16> + <indices de tile>
//     wall_map como img donde "." = no muro y "1" = muro
//     escala como cuarto argumento (TileScale.Sixteen)
// ============================================================

const fs = require("fs");
const path = require("path");

const ANCHO = 50;
const ALTO = 16;

// ----------------------------------------------------
//   PALETA DE TILES
// ----------------------------------------------------
//   indice 0 = transparency16   (cielo)
//   indice 1 = grass_top        MURO
//   indice 2 = dirt             MURO
//   indice 3 = spike            (no muro, hace dano)
//   indice 4 = coin_marker      (marcador moneda)
//   indice 5 = mushroom_marker  (marcador seta)
//   indice 6 = key_marker       (marcador llave)
//   indice 7 = surprise_box     MURO
//   indice 8 = lava             (no muro, hace dano)
//   indice 9 = teleport_a       (no muro)
//   indice 10 = teleport_b      (no muro)
//   indice 11 = spawn           (no muro)
//   indice 12 = quiz_marker     (no muro)
//   indice 13 = boss_marker     (no muro)

const TILE_INDEX = {
    ".": 0,
    "g": 1,
    "d": 2,
    "p": 3,
    "c": 4,
    "s": 5,
    "k": 6,
    "b": 7,
    "l": 8,
    "t": 9,
    "T": 10,
    "x": 11,
    "q": 12,
    "B": 13,
};

const WALL_TILES = new Set(["g", "d", "b"]);

const TILE_NAMES = [
    "transparency16", "grass_top", "dirt", "spike",
    "coin_marker", "mushroom_marker", "key_marker", "surprise_box",
    "lava", "teleport_a", "teleport_b", "spawn",
    "quiz_marker", "boss_marker"
];

// Helper: construye una fila de 50 chars colocando objetos en posiciones concretas.
function fila(...items) {
    let r = ".".repeat(ANCHO).split("");
    for (const item of items) {
        if (typeof item === "string") {
            const [txt, posStr] = item.split("@");
            const pos = parseInt(posStr, 10);
            for (let i = 0; i < txt.length; i++) {
                if (pos + i < ANCHO) r[pos + i] = txt[i];
            }
        }
    }
    return r.join("");
}

// Diseno del nivel 1.
const NIVEL_1 = [
    fila(),                                                                                                  // 0
    fila(),                                                                                                  // 1
    fila(),                                                                                                  // 2
    fila("ggg@12", "ggg@25"),                                                                                // 3
    fila("ddd@12", "ddd@25"),                                                                                // 4
    fila("c@7", "c@31"),                                                                                     // 5
    fila("ggg@6", "ggg@31"),                                                                                 // 6
    fila("ddd@6", "ddd@31"),                                                                                 // 7
    fila("gg@44"),                                                                                           // 8
    fila("c@14", "b@21", "c@39", "dd@46"),                                                                   // 9
    fila("gggggg@11", "ggg@21", "ggg@36", "k@45"),                                                           // 10
    fila("dddddd@11", "ddd@21", "ddd@36", "g@45"),                                                           // 11
    fila("c@3", "s@6", "c@39", "d@45"),                                                                      // 12
    fila("gggg@2", "ppp@20", "gggg@34", "d@45"),                                                             // 13
    fila("x@0", "dddd@2", "gggg@7", "ggg@12", "gggggggg@16", "gggg@25", "ggg@30", "dddd@34", "d@39", "gggg@41", "d@46"), // 14
    fila("gg@0", "dddd@2", "gggggggggggggggggggggggggggggg@6", "dddd@36", "gggggggggg@40"),                  // 15
];

// Diseno del nivel 2.
const NIVEL_2 = [
    fila(),                                                                                                  // 0
    fila(),                                                                                                  // 1
    fila("gg@17", "gg@28"),                                                                                  // 2
    fila("ggg@10", "dd@17", "dd@28", "ggg@33"),                                                              // 3
    fila("ddd@10", "ggg@44"),                                                                                // 4
    fila("c@4", "c@21", "ddd@44"),                                                                           // 5
    fila("gg@3", "b@11", "b@16", "b@34", "c@39", "c@45"),                                                    // 6
    fila("dd@3", "gggg@8", "gggg@15", "gggg@20", "gggg@32", "ggg@38", "gg@44"),                              // 7
    fila("c@27", "k@49"),                                                                                    // 8
    fila("c@12", "s@18", "gggg@25", "gggg@45"),                                                              // 9
    fila("ggggg@10", "ggg@23", "dddd@45"),                                                                   // 10
    fila("ddddd@10", "b@36"),                                                                                // 11
    fila("s@4", "c@23", "gggg@34"),                                                                          // 12
    fila("gggg@2", "gggg@7", "ggg@17", "gggg@21", "c@46"),                                                   // 13
    fila("x@0", "dddd@2", "dddd@7", "ggggggg@13", "dddd@20", "gggg@25", "gggg@33", "gggg@39", "gggggg@44"),  // 14
    fila("gg@0", "dddd@2", "gg@6", "dddd@8", "gg@12", "ddddddddddddd@14", "ggggggggg@27", "dddd@36", "gg@40", "dd@42", "gg@44", "dddd@46"), // 15
];

function validar(nivel) {
    if (nivel.length !== ALTO) {
        throw new Error(`Altura ${nivel.length} != ${ALTO}`);
    }
    for (let r = 0; r < ALTO; r++) {
        if (nivel[r].length !== ANCHO) {
            throw new Error(`Fila ${r}: ${nivel[r].length} != ${ANCHO}`);
        }
        for (let c = 0; c < ANCHO; c++) {
            if (TILE_INDEX[nivel[r][c]] === undefined) {
                throw new Error(`Tile desconocido "${nivel[r][c]}" en (${c},${r})`);
            }
        }
    }
}

// Devuelve el hex (sin escala) que va en createTilemap del .ts:
//   <W LE16> + <H LE16> + <W*H bytes de indices>
function hexParaTs(nivel) {
    const buffer = Buffer.alloc(4 + ANCHO * ALTO);
    buffer.writeUInt16LE(ANCHO, 0);
    buffer.writeUInt16LE(ALTO, 2);
    for (let r = 0; r < ALTO; r++) {
        for (let c = 0; c < ANCHO; c++) {
            buffer[4 + r * ANCHO + c] = TILE_INDEX[nivel[r][c]];
        }
    }
    return buffer.toString("hex");
}

// Devuelve el data del JRES (base64 del string hex CON byte de escala):
//   <0x10 escala> + <W LE16> + <H LE16> + <W*H bytes indices>
function dataJresParaTilemap(nivel) {
    const buffer = Buffer.alloc(1 + 4 + ANCHO * ALTO);
    buffer[0] = 0x10;                       // TileScale.Sixteen
    buffer.writeUInt16LE(ANCHO, 1);
    buffer.writeUInt16LE(ALTO, 3);
    for (let r = 0; r < ALTO; r++) {
        for (let c = 0; c < ANCHO; c++) {
            buffer[5 + r * ANCHO + c] = TILE_INDEX[nivel[r][c]];
        }
    }
    // doble codificacion: hex como string -> base64
    const hexStr = buffer.toString("hex");
    return Buffer.from(hexStr, "ascii").toString("base64");
}

// Devuelve el wall map como string de img: "." donde no hay muro, "1" donde si.
function wallMapImg(nivel) {
    let out = "\n";
    for (let r = 0; r < ALTO; r++) {
        for (let c = 0; c < ANCHO; c++) {
            const ch = nivel[r][c];
            out += (WALL_TILES.has(ch) ? "1" : ".") + " ";
        }
        out += "\n";
    }
    return out;
}

// ----------------------------------------------------
//   TILES 16x16 - cada uno como array de 16 strings de 16 chars
// ----------------------------------------------------

const TILE_PIXELS = {
    // 0 transparency16 - todo transparente
    transparency16: [
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
    ],
    // 1 grass_top - hierba con borde verde arriba y tierra debajo
    grass_top: [
        "7777777777777777",
        "7676776767667767",
        "6677767766767676",
        "eeeeedeeeedeeede",
        "edeeeeeeeeeddeee",
        "eeeedeede.eeeede",
        "deeeeeeeeeeeeeed",
        "eedeeeedeeeedeed",
        "eeeeeeeeeeeeeeee",
        "eeedeedeeeeeeeed",
        "eeeeeeeeeeedeeed",
        "deeeeeeeeeeeeeed",
        "eeedeeedeeeeeeee",
        "eeeeeeeeeeedeeee",
        "edeeeeeeeeeeedee",
        "eeeeeedeeeeeeeed",
    ],
    // 2 dirt - tierra marron oscura
    dirt: [
        "eeeeeeeeeeeeeeee",
        "edeeedeeeeedeeed",
        "eeeeeeeeeeeeeeee",
        "eeeedeeedeeeedee",
        "eeedeeeeeeeeeeee",
        "eeeeeeedeeeeeede",
        "eedeeeeeeedeeeed",
        "eeeeeeeeeeeeeeee",
        "deeedeeeeeeeeeed",
        "eeeeeeeeedeeeeee",
        "eeeeedeeedeeeeee",
        "eeedeeeeeeeeede.",
        "eeeeeeeeeeeeeeee",
        "eeeedeeeeedeeeee",
        "eedeeeeeeeeeeede",
        "eeeeeeeeeeeeeeee",
    ],
    // 3 spike - pinchos blancos
    spike: [
        "................",
        "................",
        "................",
        "..1...1...1...1.",
        ".111.111.111.111",
        "1111111111111111",
        "ffffffffffffffff",
        "eeeeeeeeeeeeeeee",
        "deeeedeeedeeedee",
        "eeedeeeeeedeeeee",
        "edeeeeeedeeeeeee",
        "eeeedeeeeedeeede",
        "eeeeeeeeeeeeeeee",
        "edeedeeedeeeedee",
        "eeeeeeeeeeeeeeee",
        "eeeeeeeeeeeeeeee",
    ],
    // 4 coin_marker - cuadrado amarillo
    coin_marker: [
        "................",
        "................",
        "....555555......",
        "...55555555.....",
        "..5555555555....",
        "..5555555555....",
        "..5555555555....",
        "..5555555555....",
        "..5555555555....",
        "..5555555555....",
        "...55555555.....",
        "....555555......",
        "................",
        "................",
        "................",
        "................",
    ],
    // 5 mushroom_marker - circulo verde claro
    mushroom_marker: [
        "................",
        "................",
        ".....7777.......",
        "....777777......",
        "...7767677......",
        "...77777777.....",
        "....777777......",
        ".....7777.......",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
    ],
    // 6 key_marker - circulo naranja
    key_marker: [
        "................",
        "................",
        "....444444......",
        "...44444444.....",
        "..4444444444....",
        "..4444444444....",
        "..4444444444....",
        "..4444444444....",
        "...44444444.....",
        "....444444......",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
    ],
    // 7 surprise_box - caja amarilla con interrogacion
    surprise_box: [
        "eeeeeeeeeeeeeeee",
        "e44444444444444e",
        "e4555555555554e.",
        "e45444444445e...",
        "e4554455555f4e..",
        "e455e455efe4e...",
        "e455efeefee5e...",
        "e455effee4e.....",
        "e455efeee4e.....",
        "e4554efe45e.....",
        "e45554e545e.....",
        "e4555555554e....",
        "e4555555555e....",
        "e44444444444....",
        "eeeeeeeeeeeee...",
        "................",
    ],
    // 8 lava - rojo con texturas
    lava: [
        "2224422242244222",
        "2444222444224422",
        "4422244422244244",
        "2224442222244244",
        "2444224442222442",
        "4422444222244422",
        "2244422244442244",
        "4442224442242244",
        "4222444224442222",
        "2244422444222444",
        "4442224442244422",
        "2224442224422444",
        "2444222444224422",
        "4422244422244222",
        "2224442224422244",
        "2244222444222244",
    ],
    // 9 teleport_a - morado con espirales
    teleport_a: [
        "....bbbbbb......",
        "..bbbbbbbbbb....",
        ".bbbcccccbbb....",
        "bbccbbbbbbccbb..",
        "bccbb1111bccb...",
        "bcbb1bbbb1bcb...",
        "bcb1bbccbb1cb...",
        "bcb1bcbbcb1cb...",
        "bcb1bcbbcb1cb...",
        "bcb1bbccbb1cb...",
        "bcbb1bbbb1bcb...",
        "bccbb1111bccb...",
        "bbccbbbbbbccbb..",
        ".bbbcccccbbb....",
        "..bbbbbbbbbb....",
        "....bbbbbb......",
    ],
    // 10 teleport_b - azul con espirales
    teleport_b: [
        "....999999......",
        "..9999999999....",
        ".9998888899....",
        "998899999988....",
        "9889911119889...",
        "989919999198....",
        "9819988998198...",
        "9819898889198...",
        "9819898889198...",
        "9819988998198...",
        "9899199919889...",
        "9889911119889...",
        "988899999988....",
        ".999888889999...",
        "..9999999999....",
        "....999999......",
    ],
    // 11 spawn - casi transparente, solo una marca
    spawn: [
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
        ".......11.......",
        ".......11.......",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
    ],
    // 12 quiz_marker - rosa con interrogacion
    quiz_marker: [
        "................",
        "....cccccc......",
        "...cc1111cc.....",
        "..ccc1cccc1cc...",
        "..cccc1.1ccc....",
        "..cccc.cccccc...",
        "...ccccccccc....",
        "....cccccc......",
        "....cc1cc.......",
        ".....c1c........",
        ".....ccc........",
        "................",
        "................",
        "................",
        "................",
        "................",
    ],
    // 13 boss_marker - rojo oscuro con cara
    boss_marker: [
        "................",
        "....222222......",
        "...22222222.....",
        "..22f2222f22....",
        "..22f2222f22....",
        "..2222222222....",
        "..222f22f222....",
        "..2222ff2222....",
        "...22222222.....",
        "....222222......",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................",
    ],
};

function pixelValue(ch) {
    if (ch === "." || ch === "0" || ch === " " || !ch) return 0;
    const n = parseInt(ch, 16);
    return isNaN(n) ? 0 : n;
}

// Convierte filas 16x16 a base64 binario (header 87 04 + WW + HH + 00 00 + pixels column-major)
function tileToBase64(rows) {
    const W = 16;
    const H = 16;
    const headerSize = 8;
    const pixelBytes = (W * H) >> 1;
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
            const v1 = pixelValue(rows[r] && rows[r][c]);
            const v2 = pixelValue(rows[r + 1] && rows[r + 1][c]);
            bin[idx++] = (v2 << 4) | v1;
        }
    }
    return bin.toString("base64");
}

// Convierte filas a img`...` con espacios entre chars
function tileToImg(rows) {
    let out = "\n";
    for (const row of rows) {
        for (const ch of row) {
            out += (ch === "." ? "." : ch) + " ";
        }
        out += "\n";
    }
    return out;
}

// ----------------------------------------------------
//   GENERAR
// ----------------------------------------------------

validar(NIVEL_1);
validar(NIVEL_2);

const hex_ts_1 = hexParaTs(NIVEL_1);
const hex_ts_2 = hexParaTs(NIVEL_2);

const data_jres_1 = dataJresParaTilemap(NIVEL_1);
const data_jres_2 = dataJresParaTilemap(NIVEL_2);

const wallmap_1 = wallMapImg(NIVEL_1);
const wallmap_2 = wallMapImg(NIVEL_2);

// ---------- tilemap.g.jres ----------
const jres = {};
for (const nombre of TILE_NAMES) {
    jres[nombre] = {
        data: tileToBase64(TILE_PIXELS[nombre]),
        mimeType: "image/x-mkcd-f4",
        tilemapTile: true
    };
}
jres["level1"] = {
    id: "level1",
    mimeType: "application/mkcd-tilemap",
    data: data_jres_1,
    tileset: TILE_NAMES.map(n => "myTiles." + n),
    displayName: "level1"
};
jres["level2"] = {
    id: "level2",
    mimeType: "application/mkcd-tilemap",
    data: data_jres_2,
    tileset: TILE_NAMES.map(n => "myTiles." + n),
    displayName: "level2"
};
jres["*"] = {
    mimeType: "image/x-mkcd-f4",
    dataEncoding: "base64",
    namespace: "myTiles"
};

const outDir = path.join(__dirname, "..");
fs.writeFileSync(path.join(outDir, "tilemap.g.jres"), JSON.stringify(jres, null, 4));

// ---------- tilemap.g.ts ----------
let ts = "// Auto-generated code. Do not edit.\n";
ts += "namespace myTiles {\n";
for (const nombre of TILE_NAMES) {
    ts += `    //% fixedInstance jres blockIdentity=images._tile\n`;
    ts += `    export const ${nombre} = image.ofBuffer(hex\`\`);\n`;
}
ts += "\n";
ts += "    helpers._registerFactory(\"tilemap\", function(name: string) {\n";
ts += "        switch(helpers.stringTrim(name)) {\n";
ts += `            case "level1":\n`;
ts += `            case "level1":return tiles.createTilemap(\n`;
ts += `                hex\`${hex_ts_1}\`,\n`;
ts += `                img\`${wallmap_1}\`,\n`;
ts += `                [${TILE_NAMES.map(n => "myTiles." + n).join(", ")}],\n`;
ts += `                TileScale.Sixteen);\n`;
ts += `            case "level2":\n`;
ts += `            case "level2":return tiles.createTilemap(\n`;
ts += `                hex\`${hex_ts_2}\`,\n`;
ts += `                img\`${wallmap_2}\`,\n`;
ts += `                [${TILE_NAMES.map(n => "myTiles." + n).join(", ")}],\n`;
ts += `                TileScale.Sixteen);\n`;
ts += `        }\n`;
ts += `        return null;\n`;
ts += `    })\n`;
ts += "}\n";

fs.writeFileSync(path.join(outDir, "tilemap.g.ts"), ts);

console.log("OK - tilemap.g.jres y tilemap.g.ts generados");
console.log(`  ${TILE_NAMES.length} tiles + 2 niveles`);
