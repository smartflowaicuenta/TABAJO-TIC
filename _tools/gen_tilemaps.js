// Script auxiliar para generar los archivos tilemap.g.jres y tilemap.g.ts
// a partir de un diseño en strings. No forma parte del runtime del juego,
// pero deja constancia de cómo se han creado los niveles.
//
// Uso: node gen_tilemaps.js
//
// Formato binario del tilemap esperado por pxt-arcade tiles.createTilemap:
//   [0-1]  width  (uint16 little-endian)
//   [2-3]  height (uint16 little-endian)
//   [4...] tile indices (1 byte por celda, width*height bytes)
//   [...]  wall flags  (1 bit por celda, agrupado en bytes)

const fs = require("fs");
const path = require("path");

// ----------------------------------------------------
//   PALETA DE TILES
// ----------------------------------------------------
//
//   Caracter -> indice de tile en el array (myTiles)
//   Caracter "W" en el segundo grid -> tile que es muro
//
//   0 = transparency16 (cielo)         indice 0
//   g = grass_top      (hierba arriba) indice 1, MURO
//   d = dirt           (tierra)        indice 2, MURO
//   p = spike          (pinchos)       indice 3, NO muro pero hace daño
//   c = coin_marker    (cuadrado amar) indice 4, NO muro (luego se quita)
//   s = mushroom_marker(cuadrado verde)indice 5, NO muro
//   k = key_marker     (cuadrado naran)indice 6, NO muro
//   b = surprise_box   (caja sorpresa) indice 7, MURO
//   l = lava           (lava)          indice 8, NO muro
//   t = teleport_a     (teletrans A)   indice 9, NO muro
//   T = teleport_b     (teletrans B)   indice 10, NO muro
//   x = spawn          (marcador player)indice 11, NO muro
//   q = quiz_marker    (marcador NPC)  indice 12, NO muro
//   B = boss_marker    (marcador boss) indice 13, NO muro
//
// ----------------------------------------------------

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

const ANCHO = 50;
const ALTO = 16;

// Helper: construye una fila de 50 chars colocando objetos en posiciones concretas.
// Asi me aseguro que TODAS las filas tienen la longitud correcta sin contar a mano.
//   filaConObjetos(["g", 12], ["g", 13], ["g", 14], ...) -> ".............ggg........"
function fila(...items) {
    let r = ".".repeat(ANCHO).split("");
    for (const item of items) {
        if (typeof item === "string") {
            // formato "abc@10" -> coloca "abc" empezando en la columna 10
            const [txt, posStr] = item.split("@");
            const pos = parseInt(posStr, 10);
            for (let i = 0; i < txt.length; i++) {
                if (pos + i < ANCHO) r[pos + i] = txt[i];
            }
        }
    }
    return r.join("");
}

// Diseño del nivel 1: pruebo el primer recorrido. Empieza el jugador en la columna 0
// y la llave esta cerca del final. He intentado que tenga huecos para saltar y
// que se note que sube y baja varias veces.
const NIVEL_1 = [
    fila(),                                                                                              // 0
    fila(),                                                                                              // 1
    fila(),                                                                                              // 2
    fila("ggg@12", "ggg@25"),                                                                            // 3
    fila("ddd@12", "ddd@25"),                                                                            // 4
    fila("c@7", "c@31"),                                                                                  // 5
    fila("ggg@6", "ggg@31"),                                                                              // 6
    fila("ddd@6", "ddd@31"),                                                                              // 7
    fila("gg@44"),                                                                                        // 8
    fila("c@14", "b@21", "c@39", "dd@46"),                                                               // 9
    fila("gggggg@11", "ggg@21", "ggg@36", "k@45"),                                                       // 10
    fila("dddddd@11", "ddd@21", "ddd@36", "g@45"),                                                       // 11
    fila("c@3", "s@6", "c@39", "d@45"),                                                                  // 12
    fila("gggg@2", "ppp@20", "gggg@34", "d@45"),                                                         // 13
    fila("x@0", "dddd@2", "gggg@7", "ggg@12", "gggggggg@16", "gggg@25", "ggg@30", "dddd@34", "d@39", "gggg@41", "d@46"), // 14
    fila("gg@0", "dddd@2", "gggggggggggggggggggggggggggggg@6", "dddd@36", "gggggggggg@40"),              // 15
];

