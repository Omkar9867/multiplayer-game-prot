export const SERVER_PORT = 6970;
export const WORLD_WIDTH = 800;
export const WORLD_HEIGHT = 800;
export const SERVER_FPS = 30;
export const PLAYER_SPEED = 200;

export const PLAYER_SIZE = 30;

export type Direction = "up" | "down" | "left" | "right";

export type Moving = {
  [key in Direction]: boolean;
};

export interface Player {
  id: number;
  x: number;
  y: number;
  moving: Moving;
}

export const DEFAULT_MOVING = {
  up: false,
  down: false,
  left: false,
  right: false,
};

export type Vector2 = {x: number, y: number};
export const DIRECTION_VECTORS: {[key in Direction]: Vector2} = {
  up: { x: 0, y: -1},
  down: { x: 0, y: 1},
  left: { x: -1, y: 0},
  right: { x: 1, y: 0},
}

export const isDirection = (arg: any): arg is Direction => {
  return DIRECTION_VECTORS[arg as Direction] !== undefined;
};

export const isNumber = (arg: any): arg is number => {
  return typeof arg === "number";
};

export interface Hello {
  kind: "Hello";
  id: number;
}

export const isHello = (arg: any): arg is Hello => {
  return arg && arg.kind === "Hello" && isNumber(arg.id);
};

export interface PlayerJoined {
  kind: "PlayerJoined";
  player: {
    id: number;
    x: number;
    y: number;
  };
}

export const isPlayerJoined = (arg: any): arg is PlayerJoined => {
  return (
    arg &&
    arg.kind === "PlayerJoined" &&
    isNumber(arg.player.id) &&
    isNumber(arg.player.x) &&
    isNumber(arg.player.y)
  );
};

export interface PlayerLeft {
  kind: "PlayerLeft";
  player: {
    id: number;
  };
}

export const isPlayerLeft = (arg: any): arg is PlayerLeft => {
  return arg && arg.kind === "PlayerLeft" && isNumber(arg.player.id);
};

export interface AmmaMoving {
  kind: "PlayerMoving";
  start: boolean;
  direction: Direction;
}

export const isAmmaMoving = (arg: any): arg is AmmaMoving => {
  return (
    arg &&
    arg.kind === "AmmaMoving" &&
    typeof arg.start === "boolean" &&
    isDirection(arg.direction)
  );
};

export interface PlayerMoving {
  kind: "PlayerMoving";
  id: number;
  x: number;
  y: number;
  start: boolean;
  direction: Direction;
}
export const isPlayerMoving = (arg: any): arg is PlayerMoving => {
  return (
    arg &&
    arg.kind === "PlayerMoving" &&
    isNumber(arg.id) &&
    isNumber(arg.x) &&
    isNumber(arg.y) &&
    typeof arg.start === "boolean" &&
    isDirection(arg.direction)
  );
};

export type Event = PlayerJoined | PlayerLeft | PlayerMoving;

export function updatePlayer(player: Player, deltaTime: number){
  let dir: Direction;
  let dx = 0;
  let dy = 0;
  for (dir in DIRECTION_VECTORS){
    if (player.moving[dir]) {
      dx += DIRECTION_VECTORS[dir].x,
      dy += DIRECTION_VECTORS[dir].y
    }
  }
  player.x += dx*PLAYER_SPEED * deltaTime
  player.y += dy*PLAYER_SPEED * deltaTime 
}

