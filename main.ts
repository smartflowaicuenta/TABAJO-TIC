// ============================================================
// JUEGO DE PLATAFORMAS - Trabajo de Tecnologia (2 Bach)
// Hecho con Microsoft MakeCode Arcade -> https://arcade.makecode.com
//
// Sigo los pasos del guion del profesor:
//   Paso 1  -> Diseno del fondo y tilemap
//   Paso 2  -> Crear el jugador y movimiento
//   Paso 3  -> Animar al jugador
//   Paso 4  -> Ampliar el recorrido (50x16)
//   Paso 5  -> Monedas con animacion
//   Paso 6  -> Setas que dan vida (con animacion del corazon)
//   Paso 7  -> Llave -> ganar nivel
//   Paso 8  -> Funcion Enemigo con parametros (Fila,Columna,Velocidad)
//   Paso 9  -> Interaccion jugador-enemigo (saltar = +100, tocar = -1 vida)
//   Paso 10 -> Final por tiempo (2 min) o por vidas (lava + enemigos)
//   Paso 11 -> Mejoras OBLIGATORIAS: instrucciones al inicio + cajas sorpresa
//   Paso 12 -> Niveles con la funcion Cambio_Nivel
//
// Y luego he metido las mejoras opcionales que pone al final del pdf
// (proyectiles, status bar, NPC con preguntas, teletransportes, etc.)
// ============================================================


// ------------------------------------------------------------
//  Tipos de sprite que voy a necesitar
// ------------------------------------------------------------
namespace SpriteKind {
    export const Coin = SpriteKind.create()
    export const Mushroom = SpriteKind.create()
    export const Heart = SpriteKind.create()
    export const Key = SpriteKind.create()
    export const Enemy = SpriteKind.create()
    export const Boss = SpriteKind.create()
    export const SurpriseBox = SpriteKind.create()
    export const Projectile = SpriteKind.create()
    export const PowerTime = SpriteKind.create()    // recompensa de tiempo extra
    export const PowerSpeed = SpriteKind.create()   // recompensa de velocidad extra
    export const PowerJump = SpriteKind.create()    // recompensa para saltar mas alto
    export const NPC = SpriteKind.create()          // personaje al que preguntas
}


// ------------------------------------------------------------
//  Variables globales del juego
// ------------------------------------------------------------
let JUGADOR: Sprite = null                  // el sprite del jugador (lo llamo en mayuscula porque es el principal)
let Nivel_actual: number = 1                // nivel en el que estamos ahora
let Contador_nivel: number = 2              // numero total de niveles del juego
let velocidadJugador: number = 100          // velocidad de movimiento horizontal
let saltoNormal: number = -210              // velocidad vertical al saltar
let saltoExtra: number = -300               // velocidad cuando recoges el power-up de super-salto
let usaSuperSalto: boolean = false          // si esta activo el super-salto
let llaveCogida: boolean = false            // controlo si ya cogio la llave del nivel
let respondioBien: boolean = false          // para el NPC
let bossActivo: boolean = false             // para el "boss" del nivel 2


// ------------------------------------------------------------
//  IMAGENES - Frames de animacion y sprites
//  (los he dibujado yo en el editor, los pego aqui como constantes)
// ------------------------------------------------------------

// Jugador parado mirando a la derecha
const IMG_JUGADOR_QUIETO = img`
    . . . . f f f f f f . . . . . .
    . . . f e e e e e e f . . . . .
    . . f e e e e e e e e f . . . .
    . f e e f f e e f f e e f . . .
    . f e e f f e e f f e e f . . .
    . f e e e e e e e e e e f . . .
    . f e e f e e e e e f e f . . .
    . . f e e f f f f f e e f . . .
    . . . f e e e e e e e f . . . .
    . . . f e e e e e e e f . . . .
    . . . f 6 6 6 6 6 6 f f . . . .
    . . . f 6 6 f 6 6 f 6 f . . . .
    . . . f 6 6 f 6 6 f 6 f . . . .
    . . . f 6 6 f 6 6 f 6 f . . . .
    . . . . f f f . . f f f . . . .
    . . . . . . . . . . . . . . . .
`

// Jugador andando: 2 frames (pierna derecha / pierna izquierda)
const IMG_JUGADOR_ANDA_1 = img`
    . . . . f f f f f f . . . . . .
    . . . f e e e e e e f . . . . .
    . . f e e e e e e e e f . . . .
    . f e e f f e e f f e e f . . .
    . f e e f f e e f f e e f . . .
    . f e e e e e e e e e e f . . .
    . f e e f e e e e e f e f . . .
    . . f e e f f f f f e e f . . .
    . . . f e e e e e e e f . . . .
    . . . f e e e e e e e f . . . .
    . . . f 6 6 6 6 6 6 6 f . . . .
    . . . f 6 6 f 6 6 f 6 f . . . .
    . . . f 6 6 f 6 6 f f . . . . .
    . . . f f 6 f 6 6 f . . . . . .
    . . . . . f f . f f . . . . . .
    . . . . . . . . . . . . . . . .
`

