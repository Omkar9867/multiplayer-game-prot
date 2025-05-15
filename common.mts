export const SERVER_PORT = 6970;
export const WORLD_WIDTH = 800;
export const WORLD_HEIGHT = 800;

export interface Hello {
    kind: "Hello";
    id: number;
}

export const isHello = (arg: any): arg is Hello => {
    return arg
    && arg.kind === "Hello" && typeof(arg.id) === "number" 
}