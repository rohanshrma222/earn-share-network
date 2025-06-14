
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface WebSocketContextType {
  isConnected: boolean;
  subscribe: (event: string, callback: (data: any) => void) => void;
  unsubscribe: (event: string) => void;
  sendMessage: (message: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const subscribersRef = useRef<Map<string, Set<(data: any) => void>>>(new Map());
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!user) {
      setIsConnected(false);
      return;
    }

    console.log('Setting up real-time connection for user:', user.id);

    // Create a channel for this user's notifications
    const channel = supabase.channel(`user-${user.id}-notifications`);

    // Listen for broadcast messages
    channel
      .on('broadcast', { event: 'earning_update' }, (payload) => {
        console.log('Received earning_update:', payload);
        const subscribers = subscribersRef.current.get('earning_update');
        if (subscribers) {
          subscribers.forEach(callback => callback(payload.payload));
        }
      })
      .on('broadcast', { event: 'purchase_completed' }, (payload) => {
        console.log('Received purchase_completed:', payload);
        const subscribers = subscribersRef.current.get('purchase_completed');
        if (subscribers) {
          subscribers.forEach(callback => callback(payload.payload));
        }
      })
      .on('broadcast', { event: 'referral_joined' }, (payload) => {
        console.log('Received referral_joined:', payload);
        const subscribers = subscribersRef.current.get('referral_joined');
        if (subscribers) {
          subscribers.forEach(callback => callback(payload.payload));
        }
      })
      .subscribe((status) => {
        console.log('Channel subscription status:', status);
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          console.log('Real-time connection established');
        } else if (status === 'CHANNEL_ERROR') {
          setIsConnected(false);
          console.error('Real-time connection error');
        } else if (status === 'TIMED_OUT') {
          setIsConnected(false);
          console.error('Real-time connection timed out');
        }
      });

    channelRef.current = channel;

    return () => {
      console.log('Cleaning up real-time connection');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      setIsConnected(false);
    };
  }, [user]);

  const subscribe = (event: string, callback: (data: any) => void) => {
    const subscribers = subscribersRef.current.get(event) || new Set();
    subscribers.add(callback);
    subscribersRef.current.set(event, subscribers);
    console.log(`Subscribed to event: ${event}`);
  };

  const unsubscribe = (event: string) => {
    subscribersRef.current.delete(event);
    console.log(`Unsubscribed from event: ${event}`);
  };

  const sendMessage = (message: any) => {
    if (channelRef.current && isConnected) {
      channelRef.current.send({
        type: 'broadcast',
        event: message.type,
        payload: message.data
      });
    } else {
      console.warn('Real-time channel is not connected');
    }
  };

  return (
    <WebSocketContext.Provider value={{
      isConnected,
      subscribe,
      unsubscribe,
      sendMessage
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
