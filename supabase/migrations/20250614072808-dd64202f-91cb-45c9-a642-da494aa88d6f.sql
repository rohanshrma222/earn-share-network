
-- Update the handle_new_user function to process referral codes
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  referrer_profile_id UUID;
  referrer_referrer_id UUID;
BEGIN
  -- Check if a referral code was provided
  IF new.raw_user_meta_data->>'referral_code' IS NOT NULL AND new.raw_user_meta_data->>'referral_code' != '' THEN
    -- Find the referrer by their referral code
    SELECT id INTO referrer_profile_id
    FROM public.profiles
    WHERE referral_code = new.raw_user_meta_data->>'referral_code';
    
    -- If referrer found, set up the referral relationship
    IF referrer_profile_id IS NOT NULL THEN
      -- Insert the new profile with referrer relationship
      INSERT INTO public.profiles (id, full_name, username, referral_code, referred_by)
      VALUES (
        new.id,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'username',
        'REF-' || UPPER(SUBSTRING(new.id::text FROM 1 FOR 8)),
        referrer_profile_id
      );
      
      -- Create Level 1 referral relationship
      INSERT INTO public.referrals (referrer_id, referred_id, status, level, earnings)
      VALUES (referrer_profile_id, new.id, 'active', 1, 0.00);
      
      -- Check if the referrer also has a referrer (for Level 2)
      SELECT referred_by INTO referrer_referrer_id
      FROM public.profiles
      WHERE id = referrer_profile_id;
      
      -- If referrer has a referrer, create Level 2 relationship
      IF referrer_referrer_id IS NOT NULL THEN
        INSERT INTO public.referrals (referrer_id, referred_id, status, level, earnings)
        VALUES (referrer_referrer_id, new.id, 'active', 2, 0.00);
      END IF;
    ELSE
      -- Invalid referral code, create profile without referrer
      INSERT INTO public.profiles (id, full_name, username, referral_code)
      VALUES (
        new.id,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'username',
        'REF-' || UPPER(SUBSTRING(new.id::text FROM 1 FOR 8))
      );
    END IF;
  ELSE
    -- No referral code provided, create normal profile
    INSERT INTO public.profiles (id, full_name, username, referral_code)
    VALUES (
      new.id,
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'username',
      'REF-' || UPPER(SUBSTRING(new.id::text FROM 1 FOR 8))
    );
  END IF;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to award earnings when purchases are made
CREATE OR REPLACE FUNCTION public.award_referral_earnings(user_id UUID, purchase_amount DECIMAL)
RETURNS void AS $$
DECLARE
  level1_referrer UUID;
  level2_referrer UUID;
  level1_earnings DECIMAL;
  level2_earnings DECIMAL;
BEGIN
  -- Calculate earnings (5% for Level 1, 1% for Level 2)
  level1_earnings := purchase_amount * 0.05;
  level2_earnings := purchase_amount * 0.01;
  
  -- Find Level 1 referrer (direct referrer)
  SELECT referrer_id INTO level1_referrer
  FROM public.referrals
  WHERE referred_id = user_id AND level = 1 AND status = 'active';
  
  -- Award Level 1 earnings
  IF level1_referrer IS NOT NULL THEN
    UPDATE public.referrals
    SET earnings = earnings + level1_earnings
    WHERE referrer_id = level1_referrer AND referred_id = user_id AND level = 1;
  END IF;
  
  -- Find Level 2 referrer (referrer's referrer)
  SELECT referrer_id INTO level2_referrer
  FROM public.referrals
  WHERE referred_id = user_id AND level = 2 AND status = 'active';
  
  -- Award Level 2 earnings
  IF level2_referrer IS NOT NULL THEN
    UPDATE public.referrals
    SET earnings = earnings + level2_earnings
    WHERE referrer_id = level2_referrer AND referred_id = user_id AND level = 2;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user's referral statistics
CREATE OR REPLACE FUNCTION public.get_user_referral_stats(user_id UUID)
RETURNS TABLE (
  direct_referrals_count INTEGER,
  indirect_referrals_count INTEGER,
  total_earnings DECIMAL,
  monthly_earnings DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE((SELECT COUNT(*)::INTEGER FROM public.referrals WHERE referrer_id = user_id AND level = 1), 0) as direct_referrals_count,
    COALESCE((SELECT COUNT(*)::INTEGER FROM public.referrals WHERE referrer_id = user_id AND level = 2), 0) as indirect_referrals_count,
    COALESCE((SELECT SUM(earnings) FROM public.referrals WHERE referrer_id = user_id), 0.00) as total_earnings,
    COALESCE((SELECT SUM(earnings) FROM public.referrals WHERE referrer_id = user_id AND created_at >= DATE_TRUNC('month', CURRENT_DATE)), 0.00) as monthly_earnings;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
