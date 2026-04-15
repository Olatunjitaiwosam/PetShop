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

  const url = new URL(req.url)
  const id = url.searchParams.get('id')

  try {
    // GET all products
    if (req.method === 'GET' && !id) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // GET single product
    if (req.method === 'GET' && id) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // POST create product (admin only)
    if (req.method === 'POST') {
      const authHeader = req.headers.get('Authorization')!
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
      
      if (!user) throw new Error('Unauthorized')

      const isAdmin = await supabase
        .from('admins')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (isAdmin.error) throw new Error('Forbidden: admins only')

      const body = await req.json()
      const { data, error } = await supabase
        .from('products')
        .insert({ ...body, created_by: user.id })
        .select()
        .single()

      if (error) throw error
      return new Response(JSON.stringify(data), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // PUT update product (admin only)
    if (req.method === 'PUT' && id) {
      const authHeader = req.headers.get('Authorization')!
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
      if (!user) throw new Error('Unauthorized')

      const body = await req.json()
      const { data, error } = await supabase
        .from('products')
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // DELETE product (admin only)
    if (req.method === 'DELETE' && id) {
      const authHeader = req.headers.get('Authorization')!
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
      if (!user) throw new Error('Unauthorized')

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      return new Response(JSON.stringify({ message: 'Product deleted' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: err.message.includes('Unauthorized') ? 401 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})