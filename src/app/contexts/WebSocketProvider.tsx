import { createContext, useContext, useEffect } from 'react';
import websocketService from '../services/websocket';

interface WebSocketContextType {
    addHandler: (handler: (data: any) => void) => void;
    removeHandler: (handler: (data: any) => void) => void;
    send: (message: any) => void;
    isConnected: () => boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
    addHandler: () => {},
    removeHandler: () => {},
    send: () => {},
    isConnected: () => false,
});

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        websocketService.connect();
        return () => {
            websocketService.disconnect();
        };
    }, []);

    const value = {
        addHandler: websocketService.addHandler,
        removeHandler: websocketService.removeHandler,
        send: websocketService.send,
        isConnected: websocketService.isConnected,
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
}

export const useWebSocket = () => useContext(WebSocketContext);
