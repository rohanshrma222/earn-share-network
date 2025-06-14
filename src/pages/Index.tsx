
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/Dashboard/DashboardLayout';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { ReferralCodeCard } from '@/components/Dashboard/ReferralCodeCard';
import { LiveEarningsWidget } from '@/components/Dashboard/LiveEarningsWidget';
import { RealTimeNotifications } from '@/components/Notifications/RealTimeNotifications';
import { PurchaseSimulator } from '@/components/Simulation/PurchaseSimulator';
import { useAuth } from '@/hooks/useAuth';
import { useReferralStats } from '@/hooks/useReferralStats';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, DollarSign, TrendingUp, Gift, Clock } from 'lucide-react';

const Index = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { stats, loading: statsLoading } = useReferralStats();
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Fetch recent activity
  useEffect(() => {
    const fetchRecentActivity = async () => {
      if (!user) return;

      try {
        const { data: referrals } = await supabase
          .from('referrals')
          .select(`
            *,
            referred:profiles!referrals_referred_id_fkey(full_name, username)
          `)
          .eq('referrer_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (referrals) {
          setRecentActivity(referrals.map(referral => ({
            id: referral.id,
            type: 'referral_joined',
            description: `${referral.referred?.full_name || referral.referred?.username || 'User'} joined as Level ${referral.level} referral`,
            amount: referral.earnings > 0 ? referral.earnings : null,
            timestamp: new Date(referral.created_at)
          })));
        }
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      }
    };

    fetchRecentActivity();
  }, [user]);

  if (authLoading) {
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
            title="Direct Referrals"
            value={statsLoading ? "..." : `${stats.direct_referrals_count}/8`}
            icon={Users}
            change={statsLoading ? "Loading..." : stats.direct_referrals_count === 0 ? "Start referring friends!" : `${Math.round((stats.direct_referrals_count / 8) * 100)}% capacity`}
            changeType={stats.direct_referrals_count >= 8 ? 'negative' : stats.direct_referrals_count > 0 ? 'positive' : 'neutral'}
          />
          <StatsCard
            title="Total Earnings"
            value={statsLoading ? "..." : `₹${stats.total_earnings.toLocaleString()}`}
            icon={DollarSign}
            change={statsLoading ? "Loading..." : stats.total_earnings === 0 ? "Your earnings will appear here" : "+18% this month"}
            changeType={stats.total_earnings > 0 ? 'positive' : 'neutral'}
          />
          <StatsCard
            title="Indirect Referrals"
            value={statsLoading ? "..." : stats.indirect_referrals_count.toString()}
            icon={TrendingUp}
            change={statsLoading ? "Loading..." : stats.indirect_referrals_count === 0 ? "No indirect referrals yet" : "Level 2 network growing"}
            changeType={stats.indirect_referrals_count > 0 ? 'positive' : 'neutral'}
          />
          <StatsCard
            title="This Month"
            value={statsLoading ? "..." : `₹${stats.monthly_earnings.toLocaleString()}`}
            icon={Gift}
            change={statsLoading ? "Loading..." : stats.monthly_earnings === 0 ? "Start earning today!" : "+12% from last month"}
            changeType={stats.monthly_earnings > 0 ? 'positive' : 'neutral'}
          />
        </div>

        {/* Live Features Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          <ReferralCodeCard />
          <LiveEarningsWidget />
          <PurchaseSimulator />
        </div>

        {/* Real-time Notifications and Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.length === 0 ? (
                <div className="flex items-center justify-center p-8 text-center">
                  <div>
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-muted-foreground">No activity yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Start referring friends to see your activity here
                    </p>
                  </div>
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="border rounded-lg p-3 bg-muted/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        {activity.amount && (
                          <p className="text-xs text-green-600 font-medium">
                            +₹{activity.amount.toFixed(2)} earned
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.timestamp.toLocaleDateString()} at {activity.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <RealTimeNotifications />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
