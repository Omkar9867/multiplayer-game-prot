export const SERVER_PORT = 6970;
export const WORLD_WIDTH = 800;
export const WORLD_HEIGHT = 800;
export const SERVER_FPS = 30;
export const PLAYER_SPEED = 200;
export const PLAYER_SIZE = 30;
export const DEFAULT_MOVING = {
    up: false,
    down: false,
    left: false,
    right: false,
};
export const DIRECTION_VECTORS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
};
export const isDirection = (arg) => {
    return DIRECTION_VECTORS[arg] !== undefined;
};
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
export const isPlayerLeft = (arg) => {
    return arg && arg.kind === "PlayerLeft" && isNumber(arg.player.id);
};
export const isAmmaMoving = (arg) => {
    return (arg &&
        arg.kind === "AmmaMoving" &&
        typeof arg.start === "boolean" &&
        isDirection(arg.direction));
};
export const isPlayerMoving = (arg) => {
    return (arg &&
        arg.kind === "PlayerMoving" &&
        isNumber(arg.id) &&
        isNumber(arg.x) &&
        isNumber(arg.y) &&
        typeof arg.start === "boolean" &&
        isDirection(arg.direction));
};
export function updatePlayer(player, deltaTime) {
    let dir;
    let dx = 0;
    let dy = 0;
    for (dir in DIRECTION_VECTORS) {
        if (player.moving[dir]) {
            dx += DIRECTION_VECTORS[dir].x,
                dy += DIRECTION_VECTORS[dir].y;
        }
    }
    player.x += dx * PLAYER_SPEED * deltaTime;
    player.y += dy * PLAYER_SPEED * deltaTime;
}
//# sourceMappingURL=common.mjs.map