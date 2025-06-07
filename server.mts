import { WebSocketServer, WebSocket } from "ws";
import {
  DEFAULT_MOVING,
  Event,
  isAmmaMoving,
  isPlayerMoving,
  Player,
  PlayerJoined,
  PlayerLeft,
  SERVER_FPS,
  SERVER_PORT,
  updatePlayer,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "./common.mjs";

interface PlayerWithWs extends Player {
  ws: WebSocket;
}

let eventQueue: Array<Event> = []; //This will have multiple events like PLayerStartMoving etc.
const players = new Map<number, PlayerWithWs>();
let idCounter = 0;
const wss = new WebSocketServer({
  port: SERVER_PORT,
});

wss.on("connection", (ws) => {
  const id = idCounter++;
  const x = Math.random() * WORLD_WIDTH;
  const y = Math.random() * WORLD_HEIGHT;
  const player: PlayerWithWs = {
    ws,
    id,
    x,
    y,
    moving: {  //! to explore the logic why we remove DEFAULT_MOVING
      up: false,
      down: false,
      left: false,
      right: false,
    },
  };
  players.set(id, player);
  console.log(`Player ${id} connected`);
  eventQueue.push({
    kind: "PlayerJoined",
    player: {
      id,
      x: x,
      y: y,
    },
  });
  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data.toString());
    if (isAmmaMoving(message)) {
      console.log(`Received moving message player ${id}`, message);
      eventQueue.push({
        kind: "PlayerMoving",
        id,
        x: player.x,
        y: player.y,
        start: message.start,
        direction: message.direction,
      });
    } else {
      console.log(`Recieved bogus-amogus message from client ${id}`, message);
      ws.close();
    }
  });
  ws.on("close", () => {
    console.log(`Player ${id} disconnected`);
    players.delete(id);
    eventQueue.push({
      kind: "PlayerLeft",
      player: {
        id,
      },
    });
  });
});

function tick() {
  for (let event of eventQueue) {
    switch (event.kind) {
      case "PlayerJoined":
        {
          const joinedPlayer = players.get(event.player.id);
          if (!joinedPlayer) continue;
          joinedPlayer.ws.send(
            JSON.stringify({
              kind: "Hello",
              id: joinedPlayer.id,
            })
          );
          const eventString = JSON.stringify(event);
          players.forEach((otherPlayer) => {
            joinedPlayer.ws.send(
              JSON.stringify({
                kind: "PlayerJoined",
                player: {
                  id: otherPlayer.id,
                  x: otherPlayer.x,
                  y: otherPlayer.y,
                },
              })
            );
            if (otherPlayer.id !== joinedPlayer.id) {
              otherPlayer.ws.send(eventString);
            }
          });
        }
        break;
      case "PlayerLeft":
        {
          const eventString = JSON.stringify(event);
          players.forEach((otherPlayer) => {
            if (otherPlayer.id !== event.player.id) {
              otherPlayer.ws.send(eventString);
            }
          });
        }
        break;
      case "PlayerMoving": {
        const player = players.get(event.id);
        if (!player) continue;
        player.moving[event.direction] = event.start;
        const eventString = JSON.stringify(event);
        players.forEach((player) => {
          player.ws.send(eventString);
        });
      }
    }
  }
  eventQueue.length = 0; // Clear the event queue after processing

  // Here to so the algo simulation of the players
  players.forEach((player) => updatePlayer(player, 1 / SERVER_FPS));
  setTimeout(tick, 1000 / SERVER_FPS);
}
setTimeout(tick, 1000 / SERVER_FPS);
console.log(`Listening to ws://localhost${SERVER_PORT}`);
