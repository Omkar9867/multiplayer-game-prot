import { isHello } from "./common.mjs";

(async () => {
  let myId: number | undefined;
  const ws = new WebSocket("ws://localhost:6970");
  ws.addEventListener("close", (e) => console.log("Close Event", e));
  ws.addEventListener("error", (e) => console.log("Error Event", e));
  ws.addEventListener("message", (e) => {
    if (myId === undefined) {
      const message = JSON.parse(e.data);
      if (isHello(message)) {
        myId = message.id;
        console.log(`Connect as player ${myId}`);
      } else {
        console.log("Unknown message", message);
        ws.close();
      }
    }
  });
  ws.addEventListener("open", (e) => console.log("Open Event", e));
})();
