
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useReferralCode = () => {
  const { profile } = useAuth();
  const [referralCode, setReferralCode] = useState<string>('');

  useEffect(() => {
    if (profile?.referral_code) {
      setReferralCode(profile.referral_code);
    }
  }, [profile]);

  return { referralCode };
};
