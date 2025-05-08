
// Follow this setup guide to integrate the Deno runtime into your project:
// https://deno.land/manual/getting_started/setup_your_environment
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Fetch locations from the API
    const apiUrl = 'https://api.pinme.io/api/groups?all=true&userId'
    console.log('Fetching locations from:', apiUrl)
    
    const response = await fetch(apiUrl)
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('Successfully fetched locations:', data.length)

    // Transform the data to clean up the names (remove "Parc_" prefix)
    const locations = data.map((location: any) => ({
      id: location.id,
      name: location.name.replace('Parc_', ''),
      originalName: location.name,
      groupId: location.groupId
    }))

    // Return the data
    return new Response(
      JSON.stringify({ locations }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Error fetching locations:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
