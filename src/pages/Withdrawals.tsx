
import React from 'react';
import { DashboardLayout } from '@/components/Dashboard/DashboardLayout';
import { WithdrawalManager } from '@/components/Withdrawal/WithdrawalManager';

const Withdrawals = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Withdrawals</h2>
          <p className="text-muted-foreground">
            Manage your withdrawal requests and track payment history
          </p>
        </div>

        <WithdrawalManager />
      </div>
    </DashboardLayout>
  );
};

export default Withdrawals;
