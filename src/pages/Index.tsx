
import React from 'react';
import { DashboardLayout } from '@/components/Dashboard/DashboardLayout';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { ReferralCodeCard } from '@/components/Dashboard/ReferralCodeCard';
import { LiveEarningsWidget } from '@/components/Dashboard/LiveEarningsWidget';
import { RealTimeNotifications } from '@/components/Notifications/RealTimeNotifications';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, DollarSign, TrendingUp, Gift } from 'lucide-react';

const Index = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Referral Dashboard</h1>
            <p className="text-xl text-muted-foreground mt-2">
              Join our network and start earning through referrals
            </p>
          </div>
          <div className="space-x-4">
            <Button asChild size="lg">
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const displayName = profile?.full_name || profile?.username || user.email || 'User';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {displayName}!</h2>
          <p className="text-muted-foreground">
            Here's an overview of your referral performance with live updates.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Referrals"
            value="0"
            icon={Users}
            change="Start referring friends!"
            changeType="neutral"
          />
          <StatsCard
            title="Total Earnings"
            value="₹0"
            icon={DollarSign}
            change="Your earnings will appear here"
            changeType="neutral"
          />
          <StatsCard
            title="Active Referrals"
            value="0"
            icon={TrendingUp}
            change="No active referrals yet"
            changeType="neutral"
          />
          <StatsCard
            title="This Month"
            value="₹0"
            icon={Gift}
            change="Start earning today!"
            changeType="neutral"
          />
        </div>

        {/* Live Features Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          <ReferralCodeCard />
          <LiveEarningsWidget />
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <span className="text-sm">Direct Referrals (Level 1)</span>
                <span className="font-semibold">0/8</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <span className="text-sm">Indirect Referrals (Level 2)</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <span className="text-sm">Pending Earnings</span>
                <span className="font-semibold text-green-600">₹0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Notifications and Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-center p-8 text-center">
                <div>
                  <p className="text-muted-foreground">No activity yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Start referring friends to see your activity here
                  </p>
                </div>
              </div>
            </div>
          </div>

          <RealTimeNotifications />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
