// JUEGO DE PLATAFORMAS - Trabajo de Tecnologia (2 Bach)
// Hecho con Microsoft MakeCode Arcade.
// Sigo los pasos del guion del profesor (1 al 12) + las mejoras obligatorias.

namespace SpriteKind {
    export const Coin = SpriteKind.create()
    export const Mushroom = SpriteKind.create()
    export const Heart = SpriteKind.create()
    export const Key = SpriteKind.create()
    export const Boss = SpriteKind.create()
}

let JUGADOR: Sprite = null
let Nivel_actual = 1
let Contador_nivel = 2
let velocidadJugador = 100
let saltoNormal = -210
let bossHP = 5
let bossActivo = false


// ============================================================
//   PASO 8: FUNCION ENEMIGO con parametros (Fila, Columna, Velocidad)
// ============================================================
function Enemigo_1 (Fila: number, Columna: number, Velocidad_x: number) {
    let enem = sprites.create(img`
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
    `, SpriteKind.Enemy)
    tiles.placeOnTile(enem, tiles.getTileLocation(Columna, Fila))
    enem.setBounceOnWall(true)
    enem.vx = Velocidad_x
    enem.ay = 250
}


// ============================================================
//   PASO 5: CREAR MONEDAS (las pongo en posiciones concretas)
// ============================================================
function crear_moneda (col: number, fila: number) {
    let moneda = sprites.create(img`
        . . 5 5 5 5 . .
        . 5 4 4 4 4 5 .
        5 4 4 5 5 4 4 5
        5 4 5 4 4 5 4 5
        5 4 5 4 4 5 4 5
        5 4 4 5 5 4 4 5
        . 5 4 4 4 4 5 .
        . . 5 5 5 5 . .
    `, SpriteKind.Coin)
    tiles.placeOnTile(moneda, tiles.getTileLocation(col, fila))
}


// ============================================================
//   PASO 6: CREAR SETAS (dan vida)
// ============================================================
function crear_seta (col: number, fila: number) {
    let seta = sprites.create(img`
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
    `, SpriteKind.Mushroom)
    tiles.placeOnTile(seta, tiles.getTileLocation(col, fila))
}


// ============================================================
//   PASO 7: CREAR LLAVE (objetivo del nivel)
// ============================================================
function crear_llave (col: number, fila: number) {
    let llave = sprites.create(img`
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
    `, SpriteKind.Key)
    tiles.placeOnTile(llave, tiles.getTileLocation(col, fila))
}


// ============================================================
//   PASO 2 + 3: CREAR JUGADOR (con animacion, gravedad y movimiento)
// ============================================================
function Crear_Jugador () {
    JUGADOR = sprites.create(img`
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
    `, SpriteKind.Player)
    // Lo coloco en el tile spawn que he marcado en el mapa.
    tiles.placeOnRandomTile(JUGADOR, assets.tile`spawn`)
    // Por si acaso no encontrara el spawn, lo dejo en una posicion segura.
    if (JUGADOR.x < 1 && JUGADOR.y < 1) {
        JUGADOR.setPosition(16, 200)
    }
    // Movimiento horizontal con flechas, vy=0 para que arriba/abajo no muevan.
    controller.moveSprite(JUGADOR, velocidadJugador, 0)
    JUGADOR.vy = 0
    JUGADOR.ay = 350      // gravedad
    scene.cameraFollowSprite(JUGADOR)
}


// ============================================================
//   PASO 11 (mejora): CREAR BOSS (solo nivel 2)
// ============================================================
function Crear_Boss () {
    if (Nivel_actual != 2) {
        return
    }
    let boss = sprites.create(img`
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
    `, SpriteKind.Boss)
    tiles.placeOnTile(boss, tiles.getTileLocation(46, 8))
    bossHP = 5
    bossActivo = true
}


// ============================================================
//   FUNCIONES DE NIVEL (PASO 12)
// ============================================================
function clearGame () {
    sprites.destroyAllSpritesOfKind(SpriteKind.Coin)
    sprites.destroyAllSpritesOfKind(SpriteKind.Mushroom)
    sprites.destroyAllSpritesOfKind(SpriteKind.Heart)
    sprites.destroyAllSpritesOfKind(SpriteKind.Key)
    sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
    sprites.destroyAllSpritesOfKind(SpriteKind.Boss)
    sprites.destroyAllSpritesOfKind(SpriteKind.Projectile)
    bossActivo = false
}

function Iniciar_Nivel () {
    Crear_Jugador()
    // Monedas y setas del nivel 1: las posiciones las saque mirando el mapa.
    crear_moneda(7, 5)
    crear_moneda(31, 5)
    crear_moneda(14, 9)
    crear_moneda(39, 9)
    crear_moneda(3, 12)
    crear_moneda(39, 12)
    crear_seta(6, 12)
    crear_llave(45, 10)
    // Enemigos del nivel 1.
    Enemigo_1(13, 18, 30)
    Enemigo_1(13, 36, 40)
    Enemigo_1(7, 33, 25)
}

function Iniciar_segundo_nivel () {
    Crear_Jugador()
    // Monedas, setas y llave del nivel 2.
    crear_moneda(4, 5)
    crear_moneda(21, 5)
    crear_moneda(39, 6)
    crear_moneda(45, 6)
    crear_moneda(27, 8)
    crear_moneda(12, 9)
    crear_moneda(23, 12)
    crear_moneda(46, 13)
    crear_seta(18, 9)
    crear_seta(4, 12)
    crear_llave(49, 8)
    // Enemigos del nivel 2: mas y mas rapidos.
    Enemigo_1(7, 10, 50)
    Enemigo_1(7, 22, -45)
    Enemigo_1(10, 12, 55)
    Enemigo_1(13, 9, 60)
    Enemigo_1(13, 25, -55)
    Crear_Boss()
}

