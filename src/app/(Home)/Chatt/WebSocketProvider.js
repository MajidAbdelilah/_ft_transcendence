import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  const connect = useCallback((userId) => {
    // Close existing connection
    if (socket) socket.close();

    // Create new WebSocket connection

    const newSocket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${userId}/`);
    
    newSocket.onopen = () => {
    };

    newSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages([message]);
      // setMessages((prevMessages) => [...prevMessages, message]); // Append new message

    };

    newSocket.onclose = () => {
    };

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);
  
  // useEffect(() => {
  //   return () => {
  //     if (socket) {
  //       socket.close();
  //     }
  //   };
  // }, [socket]);


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