const IMG_JUGADOR_ANDA_2 = img`
    . . . . f f f f f f . . . . . .
    . . . f e e e e e e f . . . . .
    . . f e e e e e e e e f . . . .
    . f e e f f e e f f e e f . . .
    . f e e f f e e f f e e f . . .
    . f e e e e e e e e e e f . . .
    . f e e f e e e e e f e f . . .
    . . f e e f f f f f e e f . . .
    . . . f e e e e e e e f . . . .
    . . . f e e e e e e e f . . . .
    . . . f 6 6 6 6 6 6 6 f . . . .
    . . . f 6 6 f 6 6 f 6 f . . . .
    . . . . f 6 f 6 6 f 6 6 f . . .
    . . . . . . f 6 6 f 6 f f . . .
    . . . . . . f f . . f . . . . .
    . . . . . . . . . . . . . . . .
`

// Frames de la moneda - hago varios mas estrechos para que parezca que gira.
// Empiezo con la moneda redonda y voy reduciendo el ancho como dice el guion.
const COIN_FRAMES: Image[] = [
    img`
        . . 5 5 5 5 . .
        . 5 4 4 4 4 5 .
        5 4 4 5 5 4 4 5
        5 4 5 4 4 5 4 5
        5 4 5 4 4 5 4 5
        5 4 4 5 5 4 4 5
        . 5 4 4 4 4 5 .
        . . 5 5 5 5 . .
    `,
    img`
        . . 5 5 5 5 . .
        . . 4 5 5 4 . .
        . 5 4 4 4 4 5 .
        . 5 4 5 5 4 5 .
        . 5 4 5 5 4 5 .
        . 5 4 4 4 4 5 .
        . . 4 5 5 4 . .
        . . 5 5 5 5 . .
    `,
    img`
        . . . 5 5 . . .
        . . 4 5 5 4 . .
        . . 4 4 4 4 . .
        . . 4 5 5 4 . .
        . . 4 5 5 4 . .
        . . 4 4 4 4 . .
        . . 4 5 5 4 . .
        . . . 5 5 . . .
    `,
    img`
        . . . 5 5 . . .
        . . . 4 4 . . .
        . . . 4 4 . . .
        . . . 4 4 . . .
        . . . 4 4 . . .
        . . . 4 4 . . .
        . . . 4 4 . . .
        . . . 5 5 . . .
    `,
    img`
        . . . . 5 . . .
        . . . . 4 . . .
        . . . . 4 . . .
        . . . . 4 . . .
        . . . . 4 . . .
        . . . . 4 . . .
        . . . . 4 . . .
        . . . . 5 . . .
    `,
    img`
        . . . 5 . . . .
        . . . 4 . . . .
        . . . 4 . . . .
        . . . 4 . . . .
        . . . 4 . . . .
        . . . 4 . . . .
        . . . 4 . . . .
        . . . 5 . . . .
    `,
]

// Seta - cuando la coges, se transforma en un corazon que da vida.
const IMG_SETA = img`
    . . . 7 7 7 7 7 . . . . . . . .
    . . 7 6 7 7 7 6 7 . . . . . . .
    . 7 7 7 7 7 7 7 7 7 . . . . . .
    7 7 1 7 7 6 7 7 1 7 7 . . . . .
    7 7 7 7 7 7 7 7 7 7 7 . . . . .
    . . . 1 1 1 1 1 1 . . . . . . .
    . . . 1 e 1 1 e 1 . . . . . . .
    . . . 1 1 1 1 1 1 . . . . . . .
    . . . . 1 1 1 1 . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
`

const HEART_FRAMES: Image[] = [
    img`
        . . 2 2 . . 2 2 . .
        . 2 2 2 2 2 2 2 2 .
        2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2
        . 2 2 2 2 2 2 2 2 .
        . . 2 2 2 2 2 2 . .
        . . . 2 2 2 2 . . .
        . . . . 2 2 . . . .
        . . . . . . . . . .
    `,
    img`
        . . . . . . . . . .
        . . 2 2 . . 2 2 . .
        . 2 2 2 2 2 2 2 2 .
        2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2
        . 2 2 2 2 2 2 2 2 .
        . . 2 2 2 2 2 2 . .
        . . . 2 2 2 2 . . .
        . . . . 2 2 . . . .
        . . . . . . . . . .
    `,
    img`
        . . . . . . . . . .
        . . . . . . . . . .
        . . 2 2 . . 2 2 . .
        . 2 2 2 2 2 2 2 2 .
        2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2
        . 2 2 2 2 2 2 2 2 .
        . . 2 2 2 2 2 2 . .
        . . . 2 2 2 2 . . .
        . . . . 2 2 . . . .
    `,
]

