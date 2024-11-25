// Simple WebSocket service for friends feature
let ws = null;
let messageHandlers = [];

const connectWebSocket = () => {
    if (ws) {
        ws.close();
    }

    ws = new WebSocket('ws://127.0.0.1:8000/ws/friends');

    ws.onopen = () => {
        console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // Send message to all handlers
        messageHandlers.forEach(handler => handler(data));
    };

    ws.onclose = () => {
        console.log('WebSocket disconnected');
        setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
};

const addMessageHandler = (handler) => {
    messageHandlers.push(handler);
};

const removeMessageHandler = (handler) => {
    messageHandlers = messageHandlers.filter(h => h !== handler);
};

const sendMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    } else {
        console.error('WebSocket is not connected');
    }
};

export default {
    connect: connectWebSocket,
    addHandler: addMessageHandler,
    removeHandler: removeMessageHandler,
    send: sendMessage
};
