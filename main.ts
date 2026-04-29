namespace SpriteKind {
    export const Coin = SpriteKind.create()
    export const Mushroom = SpriteKind.create()
    export const Heart = SpriteKind.create()
    export const Key = SpriteKind.create()
    export const Boss = SpriteKind.create()
}

let JUGADOR: Sprite = null
let Moneda: Sprite = null
let Seta: Sprite = null
let Llave: Sprite = null
let Enemigo: Sprite = null
let Moving = false
let Nivel_actual = 0
let Contador_nivel = 0
let bossHP = 0

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
    controller.moveSprite(JUGADOR, 100, 0)
    JUGADOR.vy = 0
    JUGADOR.ay = 350
    scene.cameraFollowSprite(JUGADOR)
    tiles.placeOnRandomTile(JUGADOR, assets.tile`spawn`)
}

function Crear_Monedas () {
    for (let valor of tiles.getTilesByType(assets.tile`coin_marker`)) {
        Moneda = sprites.create(img`
            . . 5 5 5 5 . .
            . 5 4 4 4 4 5 .
            5 4 4 5 5 4 4 5
            5 4 5 4 4 5 4 5
            5 4 5 4 4 5 4 5
            5 4 4 5 5 4 4 5
            . 5 4 4 4 4 5 .
            . . 5 5 5 5 . .
            `, SpriteKind.Coin)
        tiles.placeOnTile(Moneda, valor)
        tiles.setTileAt(valor, assets.tile`transparency16`)
    }
}

function Crear_Setas () {
    for (let valor of tiles.getTilesByType(assets.tile`mushroom_marker`)) {
        Seta = sprites.create(img`
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
        tiles.placeOnTile(Seta, valor)
        tiles.setTileAt(valor, assets.tile`transparency16`)
    }
}

function Crear_Llave () {
    for (let valor of tiles.getTilesByType(assets.tile`key_marker`)) {
        Llave = sprites.create(img`
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
        tiles.placeOnTile(Llave, valor)
        tiles.setTileAt(valor, assets.tile`transparency16`)
    }
}

function Enemigo_1 (Fila: number, Columna: number, Velocidad_x: number) {
    Enemigo = sprites.create(img`
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
    tiles.placeOnTile(Enemigo, tiles.getTileLocation(Columna, Fila))
    Enemigo.setBounceOnWall(true)
    Enemigo.vx = Velocidad_x
    Enemigo.ay = 250
}

function Crear_Boss () {
    let Boss = sprites.create(img`
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
    tiles.placeOnTile(Boss, tiles.getTileLocation(46, 8))
    bossHP = 5
}

function clearGame () {
    sprites.destroyAllSpritesOfKind(SpriteKind.Coin)
    sprites.destroyAllSpritesOfKind(SpriteKind.Mushroom)
    sprites.destroyAllSpritesOfKind(SpriteKind.Heart)
    sprites.destroyAllSpritesOfKind(SpriteKind.Key)
    sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
    sprites.destroyAllSpritesOfKind(SpriteKind.Boss)
    sprites.destroyAllSpritesOfKind(SpriteKind.Projectile)
}

function Iniciar_Nivel () {
    Crear_Jugador()
    Crear_Monedas()
    Crear_Setas()
    Crear_Llave()
    Enemigo_1(13, 18, 30)
    Enemigo_1(13, 36, 40)
    Enemigo_1(7, 33, 25)
}

function Iniciar_segundo_nivel () {
    Crear_Jugador()
    Crear_Monedas()
    Crear_Setas()
    Crear_Llave()
    Enemigo_1(7, 10, 50)
    Enemigo_1(7, 22, -45)
    Enemigo_1(13, 9, 60)
    Enemigo_1(13, 25, -55)
    Crear_Boss()
}

function Cambio_Nivel () {
    clearGame()
    if (Nivel_actual == 1) {
        tiles.setCurrentTilemap(tilemap`level1`)
        Iniciar_Nivel()
    } else {
        tiles.setCurrentTilemap(tilemap`level2`)
        Iniciar_segundo_nivel()
    }
    info.startCountdown(120)
}

function Tiene_otro_nivel () {
    if (Nivel_actual < Contador_nivel) {
        game.splash("Nivel " + Nivel_actual + " superado!", "Vamos al siguiente...")
        Nivel_actual += 1
        Cambio_Nivel()
    } else {
        game.over(true)
    }
}

sprites.onOverlap(SpriteKind.Player, SpriteKind.Coin, function (sprite, otherSprite) {
    otherSprite.destroy(effects.coolRadial, 200)
    info.changeScoreBy(1)
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Mushroom, function (sprite, otherSprite) {
    otherSprite.destroy(effects.hearts, 200)
    info.changeLifeBy(1)
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Key, function (sprite, otherSprite) {
    otherSprite.destroy(effects.confetti, 400)
    Tiene_otro_nivel()
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    if (sprite.vy > 0) {
        otherSprite.destroy(effects.fire, 200)
        info.changeScoreBy(100)
        sprite.vy = -210
    } else {
        otherSprite.destroy(effects.warmRadial, 200)
        info.changeLifeBy(-1)
    }
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Boss, function (sprite, otherSprite) {
    if (sprite.vy > 0) {
        bossHP += -1
        if (bossHP <= 0) {
            otherSprite.destroy(effects.fire, 500)
            info.changeScoreBy(500)
        }
        sprite.vy = -210
    } else {
        info.changeLifeBy(-1)
    }
})

scene.onOverlapTile(SpriteKind.Player, assets.tile`lava`, function (sprite, location) {
    info.changeLifeBy(-1)
    tiles.placeOnRandomTile(JUGADOR, assets.tile`spawn`)
})

scene.onOverlapTile(SpriteKind.Player, assets.tile`spike`, function (sprite, location) {
    info.changeLifeBy(-1)
    sprite.vy = -180
})

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (JUGADOR.vy == 0) {
        JUGADOR.vy = -210
    }
})

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    let bala = sprites.createProjectileFromSprite(img`
        . 4 4 .
        4 5 5 4
        4 5 5 4
        . 4 4 .
        `, JUGADOR, 200, 0)
})

sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprite.destroy()
    otherSprite.destroy(effects.fire, 300)
    info.changeScoreBy(50)
})

sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Boss, function (sprite, otherSprite) {
    sprite.destroy()
    bossHP += -1
    if (bossHP <= 0) {
        otherSprite.destroy(effects.fire, 500)
        info.changeScoreBy(500)
    }
})

info.onCountdownEnd(function () {
    game.over(false)
})

scene.setBackgroundColor(9)
info.setScore(0)
info.setLife(3)
Contador_nivel = 2
Nivel_actual = 1
Cambio_Nivel()
game.splash("JUEGO DE PLATAFORMAS", "Flechas mover, A saltar, B disparar")
