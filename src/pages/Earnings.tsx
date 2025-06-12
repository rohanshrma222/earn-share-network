
import React from 'react';
import { DashboardLayout } from '@/components/Dashboard/DashboardLayout';
import { LiveEarningsWidget } from '@/components/Dashboard/LiveEarningsWidget';
import { EarningsCalculator } from '@/components/Referrals/EarningsCalculator';

const Earnings = () => {
  // Mock purchase data for earnings calculation
  const mockPurchases = [
    { id: 1, amount: 2500, userId: 1, userLevel: 1 as const, date: '2024-01-15' },
    { id: 2, amount: 1800, userId: 2, userLevel: 1 as const, date: '2024-01-16' },
    { id: 3, amount: 3200, userId: 3, userLevel: 1 as const, date: '2024-01-17' },
    { id: 4, amount: 1200, userId: 4, userLevel: 2 as const, date: '2024-01-18' },
    { id: 5, amount: 900, userId: 5, userLevel: 2 as const, date: '2024-01-19' },
    { id: 6, amount: 1500, userId: 6, userLevel: 2 as const, date: '2024-01-20' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Earnings Dashboard</h2>
          <p className="text-muted-foreground">
            Track your real-time earnings and commission breakdown
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <LiveEarningsWidget />
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-medium">Total Earned This Month</span>
                <span className="text-xl font-bold text-green-600">₹4,250</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-medium">Level 1 Commissions</span>
                <span className="font-semibold">₹3,400 (5%)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-medium">Level 2 Commissions</span>
                <span className="font-semibold">₹850 (1%)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-medium">Pending Withdrawals</span>
                <span className="font-semibold text-orange-600">₹1,200</span>
              </div>
            </div>
          </div>
        </div>

        <EarningsCalculator purchases={mockPurchases} />
      </div>
    </DashboardLayout>
  );
};

export default Earnings;
