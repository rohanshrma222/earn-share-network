
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { userId, amount, productName } = await req.json()

    if (!userId || !amount) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: userId, amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('Processing purchase for user:', userId, 'amount:', amount)

    // Get user profile for notification
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, username')
      .eq('id', userId)
      .single()

    const userName = profile?.full_name || profile?.username || 'Unknown User'
    console.log('User name:', userName)

    // Award referral earnings
    const { error: earningsError } = await supabase.rpc('award_referral_earnings', {
      user_id: userId,
      purchase_amount: amount
    })

    if (earningsError) {
      console.error('Error awarding earnings:', earningsError)
      return new Response(
        JSON.stringify({ error: 'Failed to award earnings' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Earnings awarded successfully')

    // Get referrals to notify
    const { data: referrals } = await supabase
      .from('referrals')
      .select('referrer_id, level, earnings')
      .eq('referred_id', userId)

    console.log('Found referrals to notify:', referrals?.length || 0)

    // Send real-time notifications to referrers using Supabase channels
    for (const referral of referrals || []) {
      const earningAmount = amount * (referral.level === 1 ? 0.05 : 0.01)
      
      try {
        const channelName = `user-${referral.referrer_id}-notifications`
        console.log('Sending notification to channel:', channelName)
        
        // Send purchase completed notification
        const purchaseNotification = await supabase.channel(channelName).send({
          type: 'broadcast',
          event: 'purchase_completed',
          payload: {
            referralName: userName,
            amount: amount,
            earning: earningAmount,
            level: referral.level,
            timestamp: new Date().toISOString()
          }
        })

        console.log('Purchase notification result:', purchaseNotification)

        // Send earning update notification
        const earningNotification = await supabase.channel(channelName).send({
          type: 'broadcast',
          event: 'earning_update',
          payload: {
            amount: earningAmount,
            source: `Purchase by ${userName}`,
            timestamp: new Date().toISOString()
          }
        })

        console.log('Earning notification result:', earningNotification)

      } catch (error) {
        console.error('Error sending real-time notification to:', referral.referrer_id, error)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Purchase processed and earnings awarded',
        purchaseDetails: {
          userId,
          amount,
          productName: productName || 'Unknown Product',
          userName
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing purchase:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
