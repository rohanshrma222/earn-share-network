
import React, { useEffect, useState } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export const RealTimeAnalytics = () => {
  const { subscribe, unsubscribe } = useWebSocket();
  const [analyticsData, setAnalyticsData] = useState({
    hourlyEarnings: [
      { hour: '09:00', earnings: 120 },
      { hour: '10:00', earnings: 250 },
      { hour: '11:00', earnings: 180 },
      { hour: '12:00', earnings: 340 },
      { hour: '13:00', earnings: 220 },
      { hour: '14:00', earnings: 280 },
    ],
    referralActivity: [
      { level: 'Level 1', count: 3, earnings: 450 },
      { level: 'Level 2', count: 8, earnings: 180 },
    ]
  });

  useEffect(() => {
    const handleEarningUpdate = (data: any) => {
      const currentHour = new Date().getHours();
      const hourLabel = `${currentHour.toString().padStart(2, '0')}:00`;

      setAnalyticsData(prev => {
        const newHourlyEarnings = [...prev.hourlyEarnings];
        const existingHourIndex = newHourlyEarnings.findIndex(item => item.hour === hourLabel);
        
        if (existingHourIndex >= 0) {
          newHourlyEarnings[existingHourIndex].earnings += data.amount;
        } else {
          newHourlyEarnings.push({ hour: hourLabel, earnings: data.amount });
          if (newHourlyEarnings.length > 6) {
            newHourlyEarnings.shift();
          }
        }

        return {
          ...prev,
          hourlyEarnings: newHourlyEarnings
        };
      });
    };

    const handleReferralJoined = (data: any) => {
      setAnalyticsData(prev => {
        const newReferralActivity = [...prev.referralActivity];
        const levelIndex = newReferralActivity.findIndex(item => item.level === `Level ${data.level}`);
        
        if (levelIndex >= 0) {
          newReferralActivity[levelIndex].count += 1;
        }

        return {
          ...prev,
          referralActivity: newReferralActivity
        };
      });
    };

    subscribe('earning_update', handleEarningUpdate);
    subscribe('referral_joined', handleReferralJoined);

    return () => {
      unsubscribe('earning_update');
      unsubscribe('referral_joined');
    };
  }, [subscribe, unsubscribe]);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Real-Time Analytics</h3>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h4 className="font-medium mb-4">Hourly Earnings</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={analyticsData.hourlyEarnings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, 'Earnings']} />
              <Line 
                type="monotone" 
                dataKey="earnings" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h4 className="font-medium mb-4">Referral Activity</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analyticsData.referralActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="level" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" name="Referrals" />
              <Bar dataKey="earnings" fill="hsl(var(--muted-foreground))" name="Earnings (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
