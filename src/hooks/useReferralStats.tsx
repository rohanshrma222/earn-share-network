
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ReferralStats {
  direct_referrals_count: number;
  indirect_referrals_count: number;
  total_earnings: number;
  monthly_earnings: number;
}

export const useReferralStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ReferralStats>({
    direct_referrals_count: 0,
    indirect_referrals_count: 0,
    total_earnings: 0,
    monthly_earnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('get_user_referral_stats', {
          user_id: user.id
        });

        if (error) throw error;

        if (data && data.length > 0) {
          setStats(data[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch referral stats');
        console.error('Error fetching referral stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return { stats, loading, error };
};