// Llave (con animacion de brillo)
const KEY_FRAMES: Image[] = [
    img`
        . . . 5 5 5 . . . .
        . . 5 4 4 4 5 . . .
        . . 5 4 e 4 5 . . .
        . . 5 4 4 4 5 . . .
        . . . 5 4 5 . . . .
        . . . . 4 . . . . .
        . . . . 4 4 4 . . .
        . . . . 4 . . . . .
        . . . . 4 4 . . . .
        . . . . 4 . . . . .
    `,
    img`
        . . . 5 5 5 . . . .
        . . 5 1 4 4 5 . . .
        . . 5 4 e 4 5 . . .
        . . 5 4 4 1 5 . . .
        . . . 5 4 5 . . . .
        . . . . 1 . . . . .
        . . . . 4 4 4 . . .
        . . . . 1 . . . . .
        . . . . 4 4 . . . .
        . . . . 1 . . . . .
    `,
]

// Enemigo tipo 1 (basico, anda)
const ENEMY1_FRAMES: Image[] = [
    img`
        . . 2 2 2 2 2 2 . .
        . 2 2 2 2 2 2 2 2 .
        2 2 1 1 2 2 1 1 2 2
        2 2 1 f 2 2 1 f 2 2
        2 2 2 2 2 2 2 2 2 2
        2 f 2 2 2 2 2 2 f 2
        2 2 f f f f f f 2 2
        . 2 2 2 2 2 2 2 2 .
        . 2 . 2 . . 2 . 2 .
        . 2 . 2 . . 2 . 2 .
    `,
    img`
        . . 2 2 2 2 2 2 . .
        . 2 2 2 2 2 2 2 2 .
        2 2 1 1 2 2 1 1 2 2
        2 2 1 f 2 2 1 f 2 2
        2 2 2 2 2 2 2 2 2 2
        2 f 2 2 2 2 2 2 f 2
        2 2 f f f f f f 2 2
        . 2 2 2 2 2 2 2 2 .
        . . 2 . 2 . 2 . . .
        . . 2 . 2 . 2 . . .
    `,
]

// Enemigo tipo 2 (mas oscuro, va mas rapido)
const ENEMY2_FRAMES: Image[] = [
    img`
        . . a a a a a a . .
        . a a a a a a a a .
        a a 2 2 a a 2 2 a a
        a a 2 f a a 2 f a a
        a a a a a a a a a a
        a f a a a a a a f a
        a a f f f f f f a a
        . a a a a a a a a .
        . a . a . . a . a .
        . a . a . . a . a .
    `,
    img`
        . . a a a a a a . .
        . a a a a a a a a .
        a a 2 2 a a 2 2 a a
        a a 2 f a a 2 f a a
        a a a a a a a a a a
        a f a a a a a a f a
        a a f f f f f f a a
        . a a a a a a a a .
        . . a . a . a . . .
        . . a . a . a . . .
    `,
]

// Boss (mas grande, mas vida)
const BOSS_FRAMES: Image[] = [
    img`
        . . 2 2 2 2 2 2 2 2 2 2 . .
        . 2 2 f 2 2 2 2 2 2 f 2 2 .
        2 2 f 1 f 2 2 2 2 f 1 f 2 2
        2 f 1 e 1 f 2 2 f 1 e 1 f 2
        2 2 f 1 f 2 2 2 2 f 1 f 2 2
        2 2 2 f 2 2 2 2 2 2 f 2 2 2
        2 2 2 2 2 2 f f 2 2 2 2 2 2
        2 2 2 2 f f f f f f 2 2 2 2
        . 2 2 f 2 2 2 2 2 2 f 2 2 .
        . 2 f 2 2 2 2 2 2 2 2 f 2 .
        . . 2 2 2 2 2 2 2 2 2 2 . .
        . . 2 . . 2 . . 2 . . 2 . .
    `,
    img`
        . . 2 2 2 2 2 2 2 2 2 2 . .
        . 2 2 f 2 2 2 2 2 2 f 2 2 .
        2 2 f 1 f 2 2 2 2 f 1 f 2 2
        2 f 1 e 1 f 2 2 f 1 e 1 f 2
        2 2 f 1 f 2 2 2 2 f 1 f 2 2
        2 2 2 f 2 2 2 2 2 2 f 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 f f f f f f 2 2 2 2
        . 2 2 f 2 2 2 2 2 2 f 2 2 .
        . 2 f 2 2 2 2 2 2 2 2 f 2 .
        . . 2 2 2 2 2 2 2 2 2 2 . .
        . . . 2 . . 2 . . 2 . . . .
    `,
]

// Proyectil del jugador
const IMG_PROYECTIL = img`
    . 4 4 .
    4 5 5 4
    4 5 5 4
    . 4 4 .
`

