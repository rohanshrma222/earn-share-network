
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/Dashboard/DashboardLayout';
import { ReferralTree } from '@/components/Referrals/ReferralTree';
import { ReferralStats } from '@/components/Referrals/ReferralStats';
import { AddReferralForm } from '@/components/Referrals/AddReferralForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useReferralStats } from '@/hooks/useReferralStats';
import { useReferralTree } from '@/hooks/useReferralTree';

const Referrals = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { stats, loading: statsLoading } = useReferralStats();
  const { directReferrals, indirectReferrals, loading: treeLoading } = useReferralTree();

  // Transform data for ReferralTree component
  const transformedDirectReferrals = directReferrals.map(ref => ({
    id: parseInt(ref.id.slice(-6), 16), // Convert UUID to number for component compatibility
    name: ref.name,
    email: ref.email,
    joinDate: ref.joinDate,
    earnings: ref.earnings,
    isActive: ref.isActive
  }));

  const transformedIndirectReferrals = indirectReferrals.map(ref => ({
    id: parseInt(ref.id.slice(-6), 16),
    name: ref.name,
    email: ref.email,
    parentId: 1, // Simplified for demo - in real app you'd track parent relationships
    earnings: ref.earnings,
    isActive: ref.isActive
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">My Referrals</h2>
            <p className="text-muted-foreground">
              Manage your referral network and track earnings
            </p>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="gap-2"
            disabled={stats.direct_referrals_count >= 8}
          >
            <Plus className="h-4 w-4" />
            Add Referral ({stats.direct_referrals_count}/8)
          </Button>
        </div>

        {statsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading stats...</p>
          </div>
        ) : (
          <ReferralStats 
            directCount={stats.direct_referrals_count}
            indirectCount={stats.indirect_referrals_count}
            totalEarnings={stats.total_earnings}
            monthlyEarnings={stats.monthly_earnings}
          />
        )}

        {treeLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading referral tree...</p>
          </div>
        ) : (
          <ReferralTree 
            directReferrals={transformedDirectReferrals}
            indirectReferrals={transformedIndirectReferrals}
          />
        )}

        {showAddForm && (
          <AddReferralForm
            onClose={() => setShowAddForm(false)}
            onAdd={(referral) => {
              console.log('Adding referral:', referral);
              setShowAddForm(false);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Referrals;
