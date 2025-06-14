
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

interface WebSocketMessage {
  type: 'earning_update' | 'referral_joined' | 'purchase_completed' | 'subscribe' | 'heartbeat'
  data?: any
  userId?: string
}

const connections = new Map<string, WebSocket>()

serve(async (req) => {
  const { headers } = req
  const upgradeHeader = headers.get("upgrade") || ""

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 })
  }

  const { socket, response } = Deno.upgradeWebSocket(req)
  
  socket.onopen = () => {
    console.log("WebSocket connection opened")
  }

  socket.onmessage = (event) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data)
      console.log("Received message:", message)

      switch (message.type) {
        case 'subscribe':
          if (message.userId) {
            connections.set(message.userId, socket)
            socket.send(JSON.stringify({
              type: 'connected',
              data: { status: 'subscribed', userId: message.userId }
            }))
          }
          break

        case 'heartbeat':
          socket.send(JSON.stringify({
            type: 'heartbeat_response',
            data: { timestamp: new Date().toISOString() }
          }))
          break

        default:
          console.log("Unknown message type:", message.type)
      }
    } catch (error) {
      console.error("Error parsing message:", error)
    }
  }

  socket.onclose = () => {
    // Remove connection from map
    for (const [userId, conn] of connections.entries()) {
      if (conn === socket) {
        connections.delete(userId)
        break
      }
    }
    console.log("WebSocket connection closed")
  }

  socket.onerror = (error) => {
    console.error("WebSocket error:", error)
  }

  return response
})

// Function to broadcast message to a specific user
export function broadcastToUser(userId: string, message: WebSocketMessage) {
  const connection = connections.get(userId)
  if (connection && connection.readyState === WebSocket.OPEN) {
    connection.send(JSON.stringify(message))
    return true
  }
  return false
}

// Function to broadcast to all connected users
export function broadcastToAll(message: WebSocketMessage) {
  let sentCount = 0
  for (const [userId, connection] of connections.entries()) {
    if (connection.readyState === WebSocket.OPEN) {
      connection.send(JSON.stringify(message))
      sentCount++
    }
  }
  return sentCount
}
