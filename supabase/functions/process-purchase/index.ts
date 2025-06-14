
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

    // Send WebSocket notifications to referrers
    for (const referral of referrals || []) {
      const earningAmount = amount * (referral.level === 1 ? 0.05 : 0.01)
      
      try {
        // Use the websocket-handler edge function to send notifications
        const websocketUrl = `${supabaseUrl}/functions/v1/websocket-handler`;
        console.log('Sending notification to:', referral.referrer_id, 'via:', websocketUrl)
        
        // Send purchase completed notification
        const purchaseResponse = await fetch(websocketUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            type: 'purchase_completed',
            userId: referral.referrer_id,
            data: {
              referralName: userName,
              amount: amount,
              earning: earningAmount,
              level: referral.level,
              timestamp: new Date().toISOString()
            }
          })
        })

        if (purchaseResponse.ok) {
          console.log('Purchase notification sent successfully to:', referral.referrer_id)
        } else {
          console.error('Failed to send purchase notification:', await purchaseResponse.text())
        }

        // Send earning update notification
        const earningResponse = await fetch(websocketUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            type: 'earning_update',
            userId: referral.referrer_id,
            data: {
              amount: earningAmount,
              source: `Purchase by ${userName}`,
              timestamp: new Date().toISOString()
            }
          })
        })

        if (earningResponse.ok) {
          console.log('Earning notification sent successfully to:', referral.referrer_id)
        } else {
          console.error('Failed to send earning notification:', await earningResponse.text())
        }

      } catch (error) {
        console.error('Error sending WebSocket notification to:', referral.referrer_id, error)
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
