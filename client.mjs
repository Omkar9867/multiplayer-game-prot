(async () => {
    const ws = new WebSocket("ws://localhost:6970");
    ws.addEventListener("close", (e) => console.log('Close Event', e));
    ws.addEventListener("error", (e) => console.log('Error Event', e));
    ws.addEventListener("message", (e) => console.log('Message Event', e));
    ws.addEventListener("open", (e) => console.log('Open Event', e));
})();
export {};
//# sourceMappingURL=client.mjs.map