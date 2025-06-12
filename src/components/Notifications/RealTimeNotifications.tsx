
import React, { useEffect, useState } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { toast } from 'sonner';
import { Bell, DollarSign, Users, ShoppingCart } from 'lucide-react';

export const RealTimeNotifications = () => {
  const { subscribe, unsubscribe, isConnected } = useWebSocket();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const handleEarningUpdate = (data: any) => {
      toast.success(`💰 New Earning: ₹${data.amount}`, {
        description: `From ${data.source}`,
        action: {
          label: 'View',
          onClick: () => console.log('View earning details'),
        },
      });
      
      setNotifications(prev => [{
        id: Date.now(),
        type: 'earning',
        data,
        timestamp: new Date()
      }, ...prev.slice(0, 9)]);
    };

    const handleReferralJoined = (data: any) => {
      toast.info(`👥 New Referral Joined`, {
        description: `${data.referralName} joined as Level ${data.level}`,
      });
      
      setNotifications(prev => [{
        id: Date.now(),
        type: 'referral',
        data,
        timestamp: new Date()
      }, ...prev.slice(0, 9)]);
    };

    const handlePurchaseCompleted = (data: any) => {
      toast.success(`🛍️ Purchase Completed`, {
        description: `${data.referralName} made a ₹${data.amount} purchase. You earned ₹${data.earning}!`,
      });
      
      setNotifications(prev => [{
        id: Date.now(),
        type: 'purchase',
        data,
        timestamp: new Date()
      }, ...prev.slice(0, 9)]);
    };

    subscribe('earning_update', handleEarningUpdate);
    subscribe('referral_joined', handleReferralJoined);
    subscribe('purchase_completed', handlePurchaseCompleted);

    return () => {
      unsubscribe('earning_update');
      unsubscribe('referral_joined');
      unsubscribe('purchase_completed');
    };
  }, [subscribe, unsubscribe]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'earning':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'referral':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'purchase':
        return <ShoppingCart className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Live Notifications</h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-muted-foreground">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No notifications yet</p>
            <p className="text-sm">Real-time updates will appear here</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id} className="border rounded-lg p-3 bg-card">
              <div className="flex items-start gap-3">
                {getNotificationIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">{notification.type}</span>
                    <span className="text-xs text-muted-foreground">
                      {notification.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {notification.type === 'earning' && (
                      <span>Earned ₹{notification.data.amount} from {notification.data.source}</span>
                    )}
                    {notification.type === 'referral' && (
                      <span>{notification.data.referralName} joined as Level {notification.data.level}</span>
                    )}
                    {notification.type === 'purchase' && (
                      <span>{notification.data.referralName} purchased ₹{notification.data.amount}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