// NPC (personaje que te hace una pregunta)
const IMG_NPC = img`
    . . f f f f f . . . .
    . f e e e e e f . . .
    f e 1 e e e 1 e f . .
    f e e f e f e e f . .
    f e e e e e e e f . .
    . f e f f f f e f . .
    . . f e e e e f . . .
    . . . f f f f . . . .
    . . . b b b b . . . .
    . . b b 4 4 b b . . .
    . . b 4 4 4 4 b . . .
    . . b 4 4 4 4 b . . .
    . . . f . . f . . . .
    . . . f . . f . . . .
`

// Power-ups (tiempo extra, velocidad, super-salto)
const IMG_PT_TIEMPO = img`
    . . 5 5 5 5 . .
    . 5 1 1 1 1 5 .
    5 1 1 f 1 1 1 5
    5 1 1 f f f 1 5
    5 1 1 f 1 1 1 5
    5 1 1 f 1 1 1 5
    . 5 1 1 1 1 5 .
    . . 5 5 5 5 . .
`

const IMG_PT_VELOCIDAD = img`
    . . 8 8 8 8 . .
    . 8 1 1 1 1 8 .
    8 1 5 5 1 1 1 8
    8 1 5 1 1 1 1 8
    8 1 1 5 5 5 1 8
    8 1 1 1 1 5 1 8
    . 8 5 5 5 5 8 .
    . . 8 8 8 8 . .
`

const IMG_PT_SALTO = img`
    . . 6 6 6 6 . .
    . 6 1 1 1 1 6 .
    6 1 1 1 1 1 1 6
    6 1 1 5 5 1 1 6
    6 1 5 5 5 5 1 6
    6 1 1 5 5 1 1 6
    . 6 1 1 1 1 6 .
    . . 6 6 6 6 . .
`


// ============================================================
//  FUNCIONES DE CREACION DE OBJETOS DEL NIVEL
//  (Paso 12 del guion: simplificar el "al iniciar" pasandolo a funciones)
// ============================================================

// Paso 2: crea el jugador, le da movimiento, gravedad, salto y camara.
function Crear_Jugador() {
    JUGADOR = sprites.create(IMG_JUGADOR_QUIETO, SpriteKind.Player)

    // Lo coloco en la celda donde he marcado el spawn (tile "spawn") en el tilemap.
    tiles.placeOnRandomTile(JUGADOR, myTiles.spawn)

    // Movimiento: solo izquierda/derecha. La velocidad vy la dejo a 0 para que
    // las flechas arriba/abajo no muevan al jugador (controlamos el salto con A).
    controller.moveSprite(JUGADOR, velocidadJugador, 0)
    JUGADOR.vy = 0

    // Gravedad (acceleration y) - asi cae cuando salta.
    JUGADOR.ay = 350

    // La camara sigue al jugador para que no se salga de la pantalla.
    scene.cameraFollowSprite(JUGADOR)

    // Animacion de andar (Paso 3) - usa la extension "animation".
    animation.runImageAnimation(
        JUGADOR,
        [IMG_JUGADOR_ANDA_1, IMG_JUGADOR_ANDA_2],
        200,
        true
    )
}

// Paso 5: monedas. Pongo una sobre cada cuadrado amarillo del mapa.
function Crear_Monedas() {
    // Recorro todas las celdas marcadas como coin_marker.
    for (let posicion of tiles.getTilesByType(myTiles.coin_marker)) {
        let moneda = sprites.create(COIN_FRAMES[0], SpriteKind.Coin)
        tiles.placeOnTile(moneda, posicion)
        // Quito el cuadrado amarillo (lo "oculto" sustituyendolo por transparente).
        tiles.setTileAt(posicion, myTiles.transparency16)
        // Animacion de la moneda girando.
        animation.runImageAnimation(moneda, COIN_FRAMES, 100, true)
    }
}

// Paso 6: setas. Cuando las recoge, las cambio por un corazon que da vida.
function Crear_Setas() {
    for (let posicion of tiles.getTilesByType(myTiles.mushroom_marker)) {
        let seta = sprites.create(IMG_SETA, SpriteKind.Mushroom)
        tiles.placeOnTile(seta, posicion)
        tiles.setTileAt(posicion, myTiles.transparency16)
    }
}

// Paso 7: llave (objetivo del nivel).
function Crear_Llave() {
    for (let posicion of tiles.getTilesByType(myTiles.key_marker)) {
        let llave = sprites.create(KEY_FRAMES[0], SpriteKind.Key)
        tiles.placeOnTile(llave, posicion)
        tiles.setTileAt(posicion, myTiles.transparency16)
        animation.runImageAnimation(llave, KEY_FRAMES, 250, true)
    }
}

// Mejora obligatoria: cajas sorpresa.
// La caja sorpresa esta dibujada en el mapa como tile "surprise_box" (con muro).
// Cuando el jugador la golpea desde abajo, suelta una recompensa aleatoria
// y se "rompe" (la sustituyo por un tile de tierra que tambien es muro).
function Crear_CajasSorpresa() {
    // No tengo que crear sprites: las cajas ya estan en el tilemap.
    // La logica de "golpe desde abajo" se gestiona en un evento mas abajo.
}

