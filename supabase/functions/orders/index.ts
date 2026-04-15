import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  try {
    // GET user orders
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('orders')
        .select('*, products(title, image, category)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // POST create order (after tx confirmed)
    if (req.method === 'POST') {
      const body = await req.json()
      const { product_id, wallet_address, amount_sol, tx_signature, product_title } = body

      if (!tx_signature) throw new Error('Transaction signature required')

      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          wallet_address,
          product_id,
          product_title,
          amount_sol,
          tx_signature,
          status: 'confirmed'
        })
        .select()
        .single()

      if (error) throw error
      return new Response(JSON.stringify(data), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})