// WebSocket service for real-time notifications and friend updates
let ws = null;
let messageHandlers = [];
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_INTERVAL = 3000;

const connectWebSocket = () => {
    if (ws) {
        ws.close();
    }

    try {
        ws = new WebSocket('ws://127.0.0.1:8000/ws/user_data/');

        ws.onopen = () => {
            // console.log('WebSocket connected');
            reconnectAttempts = 0; // Reset reconnection attempts on successful connection
            
            // Send a ping every 30 seconds to keep the connection alive
            setInterval(() => {
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: 'ping' }));
                }
            }, 30000);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                
                // Handle pong response
                if (data.type === 'pong') {
                    return;
                }

                // Send message to all handlers
                messageHandlers.forEach(handler => {
                    try {
                        handler(data);
                    } catch (error) {
                        console.error('Error in message handler:', error);
                    }
                });
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        ws.onclose = (event) => {
            // console.log('WebSocket disconnected:', event.code, event.reason);
            
            // Attempt to reconnect if not closed intentionally
            if (!event.wasClean && reconnectAttempts < MAX_RECONNECT_ATTEMPTS && !ws.intentionalClose) {
                reconnectAttempts++;
                // console.log(`Reconnecting... Attempt ${reconnectAttempts} of ${MAX_RECONNECT_ATTEMPTS}`);
                setTimeout(connectWebSocket, RECONNECT_INTERVAL);
            } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
                console.error('Max reconnection attempts reached');
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    } catch (error) {
        console.error('Error creating WebSocket connection:', error);
    }
};

const addMessageHandler = (handler) => {
    if (typeof handler === 'function') {
        messageHandlers.push(handler);
    }
};

const removeMessageHandler = (handler) => {
    messageHandlers = messageHandlers.filter(h => h !== handler);
};

const sendMessage = (message) => {
    if (!message || typeof message !== 'object') {
        console.error('Invalid message format');
        return;
    }

    try {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not connected');
            // Attempt to reconnect if disconnected
            if (!ws || ws.readyState === WebSocket.CLOSED) {
                connectWebSocket();
            }
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

const disconnect = () => {
    if (ws) {
        // Set a flag to prevent reconnection attempts
        ws.intentionalClose = true;
        ws.close();
        ws = null;
    }
};

const isConnected = () => {
    return ws && ws.readyState === WebSocket.OPEN;
};

export default {
    connect: connectWebSocket,
    disconnect,
    addHandler: addMessageHandler,
    removeHandler: removeMessageHandler,
    send: sendMessage,
    isConnected: () => ws && ws.readyState === WebSocket.OPEN
};
