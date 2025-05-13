import { WebSocketServer, WebSocket } from "ws";
import { SERVER_PORT, WORLD_HEIGHT, WORLD_WIDTH } from "common.mjs";

interface Player {
  id: number;
  x: number;
  y: number;
}

const players = new Map<WebSocket, Player>();
let idCounter = 0;
const wss = new WebSocketServer({
  port: SERVER_PORT,
});

wss.on("connection", (ws) => {
  const id = idCounter++;
  const player = {
    id,
    x: Math.random() * WORLD_WIDTH,
    y: Math.random() * WORLD_HEIGHT,
  };
  players.set(ws, player);
  console.log(`Player ${id} connected`)
  ws.send(
    JSON.stringify({
      kind: "Hello",
      id,
    })
  );

  ws.on('close', () => {
    console.log(`Player ${id} disconnected`);
    players.delete(ws);
  });
});
console.log(`Listening to ws://localhost${SERVER_PORT}`);
