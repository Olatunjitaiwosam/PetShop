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
    // Check if current user is admin
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('admins')
        .select('id')
        .eq('user_id', user.id)
        .single()

      return new Response(JSON.stringify({ isAdmin: !!data && !error }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // POST — promote user to admin (must already be admin)
    if (req.method === 'POST') {
      const { user_id } = await req.json()

      const { data: callerAdmin } = await supabase
        .from('admins')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!callerAdmin) throw new Error('Forbidden: only admins can promote others')

      const { data, error } = await supabase
        .from('admins')
        .insert({ user_id })
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