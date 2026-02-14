import type { ServerWebSocket, WebSocket } from "bun";

export function socketHandler(ws: ServerWebSocket, message: string | Buffer) {
  const body = JSON.parse(message.toString());
}
