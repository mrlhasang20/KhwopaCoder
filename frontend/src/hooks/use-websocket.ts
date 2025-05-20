"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"

type WebSocketStatus = "connecting" | "open" | "closed" | "error"

interface UseWebSocketOptions {
  topics?: string[]
  onMessage?: (data: any) => void
  reconnectInterval?: number
  reconnectAttempts?: number
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { user } = useAuth()
  const [status, setStatus] = useState<WebSocketStatus>("closed")
  const [lastMessage, setLastMessage] = useState<any>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = options.reconnectAttempts || 5
  const reconnectInterval = options.reconnectInterval || 3000

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    // Close existing connection if any
    if (wsRef.current) {
      wsRef.current.close()
    }

    // Build WebSocket URL with query parameters
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    const baseUrl = `${protocol}//${process.env.NEXT_PUBLIC_API_URL?.replace(/^https?:\/\//, "")}/ws`

    const params = new URLSearchParams()

    // Add client ID
    const clientId = localStorage.getItem("ws_client_id") || crypto.randomUUID()
    localStorage.setItem("ws_client_id", clientId)
    params.append("client_id", clientId)

    // Add auth token if user is logged in
    const token = localStorage.getItem("khwopacoder_token")
    if (token) {
      params.append("token", token)
    }

    // Add topics to subscribe to
    if (options.topics && options.topics.length > 0) {
      params.append("topics", options.topics.join(","))
    }

    const wsUrl = `${baseUrl}?${params.toString()}`

    // Create new WebSocket connection
    wsRef.current = new WebSocket(wsUrl)
    setStatus("connecting")

    wsRef.current.onopen = () => {
      setStatus("open")
      reconnectAttemptsRef.current = 0

      // Subscribe to additional topics if needed
      if (options.topics && options.topics.length > 0) {
        options.topics.forEach((topic) => {
          send({ type: "subscribe", topic })
        })
      }
    }

    wsRef.current.onclose = () => {
      setStatus("closed")

      // Attempt to reconnect
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttemptsRef.current += 1
          connect()
        }, reconnectInterval)
      }
    }

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error)
      setStatus("error")
    }

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setLastMessage(data)

        // Call the onMessage callback if provided
        if (options.onMessage) {
          options.onMessage(data)
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
      }
    }
  }, [options.topics, options.onMessage, maxReconnectAttempts, reconnectInterval])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    setStatus("closed")
  }, [])

  const send = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data))
      return true
    }
    return false
  }, [])

  const subscribe = useCallback(
    (topic: string) => {
      return send({ type: "subscribe", topic })
    },
    [send],
  )

  const unsubscribe = useCallback(
    (topic: string) => {
      return send({ type: "unsubscribe", topic })
    },
    [send],
  )

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  // Reconnect when user auth changes
  useEffect(() => {
    if (status === "open") {
      disconnect()
      connect()
    }
  }, [user?.id, connect, disconnect, status])

  return {
    status,
    lastMessage,
    send,
    subscribe,
    unsubscribe,
    connect,
    disconnect,
  }
}
