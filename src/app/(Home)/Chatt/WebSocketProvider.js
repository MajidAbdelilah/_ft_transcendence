import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  const connect = useCallback((userId) => {
    // Close existing connection
    if (socket) socket.close();

    // Create new WebSocket connection
    // const newSocket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${userId}`);
    const newSocket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${userId}/`);
    // 'ws://127.0.0.1:8000/ws/user_data/'
    newSocket.onopen = () => {
      console.log('WebSocket connected');
    };

    newSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };

    newSocket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const send = useCallback((message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }, [socket]);

  return (
    <WebSocketContext.Provider value={{ connect, send, messages }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};