
import React from 'react';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { Users, TrendingUp, DollarSign, UserCheck } from 'lucide-react';

interface ReferralStatsProps {
  directCount: number;
  indirectCount: number;
  totalEarnings: number;
  monthlyEarnings: number;
}

export const ReferralStats = ({ 
  directCount, 
  indirectCount, 
  totalEarnings, 
  monthlyEarnings 
}: ReferralStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Direct Referrals"
        value={`${directCount}/8`}
        icon={Users}
        change={`${Math.round((directCount / 8) * 100)}% capacity`}
        changeType={directCount >= 8 ? 'negative' : 'positive'}
      />
      <StatsCard
        title="Indirect Referrals"
        value={indirectCount.toString()}
        icon={UserCheck}
        change="Level 2 network"
        changeType="neutral"
      />
      <StatsCard
        title="Total Earnings"
        value={`₹${totalEarnings.toLocaleString()}`}
        icon={DollarSign}
        change="+18% this month"
        changeType="positive"
      />
      <StatsCard
        title="Monthly Earnings"
        value={`₹${monthlyEarnings.toLocaleString()}`}
        icon={TrendingUp}
        change="+12% from last month"
        changeType="positive"
      />
    </div>
  );
};
