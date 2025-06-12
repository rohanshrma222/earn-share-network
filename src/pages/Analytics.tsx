
import React from 'react';
import { DashboardLayout } from '@/components/Dashboard/DashboardLayout';
import { RealTimeAnalytics } from '@/components/Analytics/RealTimeAnalytics';
import { AdvancedAnalytics } from '@/components/Analytics/AdvancedAnalytics';
import { RealTimeNotifications } from '@/components/Notifications/RealTimeNotifications';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">
            Real-time insights and advanced analytics for your referral performance
          </p>
        </div>

        <Tabs defaultValue="realtime" className="space-y-4">
          <TabsList>
            <TabsTrigger value="realtime">Real-time</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="realtime" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <RealTimeAnalytics />
              </div>
              <div>
                <RealTimeNotifications />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <AdvancedAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
