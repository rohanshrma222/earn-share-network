
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

interface WebSocketMessage {
  type: 'earning_update' | 'referral_joined' | 'purchase_completed' | 'subscribe' | 'heartbeat'
  data?: any
  userId?: string
}

const connections = new Map<string, WebSocket>()

serve(async (req) => {
  console.log('WebSocket handler received request:', req.method, req.url)
  
  const { headers } = req
  const upgradeHeader = headers.get("upgrade") || ""

  // Handle WebSocket upgrade
  if (upgradeHeader.toLowerCase() === "websocket") {
    console.log('WebSocket upgrade requested')
    const { socket, response } = Deno.upgradeWebSocket(req)
    
    socket.onopen = () => {
      console.log("WebSocket connection opened")
    }

    socket.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data)
        console.log("Received WebSocket message:", message)

        switch (message.type) {
          case 'subscribe':
            if (message.userId) {
              connections.set(message.userId, socket)
              console.log(`User ${message.userId} subscribed. Total connections: ${connections.size}`)
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
        console.error("Error parsing WebSocket message:", error)
      }
    }

    socket.onclose = () => {
      // Remove connection from map
      for (const [userId, conn] of connections.entries()) {
        if (conn === socket) {
          connections.delete(userId)
          console.log(`User ${userId} disconnected. Total connections: ${connections.size}`)
          break
        }
      }
      console.log("WebSocket connection closed")
    }

    socket.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    return response
  }

  // Handle HTTP POST requests for broadcasting messages
  if (req.method === 'POST') {
    try {
      const { type, userId, data } = await req.json()
      console.log(`Broadcasting message to user ${userId}:`, { type, data })
      
      if (userId && connections.has(userId)) {
        const socket = connections.get(userId)
        if (socket && socket.readyState === WebSocket.OPEN) {
          const message = JSON.stringify({ type, data })
          socket.send(message)
          console.log(`Message sent successfully to user ${userId}`)
          
          return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
          })
        } else {
          console.log(`Socket for user ${userId} is not in OPEN state`)
        }
      } else {
        console.log(`User ${userId} not found in connections. Available users:`, Array.from(connections.keys()))
      }
      
      return new Response(JSON.stringify({ success: false, error: 'User not connected' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      console.error('Error handling POST request:', error)
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }

  return new Response("Expected WebSocket connection or POST request", { status: 400 })
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
