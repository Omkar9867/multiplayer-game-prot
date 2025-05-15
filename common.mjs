export const SERVER_PORT = 6970;
export const WORLD_WIDTH = 800;
export const WORLD_HEIGHT = 800;
export const isHello = (arg) => {
    return arg
        && arg.kind === "Hello" && typeof (arg.id) === "number";
};
//# sourceMappingURL=common.mjs.map