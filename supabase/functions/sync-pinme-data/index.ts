
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const pinmeUsername = Deno.env.get('PINME_USERNAME')
    const pinmePassword = Deno.env.get('PINME_PASSWORD')
    const pinmeApiUrl = Deno.env.get('PINME_API_URL') || 'https://api.pinme.io'

    if (!pinmeUsername || !pinmePassword) {
      throw new Error('PinMe.io credentials not configured')
    }

    // Create Basic Auth header
    const auth = btoa(`${pinmeUsername}:${pinmePassword}`)
    const headers = {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    }

    console.log('Fetching positions from PinMe.io...')

    // Fetch positions from PinMe.io
    const positionsResponse = await fetch(`${pinmeApiUrl}/api/positions`, {
      headers
    })

    if (!positionsResponse.ok) {
      throw new Error(`PinMe.io API error: ${positionsResponse.status}`)
    }

    const positions = await positionsResponse.json()
    console.log(`Fetched ${positions.length} positions`)

    // Transform and save positions to Supabase
    const transformedPositions = positions.map((pos: any) => ({
      device_id: pos.deviceId,
      latitude: pos.latitude,
      longitude: pos.longitude,
      speed: pos.attributes?.speed || 0,
      distance: pos.attributes?.distance || 0,
      address: pos.address || '',
      server_time: pos.serverTime
    }))

    const { error: insertError } = await supabase
      .from('positions')
      .insert(transformedPositions)

    if (insertError) {
      console.error('Error inserting positions:', insertError)
      throw insertError
    }

    console.log(`Successfully saved ${transformedPositions.length} positions`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Synchronized ${transformedPositions.length} positions` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in sync-pinme-data:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
