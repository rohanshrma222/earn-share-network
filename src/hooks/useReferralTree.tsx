
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ReferralUser {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  parentId?: string;
  earnings: number;
  isActive: boolean;
  level: number;
}

export const useReferralTree = () => {
  const { user } = useAuth();
  const [directReferrals, setDirectReferrals] = useState<ReferralUser[]>([]);
  const [indirectReferrals, setIndirectReferrals] = useState<ReferralUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReferralTree = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch direct referrals (Level 1)
        const { data: directData, error: directError } = await supabase
          .from('referrals')
          .select(`
            *,
            referred:profiles!referrals_referred_id_fkey(*)
          `)
          .eq('referrer_id', user.id)
          .eq('level', 1);

        if (directError) throw directError;

        // Fetch indirect referrals (Level 2)
        const { data: indirectData, error: indirectError } = await supabase
          .from('referrals')
          .select(`
            *,
            referred:profiles!referrals_referred_id_fkey(*)
          `)
          .eq('referrer_id', user.id)
          .eq('level', 2);

        if (indirectError) throw indirectError;

        // Transform direct referrals
        const transformedDirect = directData?.map(referral => ({
          id: referral.referred_id || '',
          name: referral.referred?.full_name || referral.referred?.username || 'Unknown User',
          email: referral.referred?.username || 'No email available',
          joinDate: new Date(referral.created_at).toLocaleDateString(),
          earnings: referral.earnings || 0,
          isActive: referral.status === 'active',
          level: 1
        })) || [];

        // Transform indirect referrals
        const transformedIndirect = indirectData?.map(referral => ({
          id: referral.referred_id || '',
          name: referral.referred?.full_name || referral.referred?.username || 'Unknown User',
          email: referral.referred?.username || 'No email available',
          joinDate: new Date(referral.created_at).toLocaleDateString(),
          earnings: referral.earnings || 0,
          isActive: referral.status === 'active',
          level: 2
        })) || [];

        setDirectReferrals(transformedDirect);
        setIndirectReferrals(transformedIndirect);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch referral tree');
        console.error('Error fetching referral tree:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralTree();
  }, [user]);

  return { directReferrals, indirectReferrals, loading, error };
};