// Crear power-ups (recompensas extra: tiempo, velocidad, super-salto).
// Las pongo en posiciones fijas segun el nivel actual.
function Crear_PowerUps() {
    if (Nivel_actual == 1) {
        let pt1 = sprites.create(IMG_PT_TIEMPO, SpriteKind.PowerTime)
        tiles.placeOnTile(pt1, tiles.getTileLocation(28, 9))

        let pv1 = sprites.create(IMG_PT_VELOCIDAD, SpriteKind.PowerSpeed)
        tiles.placeOnTile(pv1, tiles.getTileLocation(40, 7))
    } else {
        let ps2 = sprites.create(IMG_PT_SALTO, SpriteKind.PowerJump)
        tiles.placeOnTile(ps2, tiles.getTileLocation(15, 6))

        let pt2 = sprites.create(IMG_PT_TIEMPO, SpriteKind.PowerTime)
        tiles.placeOnTile(pt2, tiles.getTileLocation(35, 8))
    }
}

// Crear NPC (mejora opcional: pj que pregunta al jugador y si acierta da vidas).
function Crear_NPC() {
    if (Nivel_actual != 1) return     // solo en el nivel 1 lo pongo
    let npc = sprites.create(IMG_NPC, SpriteKind.NPC)
    tiles.placeOnTile(npc, tiles.getTileLocation(20, 12))
}

// Crear el boss (mejora: solo aparece en el nivel 2).
function Crear_Boss() {
    if (Nivel_actual != 2) return
    let boss = sprites.create(BOSS_FRAMES[0], SpriteKind.Boss)
    tiles.placeOnTile(boss, tiles.getTileLocation(46, 8))
    boss.setFlag(SpriteFlag.GhostThroughWalls, true)
    animation.runImageAnimation(boss, BOSS_FRAMES, 350, true)
    // Vida del boss: aguanta 5 golpes. Se guarda en el propio sprite con
    // sprites.setDataNumber para no tener que arrastrar variables globales.
    sprites.setDataNumber(boss, "hp", 5)
    boss.sayText("HP 5", 1500, false)
    bossActivo = true
}


// ============================================================
//  Paso 8: FUNCION ENEMIGO con parametros.
//  Para no repetir bloques cada vez que pongo un enemigo, hago una
//  funcion que recibe la fila, columna y velocidad. Asi solo tengo que
//  llamarla con esos numeros y aparece un enemigo nuevo.
// ============================================================
function Enemigo_1(Fila: number, Columna: number, Velocidad_x: number) {
    let enem = sprites.create(ENEMY1_FRAMES[0], SpriteKind.Enemy)
    tiles.placeOnTile(enem, tiles.getTileLocation(Columna, Fila))
    // El enemigo rebota cuando choca con una pared.
    enem.setFlag(SpriteFlag.AutoDestroy, false)
    enem.setBounceOnWall(true)
    enem.vx = Velocidad_x
    enem.ay = 250         // gravedad para que caiga si pisa un hueco
    animation.runImageAnimation(enem, ENEMY1_FRAMES, 200, true)
    // Vida: aguanta 1 golpe (se guarda dentro del propio sprite).
    sprites.setDataNumber(enem, "hp", 1)
}

// Enemigo tipo 2: el mismo patron pero con otra imagen y mas velocidad.
function Enemigo_2(Fila: number, Columna: number, Velocidad_x: number) {
    let enem = sprites.create(ENEMY2_FRAMES[0], SpriteKind.Enemy)
    tiles.placeOnTile(enem, tiles.getTileLocation(Columna, Fila))
    enem.setBounceOnWall(true)
    enem.vx = Velocidad_x
    enem.ay = 250
    animation.runImageAnimation(enem, ENEMY2_FRAMES, 150, true)
    // Este enemigo aguanta 2 golpes.
    sprites.setDataNumber(enem, "hp", 2)
}


// ============================================================
//  Paso 12: GESTION DE NIVELES
// ============================================================

// Borra todos los objetos antes de cargar un nivel nuevo.
function clearGame() {
    sprites.destroyAllSpritesOfKind(SpriteKind.Coin)
    sprites.destroyAllSpritesOfKind(SpriteKind.Mushroom)
    sprites.destroyAllSpritesOfKind(SpriteKind.Heart)
    sprites.destroyAllSpritesOfKind(SpriteKind.Key)
    sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
    sprites.destroyAllSpritesOfKind(SpriteKind.Boss)
    sprites.destroyAllSpritesOfKind(SpriteKind.Projectile)
    sprites.destroyAllSpritesOfKind(SpriteKind.PowerTime)
    sprites.destroyAllSpritesOfKind(SpriteKind.PowerSpeed)
    sprites.destroyAllSpritesOfKind(SpriteKind.PowerJump)
    sprites.destroyAllSpritesOfKind(SpriteKind.NPC)
    if (JUGADOR) JUGADOR.destroy()
    bossActivo = false
    llaveCogida = false
    respondioBien = false
    usaSuperSalto = false
}

