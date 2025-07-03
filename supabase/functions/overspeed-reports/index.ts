
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OverspeedRange {
  range: string
  vehicle_count: number
  percentage: number
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url)
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')
    const speedLimit = parseFloat(url.searchParams.get('speedLimit') || '80')

    if (!from || !to) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: from, to' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log(`Generating overspeed report from ${from} to ${to} with speed limit ${speedLimit}`)

    // Fetch positions within date range
    const { data: positions, error } = await supabase
      .from('positions')
      .select('*')
      .gte('server_time', from)
      .lte('server_time', to)
      .gt('speed', speedLimit)

    if (error) {
      console.error('Error fetching positions:', error)
      throw error
    }

    console.log(`Found ${positions?.length || 0} overspeed records`)

    // Group by speed ranges
    const ranges = [
      { min: 0, max: 5, label: '0-5 km/h au-dessus' },
      { min: 5, max: 10, label: '5-10 km/h au-dessus' },
      { min: 10, max: 20, label: '10-20 km/h au-dessus' },
      { min: 20, max: 30, label: '20-30 km/h au-dessus' },
      { min: 30, max: Infinity, label: '30+ km/h au-dessus' }
    ]

    const totalVehicles = new Set(positions?.map(p => p.device_id) || []).size
    const result: OverspeedRange[] = []

    for (const range of ranges) {
      const vehiclesInRange = new Set(
        positions?.filter(p => {
          const excess = p.speed - speedLimit
          return excess > range.min && excess <= range.max
        }).map(p => p.device_id) || []
      )

      const vehicleCount = vehiclesInRange.size
      const percentage = totalVehicles > 0 ? (vehicleCount / totalVehicles) * 100 : 0

      result.push({
        range: range.label,
        vehicle_count: vehicleCount,
        percentage: Math.round(percentage * 100) / 100
      })
    }

    // Save overspeed data for PDF generation
    const overspeedData = positions?.map(pos => ({
      device_id: pos.device_id,
      vehicle_name: `Vehicle ${pos.device_id}`,
      driver_name: `Driver ${pos.device_id}`,
      speed: pos.speed,
      speed_limit: speedLimit,
      latitude: pos.latitude,
      longitude: pos.longitude,
      address: pos.address || '',
      duration_minutes: 0, // TODO: Calculate actual duration
      report_date: new Date(pos.server_time).toISOString().split('T')[0],
      server_time: pos.server_time
    })) || []

    if (overspeedData.length > 0) {
      const { error: insertError } = await supabase
        .from('overspeed_reports')
        .upsert(overspeedData, { 
          onConflict: 'device_id,server_time',
          ignoreDuplicates: true 
        })

      if (insertError) {
        console.error('Error saving overspeed reports:', insertError)
      }
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in overspeed-reports:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
