
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/Dashboard/DashboardLayout';
import { AuthContainer } from '@/components/Auth/AuthContainer';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { ReferralCodeCard } from '@/components/Dashboard/ReferralCodeCard';
import { Users, DollarSign, TrendingUp, Gift } from 'lucide-react';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AuthContainer onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here's an overview of your referral performance.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Referrals"
            value="24"
            icon={Users}
            change="+3 this month"
            changeType="positive"
          />
          <StatsCard
            title="Total Earnings"
            value="₹12,450"
            icon={DollarSign}
            change="+12% from last month"
            changeType="positive"
          />
          <StatsCard
            title="Active Referrals"
            value="18"
            icon={TrendingUp}
            change="75% active rate"
            changeType="neutral"
          />
          <StatsCard
            title="This Month"
            value="₹2,340"
            icon={Gift}
            change="+23% from last month"
            changeType="positive"
          />
        </div>

        {/* Referral Code Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <ReferralCodeCard />
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <span className="text-sm">Direct Referrals (Level 1)</span>
                <span className="font-semibold">8/8</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <span className="text-sm">Indirect Referrals (Level 2)</span>
                <span className="font-semibold">16</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <span className="text-sm">Pending Earnings</span>
                <span className="font-semibold text-green-600">₹540</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border-l-4 border-l-green-500 bg-muted/50">
              <div>
                <p className="font-medium">New referral joined</p>
                <p className="text-sm text-muted-foreground">John Doe used your referral code</p>
              </div>
              <span className="text-sm text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 border-l-4 border-l-blue-500 bg-muted/50">
              <div>
                <p className="font-medium">Earnings credited</p>
                <p className="text-sm text-muted-foreground">₹125 from Level 1 referral purchase</p>
              </div>
              <span className="text-sm text-muted-foreground">5 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 border-l-4 border-l-purple-500 bg-muted/50">
              <div>
                <p className="font-medium">Level 2 earning</p>
                <p className="text-sm text-muted-foreground">₹25 from indirect referral</p>
              </div>
              <span className="text-sm text-muted-foreground">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