// Inicializa el nivel: crea jugador, monedas, setas, llave y power-ups del nivel 1.
function Iniciar_Nivel() {
    Crear_Jugador()
    Crear_Monedas()
    Crear_Setas()
    Crear_Llave()
    Crear_CajasSorpresa()
    Crear_PowerUps()
    Crear_NPC()

    // Llamadas a enemigos del nivel 1 (Paso 8: para cada enemigo, indico fila,
    // columna y velocidad). Las posiciones las he sacado mirando el mapa.
    Enemigo_1(13, 18, 30)
    Enemigo_1(13, 36, 40)
    Enemigo_1(7, 33, 25)
    Enemigo_2(7, 8, 35)
}

// Llamadas exclusivas del segundo nivel (mas dificil).
function Iniciar_segundo_nivel() {
    Crear_Jugador()
    Crear_Monedas()
    Crear_Setas()
    Crear_Llave()
    Crear_CajasSorpresa()
    Crear_PowerUps()
    Crear_Boss()
    // Enemigos del nivel 2: mas y mas rapidos.
    Enemigo_1(7, 10, 50)
    Enemigo_1(7, 22, -45)
    Enemigo_1(10, 12, 55)
    Enemigo_2(13, 9, 60)
    Enemigo_2(13, 25, -55)
    Enemigo_2(7, 33, 65)
}

// Cambia el tilemap segun el "Nivel_actual" y crea los objetos del nivel.
function Cambio_Nivel() {
    clearGame()
    if (Nivel_actual == 1) {
        tiles.setTilemap(tilemap`level1`)
        Iniciar_Nivel()
    } else if (Nivel_actual == 2) {
        tiles.setTilemap(tilemap`level2`)
        Iniciar_segundo_nivel()
    }
    // Reinicio el contador de tiempo en cada nivel.
    info.startCountdown(120)
}

// Comprueba si hay otro nivel mas. Si si, sube de nivel; si no, fin del juego.
function Tiene_otro_nivel() {
    if (Nivel_actual < Contador_nivel) {
        game.splash("Nivel " + Nivel_actual + " superado!", "Vamos al siguiente...")
        Nivel_actual = Nivel_actual + 1
        Cambio_Nivel()
    } else {
        game.over(true)        // ganaste todo el juego
    }
}


// ============================================================
//  EVENTOS DEL JUEGO (overlaps, botones, contadores)
// ============================================================

// --- Paso 5: cuando el jugador toca una moneda, gana 1 punto.
sprites.onOverlap(SpriteKind.Player, SpriteKind.Coin, function (sprite, otherSprite) {
    otherSprite.destroy(effects.coolRadial, 200)
    info.changeScoreBy(1)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
})

// --- Paso 6: cuando toca una seta, se transforma en corazon que da 1 vida.
sprites.onOverlap(SpriteKind.Player, SpriteKind.Mushroom, function (sprite, otherSprite) {
    // Guardo la posicion de la seta antes de destruirla, asi puedo poner
    // el corazon en el mismo sitio.
    let posX = otherSprite.x
    let posY = otherSprite.y
    otherSprite.destroy()
    let corazon = sprites.create(HEART_FRAMES[0], SpriteKind.Heart)
    corazon.setPosition(posX, posY)
    animation.runImageAnimation(corazon, HEART_FRAMES, 200, true)
    music.play(music.melodyPlayable(music.powerUp), music.PlaybackMode.InBackground)
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Heart, function (sprite, otherSprite) {
    otherSprite.destroy(effects.hearts, 300)
    info.changeLifeBy(1)
})

// --- Paso 7: la llave acaba el nivel. Si hay otro nivel, paso al siguiente.
sprites.onOverlap(SpriteKind.Player, SpriteKind.Key, function (sprite, otherSprite) {
    otherSprite.destroy(effects.confetti, 400)
    llaveCogida = true
    music.play(music.melodyPlayable(music.zapped), music.PlaybackMode.InBackground)
    Tiene_otro_nivel()
})

// --- Paso 9: interaccion jugador-enemigo.
//   Si saltas encima (cae sobre el enemigo): gana 100 puntos y muere el enemigo.
//   Si te toca de lado: pierdes 1 vida y el enemigo se destruye.
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    if (sprite.vy > 0 && sprite.bottom <= otherSprite.top + 6) {
        // El jugador venia cayendo encima del enemigo.
        otherSprite.destroy(effects.fire, 200)
        info.changeScoreBy(100)
        sprite.vy = saltoNormal       // rebote pequenio
    } else {
        otherSprite.destroy(effects.warmRadial, 200)
        info.changeLifeBy(-1)
        // Empuja al jugador para atras un poco.
        sprite.vx = sprite.vx > 0 ? -velocidadJugador : velocidadJugador
        sprite.vy = -120
    }
})

