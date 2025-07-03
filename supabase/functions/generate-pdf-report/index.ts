
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
    const url = new URL(req.url)
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')

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

    console.log(`Generating PDF report from ${from} to ${to}`)

    // Fetch overspeed reports within date range
    const { data: reports, error } = await supabase
      .from('overspeed_reports')
      .select('*')
      .gte('report_date', from)
      .lte('report_date', to)
      .order('server_time', { ascending: false })

    if (error) {
      console.error('Error fetching overspeed reports:', error)
      throw error
    }

    console.log(`Found ${reports?.length || 0} overspeed reports`)

    // Generate HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Rapport de Dépassement de Vitesse</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .date-range { text-align: center; color: #666; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .speed-exceeded { color: #d73027; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Rapport de Dépassement de Vitesse</h1>
            <div class="date-range">Période: ${from} au ${to}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Véhicule</th>
                <th>Conducteur</th>
                <th>Date</th>
                <th>Heure</th>
                <th>Vitesse (km/h)</th>
                <th>Limite (km/h)</th>
                <th>Localisation</th>
                <th>Durée (min)</th>
              </tr>
            </thead>
            <tbody>
              ${reports?.map(report => {
                const date = new Date(report.server_time)
                const dateStr = date.toLocaleDateString('fr-FR')
                const timeStr = date.toLocaleTimeString('fr-FR')
                
                return `
                  <tr>
                    <td>${report.id}</td>
                    <td>${report.vehicle_name}</td>
                    <td>${report.driver_name}</td>
                    <td>${dateStr}</td>
                    <td>${timeStr}</td>
                    <td class="speed-exceeded">${report.speed}</td>
                    <td>${report.speed_limit}</td>
                    <td>${report.address}</td>
                    <td>${report.duration_minutes}</td>
                  </tr>
                `
              }).join('') || '<tr><td colspan="9">Aucun dépassement de vitesse trouvé</td></tr>'}
            </tbody>
          </table>
          
          <div style="margin-top: 30px; text-align: center; color: #666;">
            <p>Rapport généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
            <p>Total des infractions: ${reports?.length || 0}</p>
          </div>
        </body>
      </html>
    `

    // For now, return the HTML content. In production, you'd use a PDF generation library
    // like Puppeteer or jsPDF, but those require additional setup in Deno Deploy
    return new Response(htmlContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="rapport-vitesse-${from}-${to}.html"`
      }
    })

  } catch (error) {
    console.error('Error in generate-pdf-report:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
