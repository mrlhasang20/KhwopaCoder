from fastapi import WebSocket
import json
from typing import Dict, List, Any, Optional

class ConnectionManager:
    def __init__(self):
        # Store connections by client_id
        self.active_connections: Dict[str, WebSocket] = {}
        
        # Store connections by user_id
        self.user_connections: Dict[str, List[WebSocket]] = {}
        
        # Store connections by topic
        self.topic_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, client_id: str, user_id: Optional[str] = None):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        
        # If user is authenticated, store their connection
        if user_id:
            if user_id not in self.user_connections:
                self.user_connections[user_id] = []
            self.user_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, client_id: str, user_id: Optional[str] = None):
        if client_id in self.active_connections:
            del self.active_connections[client_id]
        
        # Remove from user connections
        if user_id and user_id in self.user_connections:
            if websocket in self.user_connections[user_id]:
                self.user_connections[user_id].remove(websocket)
            if not self.user_connections[user_id]:
                del self.user_connections[user_id]
        
        # Remove from topic connections
        for topic, connections in list(self.topic_connections.items()):
            if websocket in connections:
                connections.remove(websocket)
            if not connections:
                del self.topic_connections[topic]

    async def send_personal_message(self, message: Any, websocket: WebSocket):
        if isinstance(message, dict):
            await websocket.send_json(message)
        else:
            await websocket.send_text(str(message))

    async def broadcast(self, message: Any):
        for websocket in self.active_connections.values():
            if isinstance(message, dict):
                await websocket.send_json(message)
            else:
                await websocket.send_text(str(message))
    
    async def broadcast_to_topic(self, topic: str, message: Any):
        if topic not in self.topic_connections:
            return
        
        for websocket in self.topic_connections[topic]:
            if isinstance(message, dict):
                await websocket.send_json(message)
            else:
                await websocket.send_text(str(message))
    
    async def broadcast_to_user(self, user_id: str, message: Any):
        if user_id not in self.user_connections:
            return
        
        for websocket in self.user_connections[user_id]:
            if isinstance(message, dict):
                await websocket.send_json(message)
            else:
                await websocket.send_text(str(message))

# Create a global instance
manager = ConnectionManager()
