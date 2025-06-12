
import React, { useEffect, useState } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { TrendingUp, DollarSign, Activity } from 'lucide-react';

export const LiveEarningsWidget = () => {
  const { subscribe, unsubscribe } = useWebSocket();
  const [liveEarnings, setLiveEarnings] = useState({
    todayTotal: 1250,
    recentEarnings: [] as any[],
    isUpdating: false
  });

  useEffect(() => {
    const handleEarningUpdate = (data: any) => {
      setLiveEarnings(prev => ({
        ...prev,
        todayTotal: prev.todayTotal + data.amount,
        recentEarnings: [{
          amount: data.amount,
          source: data.source,
          timestamp: new Date(data.timestamp)
        }, ...prev.recentEarnings.slice(0, 4)],
        isUpdating: true
      }));

      // Reset the updating indicator after animation
      setTimeout(() => {
        setLiveEarnings(prev => ({ ...prev, isUpdating: false }));
      }, 1000);
    };

    const handlePurchaseCompleted = (data: any) => {
      setLiveEarnings(prev => ({
        ...prev,
        todayTotal: prev.todayTotal + data.earning,
        recentEarnings: [{
          amount: data.earning,
          source: `Purchase by ${data.referralName}`,
          timestamp: new Date(data.timestamp)
        }, ...prev.recentEarnings.slice(0, 4)],
        isUpdating: true
      }));

      setTimeout(() => {
        setLiveEarnings(prev => ({ ...prev, isUpdating: false }));
      }, 1000);
    };

    subscribe('earning_update', handleEarningUpdate);
    subscribe('purchase_completed', handlePurchaseCompleted);

    return () => {
      unsubscribe('earning_update');
      unsubscribe('purchase_completed');
    };
  }, [subscribe, unsubscribe]);

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Live Earnings</h3>
        <Activity className={`h-5 w-5 ${liveEarnings.isUpdating ? 'text-green-500 animate-pulse' : 'text-muted-foreground'}`} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${liveEarnings.isUpdating ? 'bg-green-100 animate-pulse' : 'bg-muted'}`}>
            <DollarSign className={`h-4 w-4 ${liveEarnings.isUpdating ? 'text-green-600' : 'text-muted-foreground'}`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Today's Total</p>
            <p className={`text-2xl font-bold transition-all duration-500 ${liveEarnings.isUpdating ? 'text-green-600 scale-105' : ''}`}>
              ₹{liveEarnings.todayTotal.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Recent Activity</h4>
          {liveEarnings.recentEarnings.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">No recent activity</p>
          ) : (
            liveEarnings.recentEarnings.map((earning, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-2 rounded transition-all duration-500 ${
                  index === 0 && liveEarnings.isUpdating ? 'bg-green-50 border border-green-200' : 'bg-muted'
                }`}
              >
                <div>
                  <p className="text-sm font-medium">+₹{earning.amount}</p>
                  <p className="text-xs text-muted-foreground">{earning.source}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {earning.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-600 font-medium">
            Live updates enabled
          </span>
        </div>
      </div>
    </div>
  );
};