// --- El boss aguanta varios golpes (con status bar). Solo muere si lo "saltas"
//   tres veces o le das con tres proyectiles.
sprites.onOverlap(SpriteKind.Player, SpriteKind.Boss, function (sprite, otherSprite) {
    if (sprite.vy > 0 && sprite.bottom <= otherSprite.top + 6) {
        // El jugador cae sobre el boss: le baja un punto de vida.
        let hp = sprites.readDataNumber(otherSprite, "hp") - 1
        sprites.setDataNumber(otherSprite, "hp", hp)
        otherSprite.sayText("HP " + hp, 800, false)
        if (hp <= 0) {
            otherSprite.destroy(effects.fire, 500)
            info.changeScoreBy(500)
            bossActivo = false
        }
        sprite.vy = saltoNormal
    } else {
        info.changeLifeBy(-1)
        sprite.vx = sprite.vx > 0 ? -velocidadJugador : velocidadJugador
        sprite.vy = -150
    }
})

// --- Paso 10 (vidas): tocar lava = -1 vida.
scene.onOverlapTile(SpriteKind.Player, myTiles.lava, function (sprite, location) {
    info.changeLifeBy(-1)
    // Vuelve al spawn (para que no caiga de nuevo).
    tiles.placeOnRandomTile(JUGADOR, myTiles.spawn)
})

scene.onOverlapTile(SpriteKind.Player, myTiles.spike, function (sprite, location) {
    info.changeLifeBy(-1)
    sprite.vy = -180
})


// ============================================================
//  CAJAS SORPRESA (mejora obligatoria del Paso 11)
//  Si el jugador golpea la caja desde abajo (con la cabeza), suelta una moneda
//  y la caja se transforma en un bloque de tierra (que el jugador puede pisar).
// ============================================================
game.onUpdateInterval(50, function () {
    if (!JUGADOR) return
    if (JUGADOR.vy >= 0) return       // solo cuando va subiendo

    let col = Math.floor((JUGADOR.x) / 16)
    let row = Math.floor((JUGADOR.top) / 16)
    if (row < 0) return

    let loc = tiles.getTileLocation(col, row)
    if (tiles.tileAtLocationEquals(loc, myTiles.surprise_box)) {
        // La caja "se rompe" -> la sustituyo por dirt (que sigue siendo muro).
        tiles.setTileAt(loc, myTiles.dirt)
        tiles.setWallAt(loc, true)
        // Suelta una moneda justo encima.
        let recompensa = sprites.create(COIN_FRAMES[0], SpriteKind.Coin)
        tiles.placeOnTile(recompensa, tiles.getTileLocation(col, row - 1))
        animation.runImageAnimation(recompensa, COIN_FRAMES, 100, true)
        // Empuja al jugador hacia abajo (porque ha chocado con la caja desde abajo).
        JUGADOR.vy = 50
        music.play(music.melodyPlayable(music.knock), music.PlaybackMode.InBackground)
    }
})


// ============================================================
//  POWER-UPS (objetos opcionales del Paso 11)
// ============================================================

// Recoger PowerTime -> +10 segundos al contador.
sprites.onOverlap(SpriteKind.Player, SpriteKind.PowerTime, function (sprite, otherSprite) {
    otherSprite.destroy(effects.coolRadial, 200)
    info.changeCountdownBy(10)
    game.splash("+10 segundos!")
})

// Recoger PowerSpeed -> jugador mas rapido durante 5 segundos.
sprites.onOverlap(SpriteKind.Player, SpriteKind.PowerSpeed, function (sprite, otherSprite) {
    otherSprite.destroy(effects.coolRadial, 200)
    velocidadJugador = 180
    controller.moveSprite(JUGADOR, velocidadJugador, 0)
    music.play(music.melodyPlayable(music.powerUp), music.PlaybackMode.InBackground)
    // Vuelve a la velocidad normal a los 5 segundos.
    control.runInParallel(function () {
        pause(5000)
        velocidadJugador = 100
        if (JUGADOR) controller.moveSprite(JUGADOR, velocidadJugador, 0)
    })
})

// Recoger PowerJump -> super-salto durante 7 segundos.
sprites.onOverlap(SpriteKind.Player, SpriteKind.PowerJump, function (sprite, otherSprite) {
    otherSprite.destroy(effects.coolRadial, 200)
    usaSuperSalto = true
    music.play(music.melodyPlayable(music.powerUp), music.PlaybackMode.InBackground)
    control.runInParallel(function () {
        pause(7000)
        usaSuperSalto = false
    })
})


// ============================================================
//  TELETRANSPORTES (mejora opcional)
//  Cuando el jugador pisa un teletransporte tipo A, sale por el B.
// ============================================================
scene.onOverlapTile(SpriteKind.Player, myTiles.teleport_a, function (sprite, location) {
    let destinos = tiles.getTilesByType(myTiles.teleport_b)
    if (destinos.length > 0) {
        tiles.placeOnTile(JUGADOR, destinos[0])
        music.play(music.melodyPlayable(music.zapped), music.PlaybackMode.InBackground)
    }
})

