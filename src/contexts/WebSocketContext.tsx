
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';

interface WebSocketContextType {
  isConnected: boolean;
  sendMessage: (message: any) => void;
  subscribe: (event: string, callback: (data: any) => void) => void;
  unsubscribe: (event: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [subscribers, setSubscribers] = useState<Map<string, ((data: any) => void)[]>>(new Map());

  useEffect(() => {
    // In a real implementation, this would connect to your actual WebSocket server
    // For demo purposes, we'll simulate a WebSocket connection
    const mockSocket = {
      readyState: WebSocket.OPEN,
      send: (data: string) => console.log('Sending:', data),
      close: () => setIsConnected(false),
      addEventListener: (event: string, handler: any) => {},
      removeEventListener: (event: string, handler: any) => {},
    } as unknown as WebSocket;

    setSocket(mockSocket);
    setIsConnected(true);

    // Simulate incoming real-time messages
    const simulateMessages = () => {
      const events = ['earning_update', 'referral_joined', 'purchase_completed'];
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      
      const mockData = {
        earning_update: {
          userId: 'user123',
          amount: Math.floor(Math.random() * 500) + 50,
          source: 'Level 1 Referral',
          timestamp: new Date().toISOString()
        },
        referral_joined: {
          referralName: 'John Doe',
          level: Math.random() > 0.5 ? 1 : 2,
          timestamp: new Date().toISOString()
        },
        purchase_completed: {
          amount: Math.floor(Math.random() * 5000) + 1000,
          referralName: 'Jane Smith',
          earning: Math.floor(Math.random() * 250) + 25,
          timestamp: new Date().toISOString()
        }
      };

      const data = mockData[randomEvent as keyof typeof mockData];
      
      // Notify subscribers
      const eventSubscribers = subscribers.get(randomEvent) || [];
      eventSubscribers.forEach(callback => callback(data));
    };

    // Simulate messages every 10-15 seconds
    const interval = setInterval(simulateMessages, Math.random() * 5000 + 10000);

    return () => {
      clearInterval(interval);
      mockSocket.close();
    };
  }, [subscribers]);

  const sendMessage = (message: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    }
  };

  const subscribe = (event: string, callback: (data: any) => void) => {
    setSubscribers(prev => {
      const newMap = new Map(prev);
      const eventSubs = newMap.get(event) || [];
      newMap.set(event, [...eventSubs, callback]);
      return newMap;
    });
  };

  const unsubscribe = (event: string) => {
    setSubscribers(prev => {
      const newMap = new Map(prev);
      newMap.delete(event);
      return newMap;
    });
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, sendMessage, subscribe, unsubscribe }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