// Diseño del nivel 2: mas dificil, con mas cajas sorpresa, mas pinchos y huecos
// que cubrir con saltos largos.
const NIVEL_2 = [
    fila(),                                                                                              // 0
    fila(),                                                                                              // 1
    fila("gg@17", "gg@28"),                                                                               // 2
    fila("ggg@10", "dd@17", "dd@28", "ggg@33"),                                                          // 3
    fila("ddd@10", "ggg@44"),                                                                             // 4
    fila("c@4", "c@21", "ddd@44"),                                                                        // 5
    fila("gg@3", "b@11", "b@16", "b@34", "c@39", "c@45"),                                                // 6
    fila("dd@3", "gggg@8", "gggg@15", "gggg@20", "gggg@32", "ggg@38", "gg@44"),                          // 7
    fila("c@27", "k@49"),                                                                                 // 8
    fila("c@12", "s@18", "gggg@25", "gggg@45"),                                                           // 9
    fila("ggggg@10", "ggg@23", "dddd@45"),                                                                // 10
    fila("ddddd@10", "b@36"),                                                                              // 11
    fila("s@4", "c@23", "gggg@34"),                                                                        // 12
    fila("gggg@2", "gggg@7", "ggg@17", "gggg@21", "c@46"),                                                // 13
    fila("x@0", "dddd@2", "dddd@7", "ggggggg@13", "dddd@20", "gggg@25", "gggg@33", "gggg@39", "gggggg@44"), // 14
    fila("gg@0", "dddd@2", "gg@6", "dddd@8", "gg@12", "ddddddddddddd@14", "ggggggggg@27", "dddd@36", "gg@40", "dd@42", "gg@44", "dddd@46"), // 15
];

// ----------------------------------------------------

function generaNivel(nivel) {
    const altura = nivel.length;
    const anchura = 50;
    if (altura !== 16) {
        throw new Error(`Altura incorrecta: ${altura}, espero 16`);
    }
    for (let r = 0; r < altura; r++) {
        if (nivel[r].length !== anchura) {
            throw new Error(`Fila ${r} mide ${nivel[r].length} y deberia medir ${anchura}: "${nivel[r]}"`);
        }
    }

    // Buffer: 4 (header) + W*H + ceil(W*H/8)
    const totalCeldas = anchura * altura;
    const wallBytes = Math.ceil(totalCeldas / 8);
    const buffer = Buffer.alloc(4 + totalCeldas + wallBytes);

    buffer.writeUInt16LE(anchura, 0);
    buffer.writeUInt16LE(altura, 2);

    // Indices de tiles
    for (let r = 0; r < altura; r++) {
        for (let c = 0; c < anchura; c++) {
            const ch = nivel[r][c];
            const idx = TILE_INDEX[ch];
            if (idx === undefined) {
                throw new Error(`Caracter desconocido "${ch}" en (${c},${r})`);
            }
            buffer[4 + r * anchura + c] = idx;
        }
    }

    // Wall flags
    for (let r = 0; r < altura; r++) {
        for (let c = 0; c < anchura; c++) {
            const ch = nivel[r][c];
            if (WALL_TILES.has(ch)) {
                const idxCelda = r * anchura + c;
                const byteIdx = 4 + totalCeldas + (idxCelda >> 3);
                const bitIdx = idxCelda & 7;
                buffer[byteIdx] |= 1 << bitIdx;
            }
        }
    }

    return buffer.toString("hex");
}

const hex1 = generaNivel(NIVEL_1);
const hex2 = generaNivel(NIVEL_2);

// Mantengo el JRES vacio: los datos hex de los tilemaps van en el .ts directamente.
const jres = {
    "*": {
        mimeType: "application/mkcd-tilemap",
        dataEncoding: "base64",
        namespace: "myTilemaps"
    }
};

const outDir = path.join(__dirname, "..");
fs.writeFileSync(path.join(outDir, "tilemap.g.jres"), JSON.stringify(jres, null, 4));

// Generar el codigo TypeScript que crea los tilemaps en runtime.
// Uso myTiles.X (defininos en images.g.ts) para que el runtime resuelva las
// imagenes correctamente en codigo y en simulador.
const tilesArray = "[myTiles.transparency16, myTiles.grass_top, myTiles.dirt, myTiles.spike, myTiles.coin_marker, myTiles.mushroom_marker, myTiles.key_marker, myTiles.surprise_box, myTiles.lava, myTiles.teleport_a, myTiles.teleport_b, myTiles.spawn, myTiles.quiz_marker, myTiles.boss_marker]";
const ts = `// Auto-generado a partir del editor de tilemaps de MakeCode Arcade.
// NO editar manualmente, los datos hex contienen las posiciones de cada tile y los muros.
namespace myTilemaps {
    export const level1 = tiles.createTilemap(
        hex\`${hex1}\`,
        img\`. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\`,
        ${tilesArray},
        TileScale.Sixteen
    )
    export const level2 = tiles.createTilemap(
        hex\`${hex2}\`,
        img\`. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\`,
        ${tilesArray},
        TileScale.Sixteen
    )
}
`;

fs.writeFileSync(path.join(outDir, "tilemap.g.ts"), ts);

console.log("OK - tilemap.g.jres y tilemap.g.ts generados");
console.log(`  Nivel 1: ${hex1.length / 2} bytes`);
console.log(`  Nivel 2: ${hex2.length / 2} bytes`);