scene.onOverlapTile(SpriteKind.Player, myTiles.teleport_b, function (sprite, location) {
    let destinos = tiles.getTilesByType(myTiles.teleport_a)
    if (destinos.length > 0) {
        tiles.placeOnTile(JUGADOR, destinos[0])
        music.play(music.melodyPlayable(music.zapped), music.PlaybackMode.InBackground)
    }
})


// ============================================================
//  NPC con pregunta (mejora opcional: "interactuar con otros personajes")
// ============================================================
sprites.onOverlap(SpriteKind.Player, SpriteKind.NPC, function (sprite, otherSprite) {
    if (respondioBien) return
    // Pongo una pregunta tipica de bachillerato (resolver una ecuacion sencilla).
    game.showLongText("Hola! Si aciertas mi acertijo te doy una vida.\n\n  3*5 + 4 = ?\n  A: 10   B: 19   C: 21\n\n(Para responder, pulsa A si crees 19, B si crees 21, abajo si crees 10)", DialogLayout.Bottom)
    // Espera la respuesta del jugador con un menu sencillo.
    let respuesta = game.askForString("Escribe la respuesta (numero):", 3)
    if (parseInt(respuesta) == 19) {
        info.changeLifeBy(1)
        respondioBien = true
        game.splash("Correcto!", "Toma una vida extra")
    } else {
        info.changeLifeBy(-1)
        game.splash("Mal!", "Pierdes una vida")
    }
})


// ============================================================
//  CONTROLES DEL JUGADOR
// ============================================================

// Paso 2: salto con el boton A. Solo salta si esta tocando el suelo, asi
// evito que pueda saltar varias veces seguidas en el aire.
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!JUGADOR) return
    if (JUGADOR.isHittingTile(CollisionDirection.Bottom)) {
        JUGADOR.vy = usaSuperSalto ? saltoExtra : saltoNormal
        music.play(music.melodyPlayable(music.jumpUp), music.PlaybackMode.InBackground)
    }
})

// Mejora opcional: el boton B dispara un proyectil que destruye enemigos.
// La direccion del proyectil depende de hacia donde esta mirando el jugador.
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!JUGADOR) return
    let bala = sprites.createProjectileFromSprite(IMG_PROYECTIL, JUGADOR, 200, 0)
    bala.setKind(SpriteKind.Projectile)
    // Si el jugador se esta moviendo a la izquierda, lanzo el proyectil tambien hacia
    // la izquierda. Si esta quieto, asumo que mira a la derecha.
    if (JUGADOR.vx < 0) {
        bala.vx = -200
    }
    music.play(music.melodyPlayable(music.pewPew), music.PlaybackMode.InBackground)
})

// Cuando un proyectil toca a un enemigo: reduce su vida; si llega a 0, lo destruye.
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprite.destroy()
    let hp = sprites.readDataNumber(otherSprite, "hp") - 1
    sprites.setDataNumber(otherSprite, "hp", hp)
    if (hp <= 0) {
        otherSprite.destroy(effects.fire, 300)
        info.changeScoreBy(50)
    } else {
        otherSprite.sayText("HP " + hp, 600, false)
    }
})

sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Boss, function (sprite, otherSprite) {
    sprite.destroy()
    let hp = sprites.readDataNumber(otherSprite, "hp") - 1
    sprites.setDataNumber(otherSprite, "hp", hp)
    if (hp <= 0) {
        otherSprite.destroy(effects.fire, 500)
        info.changeScoreBy(500)
        bossActivo = false
    } else {
        otherSprite.sayText("HP " + hp, 800, false)
    }
})


// ============================================================
//  Paso 10: FINAL DE JUEGO POR TIEMPO
// ============================================================
info.onCountdownEnd(function () {
    game.over(false)
})


// ============================================================
//  AL INICIAR (arranque del juego)
// ============================================================

// Mejora obligatoria: instrucciones al comienzo de la partida.
game.splash(
    "JUEGO DE PLATAFORMAS",
    "Recoge monedas y la llave para superar el nivel"
)
game.splash(
    "Controles:",
    "Flechas = mover, A = saltar, B = disparar"
)
game.splash(
    "Cuidado!",
    "La lava y los enemigos te quitan vidas"
)

// Configuracion inicial de partida (puntuacion, vidas, total de niveles).
info.setScore(0)
info.setLife(3)
Contador_nivel = 2
Nivel_actual = 1

// Mejora opcional: melodia de fondo bajita (uso una de las melodias que ya
// trae MakeCode para no tener que componer una desde cero).
music.setVolume(96)
control.runInParallel(function () {
    while (true) {
        music.play(music.melodyPlayable(music.magicWand), music.PlaybackMode.UntilDone)
        pause(800)
    }
})

// Arrancamos el primer nivel.
Cambio_Nivel()





