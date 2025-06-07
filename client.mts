import {
  DEFAULT_MOVING,
  Direction,
  isHello,
  isPlayerJoined,
  isPlayerLeft,
  isPlayerMoving,
  Player,
  PLAYER_SIZE,
  updatePlayer,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "./common.mjs";

const DIRECTION_KEYS: { [key: string]: Direction } = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

(async () => {
  //Canvas
  const gameCanvas = document.getElementById(
    "game"
  ) as HTMLCanvasElement | null;
  if (!gameCanvas) throw new Error("Canvas element with id 'game' not found");
  gameCanvas.width = WORLD_WIDTH;
  gameCanvas.height = WORLD_HEIGHT;
  const ctx = gameCanvas.getContext("2d");
  if (!ctx) throw new Error("2D is not supported");

  let myId: number | undefined;
  const players = new Map<number, Player>();

  // WebSocket
  const ws = new WebSocket("ws://localhost:6970");
  ws.addEventListener("close", (e) => console.log("Close Event", e));
  ws.addEventListener("error", (e) => console.log("Error Event", e));
  ws.addEventListener("message", (e) => {
    const message = JSON.parse(e.data);
    if (myId === undefined) {
      if (isHello(message)) {
        myId = message.id;
        console.log(`Connect as player ${myId}`);
      } else {
        console.log("Unknown message", message);
        ws.close();
      }
    } else {
      const message = JSON.parse(e.data);
      console.log("Received message", message);
      if (isPlayerJoined(message)) {
        // Player_JOINED
        players.set(message.player.id, {
          id: message.player.id,
          x: message.player.x,
          y: message.player.y,
          moving: {
            up: false,
            down: false,
            left: false,
            right: false,
          },
        });
      } else if (isPlayerLeft(message)) {
        // Player_LEFT
        players.delete(message.player.id);
      } else if (isPlayerMoving(message)) {
        // Player_MOVING
        const player = players.get(message.id);
        if (!player) {
          console.log(
            `Player ${message.id} not found for moving message ${JSON.stringify(
              message
            )}`
          );
          ws.close();
          return;
        }
        player.moving[message.direction] = message.start;
        player.x = message.x;
        player.y = message.y;
      } else {
        console.log("Unknown message", message);
        ws.close();
      }
    }
  });
  ws.addEventListener("open", (e) => console.log("Open Event", e));

  let previousTimestamp = 0;
  const frame = (timestamp: number) => {
    const deltaTime = (timestamp - previousTimestamp) / 1000; // Convert to seconds
    previousTimestamp = timestamp;
    // render all of the players here
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "red";
    players.forEach((player) => {
      updatePlayer(player, deltaTime);
      ctx.fillStyle = player.id === myId ? "blue" : "red";
      ctx.fillRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);
    });

    window.requestAnimationFrame(frame);
  };
  window.requestAnimationFrame((timestamp) => {
    previousTimestamp = timestamp;
    window.requestAnimationFrame(frame);
  });

  window.addEventListener("keydown", (e) => {
    if (!e.repeat) {
      const direction = DIRECTION_KEYS[e.code];
      if (direction !== undefined) {
        ws.send(
          JSON.stringify({
            kind: "AmmaMoving",
            start: true,
            direction,
          })
        );
      }
    }
  });

  window.addEventListener("keyup", (e) => {
    if (!e.repeat) {
      const direction = DIRECTION_KEYS[e.code];
      if (direction !== undefined) {
        ws.send(
          JSON.stringify({
            kind: "AmmaMoving",
            start: false,
            direction,
          })
        );
      }
    }
  });
})();
