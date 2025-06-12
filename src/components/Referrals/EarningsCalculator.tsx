
import React from 'react';

interface Purchase {
  id: number;
  amount: number;
  userId: number;
  userLevel: 1 | 2;
  date: string;
}

interface EarningsCalculatorProps {
  purchases: Purchase[];
}

export const EarningsCalculator = ({ purchases }: EarningsCalculatorProps) => {
  const calculateEarnings = (purchase: Purchase) => {
    // Only calculate earnings for purchases above ₹1000
    if (purchase.amount < 1000) {
      return 0;
    }

    // Level 1 (Direct): 5% of profit
    // Level 2 (Indirect): 1% of profit
    const profitPercentage = purchase.userLevel === 1 ? 0.05 : 0.01;
    return purchase.amount * profitPercentage;
  };

  const totalEarnings = purchases.reduce((sum, purchase) => {
    return sum + calculateEarnings(purchase);
  }, 0);

  const level1Earnings = purchases
    .filter(p => p.userLevel === 1)
    .reduce((sum, purchase) => sum + calculateEarnings(purchase), 0);

  const level2Earnings = purchases
    .filter(p => p.userLevel === 2)
    .reduce((sum, purchase) => sum + calculateEarnings(purchase), 0);

  const eligiblePurchases = purchases.filter(p => p.amount >= 1000);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Earnings Breakdown</h3>
      
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-medium text-green-600">Level 1 Earnings</h4>
          <p className="text-2xl font-bold">₹{level1Earnings.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">5% from direct referrals</p>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-medium text-blue-600">Level 2 Earnings</h4>
          <p className="text-2xl font-bold">₹{level2Earnings.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">1% from indirect referrals</p>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <h4 className="font-medium text-purple-600">Total Earnings</h4>
          <p className="text-2xl font-bold">₹{totalEarnings.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">From {eligiblePurchases.length} eligible purchases</p>
        </div>
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-medium mb-2">Calculation Rules:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Only purchases above ₹1,000 are eligible for earnings</li>
          <li>• Direct referrals (Level 1): 5% commission</li>
          <li>• Indirect referrals (Level 2): 1% commission</li>
          <li>• Maximum 8 direct referrals allowed per user</li>
        </ul>
      </div>
    </div>
  );
};
