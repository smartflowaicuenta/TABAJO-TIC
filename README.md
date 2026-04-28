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

| Tecla   | Que hace                                |
|---------|-----------------------------------------|
| Flechas | Mover al jugador a izquierda y derecha  |
| A       | Saltar (solo si estas pisando el suelo) |
| B       | Disparar un proyectil                   |

Tienes 2 minutos por nivel y 3 vidas. Si se te acaba el tiempo o las vidas
se acaba la partida.

## Lo que he hecho (siguiendo el guion del profe)

He cumplido los 12 pasos del documento del profesor:

1. Diseno del fondo (cielo azul) y del primer tilemap.
2. Crear el jugador, asignarle gravedad y movimiento con las flechas.
3. Animar al jugador andando.
4. Ampliar el recorrido a 50x16.
5. Monedas que dan puntuacion.
6. Setas que dan vida.
7. Llave al final del recorrido para superar el nivel.
8. Funcion `Enemigo_1(Fila, Columna, Velocidad_x)` para no repetir bloques.
9. Interaccion jugador-enemigo (saltar = +100, tocar = -1 vida).
10. Final por tiempo (countdown de 2 minutos) y por perder todas las vidas.
11. Mejoras OBLIGATORIAS:
    - Pantalla de instrucciones al inicio (`game.splash`).
12. Niveles con la funcion `Cambio_Nivel`, `Tiene_otro_nivel`, `clearGame`,
    `Iniciar_Nivel` y `Iniciar_segundo_nivel`.

### Mejoras opcionales que tambien he metido

- Boss en el nivel 2 (aguanta 5 golpes y muestra los HP que le quedan).
- Proyectiles (boton B) que destruyen enemigos.
- Sonidos al saltar, recoger monedas y vencer enemigos.

## Como abrir el proyecto

Hay dos formas:

1. **Desde MakeCode Arcade:**
   - Entras en https://arcade.makecode.com
   - Pulsas "Importar" -> "Importar URL"
   - Pegas la URL del repositorio de GitHub
2. **Clonando el repo y abriendolo con la extension de VS Code de MakeCode Arcade.**

Cuando se abre, MakeCode lee el `pxt.json`, carga el `main.ts`, los tilemaps
y los tiles, y ya puedes darle al boton de play.
