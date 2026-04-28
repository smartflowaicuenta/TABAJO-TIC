# Juego de plataformas con niveles

Trabajo de Tecnologia hecho con **Microsoft MakeCode Arcade**.

> for PXT/arcade

## Idea del juego

Es un juego de plataformas en 2D al estilo Mario. El jugador empieza en la
parte izquierda del mapa y tiene que llegar al final recogiendo monedas,
esquivando enemigos y la lava, y pillando la llave para pasar al siguiente
nivel. Hay 2 niveles, y en el segundo aparece un boss (un enemigo grande
que aguanta varios golpes).

## Como jugar

| Tecla       | Que hace                                       |
|-------------|------------------------------------------------|
| Flechas     | Mover al jugador a izquierda y derecha         |
| A           | Saltar (solo si estas pisando el suelo)        |
| B           | Disparar un proyectil hacia donde miras        |

Tienes 2 minutos por nivel y 3 vidas. Si se te acaba el tiempo o las vidas
se acaba la partida.

## Lo que he hecho (siguiendo el guion del profe)

He cumplido los 12 pasos del documento del profesor:

1. Diseño del fondo (cielo azul) y del primer tilemap.
2. Crear el jugador, asignarle gravedad y movimiento con las flechas.
3. Animar al jugador andando (2 frames).
4. Ampliar el recorrido a 50x16.
5. Monedas con animacion de giro (6 frames + duplicados).
6. Setas que se transforman en corazones para dar vida.
7. Llave al final del recorrido para superar el nivel.
8. Funcion `Enemigo_1(Fila, Columna, Velocidad_x)` para no repetir bloques.
9. Interaccion jugador-enemigo (saltar = +100, tocar = -1 vida).
10. Final por tiempo (countdown de 2 minutos) y por perder todas las vidas.
11. Mejoras OBLIGATORIAS:
    - Pantalla de instrucciones al inicio (`game.splash`).
    - Cajas sorpresa que sueltan recompensas al golpearlas desde abajo.
12. Niveles con la funcion `Cambio_Nivel`, `Tiene_otro_nivel`, `clearGame`,
    `Iniciar_Nivel` y `Iniciar_segundo_nivel`.

### Mejoras opcionales que tambien he metido

- Melodia de fondo en bucle.
- Tres tipos de enemigos (Enemigo_1, Enemigo_2 y un Boss en el nivel 2).
- Power-ups que recoges por el mapa:
  - **Reloj amarillo**: +10 segundos al contador.
  - **Bota azul**: velocidad maxima durante 5 segundos.
  - **Estrella verde**: super-salto durante 7 segundos.
- Teletransportes (los tiles morado y azul te llevan de un sitio a otro).
- Proyectiles (boton B) que destruyen enemigos.
- Vida de los enemigos: cuando los golpeas, los mas duros aguantan varios golpes y van mostrando los HP que les quedan en un bocadillo.
- NPC con un acertijo: si lo aciertas te da una vida extra.

## Como abrir el proyecto

Hay dos formas:

1. **Desde MakeCode Arcade:**
   - Entras en https://arcade.makecode.com
   - Pulsas "Importar" -> "Importar URL"
   - Pegas la URL del repositorio de GitHub
2. **Clonando el repo y abriendolo con la extension de VS Code de MakeCode Arcade.**

Cuando se abre, MakeCode lee el `pxt.json`, carga el `main.ts`, los tilemaps
y los tiles, y ya puedes darle al boton de play.

## Estructura del proyecto

```
juego-plataformas-niveles/
├── pxt.json           Configuracion del proyecto MakeCode
├── main.ts            Codigo principal (todo el juego en un archivo)
├── images.g.ts        Tiles del tilemap (hierba, tierra, lava, etc.)
├── images.g.jres      Manifest JSON de los tiles
├── tilemap.g.ts       Datos de los dos niveles
├── tilemap.g.jres     Manifest JSON de los tilemaps
├── main.blocks        Vista de bloques (vacia, todo esta en TypeScript)
├── tsconfig.json
├── assets.json
├── _config.yml
└── _tools/            Scripts auxiliares (no son del juego)
    ├── gen_tilemaps.js     Genera los datos hex de los niveles
    └── check_syntax.js     Comprueba la sintaxis TypeScript
```

## Notas finales

He intentado que el codigo este bien comentado y dividido en funciones para
que sea facil de entender. Muchas de las funciones se llaman como las que
salen en el guion (`Crear_Jugador`, `Crear_Monedas`, `Cambio_Nivel`, etc.)
para que se vea claro que sigo los pasos del profesor.
