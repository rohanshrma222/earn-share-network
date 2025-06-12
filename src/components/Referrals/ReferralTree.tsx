
import React from 'react';
import { User, DollarSign, Calendar, CheckCircle, XCircle } from 'lucide-react';

interface Referral {
  id: number;
  name: string;
  email: string;
  joinDate?: string;
  parentId?: number;
  earnings: number;
  isActive: boolean;
}

interface ReferralTreeProps {
  directReferrals: Referral[];
  indirectReferrals: Referral[];
}

export const ReferralTree = ({ directReferrals, indirectReferrals }: ReferralTreeProps) => {
  const getIndirectReferralsForParent = (parentId: number) => {
    return indirectReferrals.filter(referral => referral.parentId === parentId);
  };

  const calculateEarnings = (referral: Referral, isLevel1: boolean) => {
    const percentage = isLevel1 ? 5 : 1;
    return (referral.earnings * percentage) / 100;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Referral Hierarchy</h3>
      
      <div className="space-y-4">
        {directReferrals.map((directReferral) => {
          const childReferrals = getIndirectReferralsForParent(directReferral.id);
          const directEarnings = calculateEarnings(directReferral, true);
          const indirectEarnings = childReferrals.reduce((sum, child) => 
            sum + calculateEarnings(child, false), 0
          );

          return (
            <div key={directReferral.id} className="border rounded-lg p-4 bg-card">
              {/* Level 1 - Direct Referral */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Level 1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{directReferral.name}</h4>
                    <p className="text-sm text-muted-foreground">{directReferral.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {directReferral.joinDate}
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-green-600">
                      <DollarSign className="h-4 w-4" />
                      ₹{directEarnings.toFixed(2)} (5%)
                    </div>
                  </div>
                  <div className="flex items-center">
                    {directReferral.isActive ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Level 2 - Indirect Referrals */}
              {childReferrals.length > 0 && (
                <div className="ml-8 space-y-2">
                  <h5 className="text-sm font-medium text-muted-foreground">Level 2 Referrals</h5>
                  {childReferrals.map((childReferral) => {
                    const childEarnings = calculateEarnings(childReferral, false);
                    return (
                      <div key={childReferral.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">Level 2</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{childReferral.name}</h4>
                            <p className="text-xs text-muted-foreground">{childReferral.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 font-semibold text-green-600 text-sm">
                            <DollarSign className="h-3 w-3" />
                            ₹{childEarnings.toFixed(2)} (1%)
                          </div>
                          <div className="flex items-center">
                            {childReferral.isActive ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Total Earnings Summary */}
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Earnings from this branch:</span>
                  <span className="font-bold text-green-600">
                    ₹{(directEarnings + indirectEarnings).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {directReferrals.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No referrals yet. Start inviting people to build your network!</p>
        </div>
      )}
    </div>
  );
};
