from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from app.websockets.connection_manager import manager
from app.auth.jwt import decode_token
import json
import uuid

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket, 
    client_id: str = Query(None),
    token: str = Query(None),
    topics: str = Query(None)
):
    # Generate client_id if not provided
    if not client_id:
        client_id = str(uuid.uuid4())
    
    # Extract user_id from token if available
    user_id = None
    if token:
        try:
            payload = decode_token(token)
            user_id = payload.get("sub")
        except:
            pass
    
    # Parse topics to subscribe to
    topic_list = []
    if topics:
        topic_list = topics.split(",")
    
    # Add client to connection manager
    await manager.connect(websocket, client_id, user_id)
    
    # Subscribe to topics
    for topic in topic_list:
        if topic not in manager.active_connections:
            manager.active_connections[topic] = []
        manager.active_connections[topic].append(websocket)
    
    try:
        # Send initial connection confirmation
        await manager.send_personal_message(
            {
                "type": "connection_established",
                "client_id": client_id,
                "user_id": user_id,
                "topics": topic_list
            },
            websocket
        )
        
        # Listen for messages from this client
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            if message.get("type") == "subscribe":
                topic = message.get("topic")
                if topic:
                    if topic not in manager.active_connections:
                        manager.active_connections[topic] = []
                    manager.active_connections[topic].append(websocket)
                    await manager.send_personal_message(
                        {"type": "subscribed", "topic": topic},
                        websocket
                    )
            
            elif message.get("type") == "unsubscribe":
                topic = message.get("topic")
                if topic and topic in manager.active_connections:
                    if websocket in manager.active_connections[topic]:
                        manager.active_connections[topic].remove(websocket)
                    await manager.send_personal_message(
                        {"type": "unsubscribed", "topic": topic},
                        websocket
                    )
            
            # Add more message type handlers as needed
            
    except WebSocketDisconnect:
        # Clean up on disconnect
        manager.disconnect(websocket, client_id, user_id)
        
        # Unsubscribe from all topics
        for topic in topic_list:
            if topic in manager.active_connections and websocket in manager.active_connections[topic]:
                manager.active_connections[topic].remove(websocket)
