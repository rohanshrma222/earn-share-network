
import React from 'react';
import { DashboardLayout } from '@/components/Dashboard/DashboardLayout';
import { RealTimeAnalytics } from '@/components/Analytics/RealTimeAnalytics';
import { RealTimeNotifications } from '@/components/Notifications/RealTimeNotifications';

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">
            Real-time insights into your referral performance
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RealTimeAnalytics />
          </div>
          <div>
            <RealTimeNotifications />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
