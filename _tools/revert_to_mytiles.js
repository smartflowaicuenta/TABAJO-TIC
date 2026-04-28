// Revierte main.ts: reemplaza assets.tile`X` por myTiles.X
// porque el sistema mixto estaba dando problemas en runtime.
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
    const re = new RegExp("assets\\.tile`" + t + "`", "g");
    const matches = s.match(re);
    if (matches) {
        count += matches.length;
        s = s.replace(re, "myTiles." + t);
    }
}

fs.writeFileSync(archivo, s);
console.log(`OK - revertidas ${count} referencias assets.tile X por myTiles.X`);
