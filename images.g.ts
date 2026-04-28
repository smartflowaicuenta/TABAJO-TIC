// Tiles del juego. Cada uno mide 16x16 pixeles. El compilador los reconoce
// como "fixed instance" y por eso aparecen en el editor de tilemaps.
// Los voy a usar como muros, suelos, pinchos, marcadores de monedas...

namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;

    //% fixedInstance jres blockIdentity=images._tile
    export const grass_top = img`
        7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7
        7 6 6 7 6 6 6 7 6 7 6 6 6 7 6 6
        6 6 6 6 6 6 7 6 6 6 6 7 6 6 6 6
        e e e e e d e e e d e e d e e e
        e d d e e e e e e e e d d e e e
        e e e e d e e d e e e e e e d e
        d e e e e e e e e e e e e e e e
        e e d e e e e d e e e e d e e e
        e e e e e e e e e e e e e e e e
        e e e d e e d e e e e e e e e e
        e e e e e e e e e e e d e e e d
        d e e e e e e e e e e e e e e e
        e e e d e e e e d e e e e e e e
        e e e e e e e e e e e e d e e e
        e d e e e e e e e e e e e e d e
        e e e e e e d e e e e e e e e e
    `;

    //% fixedInstance jres blockIdentity=images._tile
    export const dirt = img`
        e e e e e e e e e e e e e e e e
        e d e e e d e e e e e d e e e e
        e e e e e e e e e e e e e e e e
        e e e e e d e e d e e e e d e e
        e e e d e e e e e e e e e e e e
        e e e e e e e d e e e e e e d e
        e e d e e e e e e e d e e e e e
        e e e e e e e e e e e e e e e e
        d e e e e d e e e e e e e e e e
        e e e e e e e e e e d e e e e e
        e e e e e e e e d e e e e e e e
        e e e d e e e e e e e e e e d e
        e e e e e e e e e e e e e e e e
        e e e e e d e e e e d e e e e e
        e e d e e e e e e e e e e e d e
        e e e e e e e e e e e e e e e e
    `;

    //% fixedInstance jres blockIdentity=images._tile
    export const spike = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . 1 . . . 1 . . . 1 . . . 1 .
        . 1 1 1 . 1 1 1 . 1 1 1 . 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        f f f f f f f f f f f f f f f f
        e e e e e e e e e e e e e e e e
        d e e e d e e e d e e e d e e e
        e e e d e e e e e e d e e e e e
        e d e e e e e e d e e e e e e e
        e e e e d e e e e e d e e d e e
        e e e e e e e e e e e e e e e e
        e d e e d e e e d e e e e d e e
        e e e e e e e e e e e e e e e e
        e e e e e e e e e e e e e e e e
    `;

    //% fixedInstance jres blockIdentity=images._tile
    export const coin_marker = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . 5 5 5 5 5 5 . . . . . .
        . . . 5 5 5 5 5 5 5 5 . . . . .
        . . 5 5 5 5 5 5 5 5 5 5 . . . .
        . . 5 5 5 5 5 5 5 5 5 5 . . . .
        . . 5 5 5 5 5 5 5 5 5 5 . . . .
        . . 5 5 5 5 5 5 5 5 5 5 . . . .
        . . 5 5 5 5 5 5 5 5 5 5 . . . .
        . . 5 5 5 5 5 5 5 5 5 5 . . . .
        . . . 5 5 5 5 5 5 5 5 . . . . .
        . . . . 5 5 5 5 5 5 . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;

    //% fixedInstance jres blockIdentity=images._tile
    export const mushroom_marker = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . 7 7 7 7 . . . . . . .
        . . . . 7 7 7 7 7 7 . . . . . .
        . . . 7 7 6 7 7 6 7 7 . . . . .
        . . . 7 7 7 7 7 7 7 7 . . . . .
        . . . . 7 7 7 7 7 7 . . . . . .
        . . . . . 7 7 7 7 . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;

    //% fixedInstance jres blockIdentity=images._tile
    export const key_marker = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . 4 4 4 4 4 4 . . . . . .
        . . . 4 4 4 4 4 4 4 4 . . . . .
        . . 4 4 4 4 4 4 4 4 4 4 . . . .
        . . 4 4 4 4 4 4 4 4 4 4 . . . .
        . . 4 4 4 4 4 4 4 4 4 4 . . . .
        . . 4 4 4 4 4 4 4 4 4 4 . . . .
        . . . 4 4 4 4 4 4 4 4 . . . . .
        . . . . 4 4 4 4 4 4 . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;

    //% fixedInstance jres blockIdentity=images._tile
    export const surprise_box = img`
        e e e e e e e e e e e e e e e e
        e 4 4 4 4 4 4 4 4 4 4 4 4 4 4 e
        e 4 5 5 5 5 5 5 5 5 5 5 5 5 4 e
        e 4 5 4 4 4 4 4 4 4 4 4 4 5 4 e
        e 4 5 4 5 5 5 5 5 5 5 5 4 5 4 e
        e 4 5 4 5 e e e e e e 5 4 5 4 e
        e 4 5 4 5 e f f f e 5 5 4 5 4 e
        e 4 5 4 5 e f e e e 5 4 5 4 e e
        e 4 5 4 5 e e f e e 5 4 5 4 e e
        e 4 5 4 5 e e e e e f 4 5 4 e e
        e 4 5 4 5 e e f e e 5 4 5 4 e e
        e 4 5 4 5 5 5 5 5 5 5 4 5 4 e e
        e 4 5 4 4 4 4 4 4 4 4 4 5 4 e e
        e 4 5 5 5 5 5 5 5 5 5 5 5 4 e e
        e 4 4 4 4 4 4 4 4 4 4 4 4 4 e e
        e e e e e e e e e e e e e e e e
    `;

    //% fixedInstance jres blockIdentity=images._tile
    export const lava = img`
        2 2 2 4 4 2 2 2 2 4 2 2 2 2 4 2
        2 4 4 4 2 2 2 4 4 4 2 2 4 4 2 2
        4 4 2 2 2 4 4 4 2 2 2 4 4 2 2 4
        2 2 2 4 4 4 2 2 2 4 4 4 2 2 4 4
        2 4 4 4 2 2 4 4 4 2 2 2 4 4 4 2
        4 4 2 2 4 4 4 2 2 2 4 4 4 2 2 2
        2 2 4 4 4 2 2 2 4 4 4 2 2 2 4 4
        4 4 4 2 2 2 4 4 4 2 2 4 4 4 2 2
        4 2 2 2 4 4 4 2 2 4 4 4 2 2 2 4
        2 2 4 4 4 2 2 4 4 4 2 2 2 4 4 4
        4 4 4 2 2 2 4 4 4 2 2 4 4 4 2 2
        2 2 2 4 4 4 2 2 2 4 4 4 2 2 4 4
        2 4 4 4 2 2 2 4 4 4 2 2 4 4 2 2
        4 4 2 2 2 4 4 4 2 2 2 4 4 2 2 2
        2 2 2 4 4 4 2 2 2 4 4 4 2 2 2 4
        2 2 4 4 2 2 2 4 4 4 2 2 4 4 4 2
    `;

    //% fixedInstance jres blockIdentity=images._tile
    export const teleport_a = img`
        . . . . b b b b b b . . . . . .
        . . b b b b b b b b b b . . . .
        . b b b c c c c c c b b b . . .
        b b c c b b b b b b c c b b . .
        b c c b b 1 1 1 1 b b c c b . .
        b c b b 1 b b b b 1 b b c b . .
        b c b 1 b b c c b b 1 b c b . .
        b c b 1 b c b b c b 1 b c b . .
        b c b 1 b c b b c b 1 b c b . .
        b c b 1 b b c c b b 1 b c b . .
        b c b b 1 b b b b 1 b b c b . .
        b c c b b 1 1 1 1 b b c c b . .
        b b c c b b b b b b c c b b . .
        . b b b c c c c c c b b b . . .
        . . b b b b b b b b b b . . . .
        . . . . b b b b b b . . . . . .
    `;

    //% fixedInstance jres blockIdentity=images._tile
    export const teleport_b = img`
        . . . . 9 9 9 9 9 9 . . . . . .
        . . 9 9 9 9 9 9 9 9 9 9 . . . .
        . 9 9 9 8 8 8 8 8 8 9 9 9 . . .
        9 9 8 8 9 9 9 9 9 9 8 8 9 9 . .
        9 8 8 9 9 1 1 1 1 9 9 8 8 9 . .
        9 8 9 9 1 9 9 9 9 1 9 9 8 9 . .
        9 8 9 1 9 9 8 8 9 9 1 9 8 9 . .
        9 8 9 1 9 8 9 9 8 9 1 9 8 9 . .
        9 8 9 1 9 8 9 9 8 9 1 9 8 9 . .
        9 8 9 1 9 9 8 8 9 9 1 9 8 9 . .
        9 8 9 9 1 9 9 9 9 1 9 9 8 9 . .
        9 8 8 9 9 1 1 1 1 9 9 8 8 9 . .
        9 9 8 8 9 9 9 9 9 9 8 8 9 9 . .
        . 9 9 9 8 8 8 8 8 8 9 9 9 . . .
        . . 9 9 9 9 9 9 9 9 9 9 . . . .
        . . . . 9 9 9 9 9 9 . . . . . .
    `;

    //% fixedInstance jres blockIdentity=images._tile
    export const spawn = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . 1 1 . . . . . . . .
        . . . . . . 1 1 . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;

    //% fixedInstance jres blockIdentity=images._tile
    export const quiz_marker = img`
        . . . . . . . . . . . . . . . .
        . . . . c c c c c c . . . . . .
        . . . c c 1 1 1 1 c c . . . . .
        . . c c 1 c c c c 1 c c . . . .
        . . c c 1 c . . c 1 c c . . . .
        . . c c c c . c c c c c . . . .
        . . . c c c c c c c c . . . . .
        . . . . c c c c c c . . . . . .
        . . . . c c 1 c c . . . . . . .
        . . . . . c 1 c . . . . . . . .
        . . . . . c c c . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;

    //% fixedInstance jres blockIdentity=images._tile
    export const boss_marker = img`
        . . . . . . . . . . . . . . . .
        . . . . 2 2 2 2 2 2 . . . . . .
        . . . 2 2 2 2 2 2 2 2 . . . . .
        . . 2 2 f 2 2 2 2 f 2 2 . . . .
        . . 2 2 f 2 2 2 2 f 2 2 . . . .
        . . 2 2 2 2 2 2 2 2 2 2 . . . .
        . . 2 2 2 f 2 2 f 2 2 2 . . . .
        . . 2 2 2 2 f f 2 2 2 2 . . . .
        . . . 2 2 2 2 2 2 2 2 . . . . .
        . . . . 2 2 2 2 2 2 . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
}
