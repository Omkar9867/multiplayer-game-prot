export const SERVER_PORT = 6970;
export const WORLD_WIDTH = 800;
export const WORLD_HEIGHT = 800;
export const SERVER_FPS = 30;
export const isNumber = (arg) => {
    return typeof arg === "number";
};
export const isHello = (arg) => {
    return arg && arg.kind === "Hello" && isNumber(arg.id);
};
export const isPlayerJoined = (arg) => {
    return (arg &&
        arg.kind === "PlayerJoined" &&
        isNumber(arg.player.id) &&
        isNumber(arg.player.x) &&
        isNumber(arg.player.y));
};
//# sourceMappingURL=common.mjs.map