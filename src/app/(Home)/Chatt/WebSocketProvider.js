import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback((userId) => {
    // Prevent multiple connections
    if (isConnected) return;

    // Close existing connection if any
    if (socket) socket.close();

    // Create new WebSocket connection
    const newSocket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${userId}/`);
    
    newSocket.onopen = () => {
      console.log('WebSocket connected ---');
      setIsConnected(true);
    };

    newSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages([message]);
    };

    newSocket.onclose = () => {
      console.log('WebSocket disconnected---');
      setIsConnected(false);
    };

    setSocket(newSocket);

    // Cleanup function
    return () => {
      newSocket.close();
      setIsConnected(false);
    };
  }, [isConnected]);
  
  const send = useCallback((message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }, [socket]);

  return (
    <WebSocketContext.Provider value={{ connect, send, messages, isConnected }}>
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