function Cambio_Nivel () {
    clearGame()
    if (Nivel_actual == 1) {
        tiles.setTilemap(tilemap`level1`)
        Iniciar_Nivel()
    } else {
        tiles.setTilemap(tilemap`level2`)
        Iniciar_segundo_nivel()
    }
    info.startCountdown(120)
}

function Tiene_otro_nivel () {
    if (Nivel_actual < Contador_nivel) {
        game.splash("Nivel " + Nivel_actual + " superado!", "Vamos al siguiente...")
        Nivel_actual = Nivel_actual + 1
        Cambio_Nivel()
    } else {
        game.over(true)
    }
}


// ============================================================
//   EVENTOS DEL JUEGO
// ============================================================

// Paso 5: recoger moneda = +1 punto
sprites.onOverlap(SpriteKind.Player, SpriteKind.Coin, function (sprite, otherSprite) {
    otherSprite.destroy(effects.coolRadial, 200)
    info.changeScoreBy(1)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
})

// Paso 6: recoger seta = +1 vida
sprites.onOverlap(SpriteKind.Player, SpriteKind.Mushroom, function (sprite, otherSprite) {
    otherSprite.destroy(effects.hearts, 200)
    info.changeLifeBy(1)
    music.play(music.melodyPlayable(music.powerUp), music.PlaybackMode.InBackground)
})

// Paso 7: coger llave = pasar de nivel
sprites.onOverlap(SpriteKind.Player, SpriteKind.Key, function (sprite, otherSprite) {
    otherSprite.destroy(effects.confetti, 400)
    music.play(music.melodyPlayable(music.zapped), music.PlaybackMode.InBackground)
    Tiene_otro_nivel()
})

// Paso 9: jugador-enemigo
//   Si saltas encima: +100 puntos y muere el enemigo.
//   Si te toca de lado: -1 vida y se destruye.
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    if (sprite.vy > 0 && sprite.bottom <= otherSprite.top + 6) {
        otherSprite.destroy(effects.fire, 200)
        info.changeScoreBy(100)
        sprite.vy = saltoNormal
    } else {
        otherSprite.destroy(effects.warmRadial, 200)
        info.changeLifeBy(-1)
    }
})

// Boss: aguanta varios golpes (variable bossHP global)
sprites.onOverlap(SpriteKind.Player, SpriteKind.Boss, function (sprite, otherSprite) {
    if (sprite.vy > 0 && sprite.bottom <= otherSprite.top + 6) {
        bossHP = bossHP - 1
        otherSprite.sayText("HP " + bossHP, 800, false)
        if (bossHP <= 0) {
            otherSprite.destroy(effects.fire, 500)
            info.changeScoreBy(500)
            bossActivo = false
        }
        sprite.vy = saltoNormal
    } else {
        info.changeLifeBy(-1)
    }
})

// Paso 10 (lava): tocar lava = -1 vida y vuelves al spawn
scene.onOverlapTile(SpriteKind.Player, assets.tile`lava`, function (sprite, location) {
    info.changeLifeBy(-1)
    tiles.placeOnRandomTile(JUGADOR, assets.tile`spawn`)
})

// Pinchos: -1 vida y rebota hacia arriba
scene.onOverlapTile(SpriteKind.Player, assets.tile`spike`, function (sprite, location) {
    info.changeLifeBy(-1)
    sprite.vy = -180
})

// Proyectil del jugador toca enemigo
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprite.destroy()
    otherSprite.destroy(effects.fire, 300)
    info.changeScoreBy(50)
})

// Proyectil toca boss: le baja la vida
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Boss, function (sprite, otherSprite) {
    sprite.destroy()
    bossHP = bossHP - 1
    if (bossHP <= 0) {
        otherSprite.destroy(effects.fire, 500)
        info.changeScoreBy(500)
        bossActivo = false
    } else {
        otherSprite.sayText("HP " + bossHP, 800, false)
    }
})


// ============================================================
//   CONTROLES (PASO 2)
// ============================================================

// Boton A = saltar (solo si esta tocando el suelo)
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!JUGADOR) {
        return
    }
    if (JUGADOR.isHittingTile(CollisionDirection.Bottom)) {
        JUGADOR.vy = saltoNormal
        music.play(music.melodyPlayable(music.jumpUp), music.PlaybackMode.InBackground)
    }
})

// Boton B = disparar proyectil hacia donde mira el jugador (mejora opcional)
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!JUGADOR) {
        return
    }
    let bala = sprites.createProjectileFromSprite(img`
        . 4 4 .
        4 5 5 4
        4 5 5 4
        . 4 4 .
    `, JUGADOR, 200, 0)
    if (JUGADOR.vx < 0) {
        bala.vx = -200
    }
})


// ============================================================
//   PASO 10: FINAL POR TIEMPO
// ============================================================
info.onCountdownEnd(function () {
    game.over(false)
})


// ============================================================
//   AL INICIAR (arranque del juego)
// ============================================================

info.setScore(0)
info.setLife(3)
Contador_nivel = 2
Nivel_actual = 1

// Cargo el primer nivel ANTES del splash, asi cuando cierras el splash con A
// ya esta el juego cargado debajo y no hay pantalla en negro.
Cambio_Nivel()

// Mejora obligatoria: instrucciones al comienzo de la partida.
game.splash("JUEGO DE PLATAFORMAS", "Flechas mover, A saltar, B disparar")

