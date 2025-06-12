
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/Dashboard/DashboardLayout';
import { ReferralTree } from '@/components/Referrals/ReferralTree';
import { ReferralStats } from '@/components/Referrals/ReferralStats';
import { AddReferralForm } from '@/components/Referrals/AddReferralForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Referrals = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock data for referral hierarchy
  const mockReferrals = {
    direct: [
      { id: 1, name: 'John Doe', email: 'john@example.com', joinDate: '2024-01-15', earnings: 2500, isActive: true },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', joinDate: '2024-02-10', earnings: 1800, isActive: true },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', joinDate: '2024-03-05', earnings: 3200, isActive: false },
    ],
    indirect: [
      { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', parentId: 1, earnings: 1200, isActive: true },
      { id: 5, name: 'Tom Brown', email: 'tom@example.com', parentId: 1, earnings: 900, isActive: true },
      { id: 6, name: 'Lisa Davis', email: 'lisa@example.com', parentId: 2, earnings: 1500, isActive: true },
    ]
  };

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
            disabled={mockReferrals.direct.length >= 8}
          >
            <Plus className="h-4 w-4" />
            Add Referral ({mockReferrals.direct.length}/8)
          </Button>
        </div>

        <ReferralStats 
          directCount={mockReferrals.direct.length}
          indirectCount={mockReferrals.indirect.length}
          totalEarnings={5400}
          monthlyEarnings={1200}
        />

        <ReferralTree 
          directReferrals={mockReferrals.direct}
          indirectReferrals={mockReferrals.indirect}
        />

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
