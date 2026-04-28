// Reemplaza myTiles.X por assets.tile`X` en main.ts.
// Uso esto porque desde la linea de comandos los backticks dan problemas.
const fs = require("fs");
const path = require("path");

const tiles = [
    "transparency16", "grass_top", "dirt", "spike",
    "coin_marker", "mushroom_marker", "key_marker", "surprise_box",
    "lava", "teleport_a", "teleport_b", "spawn",
    "quiz_marker", "boss_marker"
];

const archivo = path.join(__dirname, "../main.ts");
let s = fs.readFileSync(archivo, "utf8");
let count = 0;

for (const t of tiles) {
    const re = new RegExp("myTiles\\." + t + "\\b", "g");
    const matches = s.match(re);
    if (matches) {
        count += matches.length;
        s = s.replace(re, "assets.tile`" + t + "`");
    }
}

fs.writeFileSync(archivo, s);
console.log(`OK - reemplazadas ${count} referencias myTiles.X por assets.tile X`);
