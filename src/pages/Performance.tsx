
import React from 'react';
import { DashboardLayout } from '@/components/Dashboard/DashboardLayout';
import { PerformanceMetrics } from '@/components/Performance/PerformanceMetrics';

const Performance = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Performance</h2>
          <p className="text-muted-foreground">
            Track your progress, achievements, and performance insights
          </p>
        </div>

        <PerformanceMetrics />
      </div>
    </DashboardLayout>
  );
};

export default Performance;
