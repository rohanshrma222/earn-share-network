
-- Add Row Level Security policies for the referrals table
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view referrals where they are the referrer
CREATE POLICY "Users can view their referrals as referrer"
ON public.referrals
FOR SELECT
USING (auth.uid() = referrer_id);

-- Policy: Users can view referrals where they are the referred user
CREATE POLICY "Users can view referrals where they are referred"
ON public.referrals
FOR SELECT
USING (auth.uid() = referred_id);

-- Policy: System can insert referrals (for the trigger function)
CREATE POLICY "System can insert referrals"
ON public.referrals
FOR INSERT
WITH CHECK (true);

-- Policy: System can update referrals (for earnings updates)
CREATE POLICY "System can update referrals"
ON public.referrals
FOR UPDATE
USING (true);

-- Add RLS policies for profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all profiles (needed for referral tree)
CREATE POLICY "Users can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Policy: System can insert profiles (for the trigger function)
CREATE POLICY "System can insert profiles"
ON public.profiles
FOR INSERT
WITH CHECK (true);
