import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'JLPT-'
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export async function POST(_req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('points')
    .eq('id', user.id)
    .single()

  const current = profile?.points ?? 0
  if (current < 10000) {
    return NextResponse.json({ error: '포인트가 부족합니다' }, { status: 400 })
  }

  const code = generateCode()

  const { error: voucherError } = await supabase
    .from('vouchers')
    .insert({ user_id: user.id, amount: 10000, code })

  if (voucherError) {
    return NextResponse.json({ error: voucherError.message }, { status: 500 })
  }

  const newPoints = current - 10000
  await supabase
    .from('profiles')
    .update({ points: newPoints })
    .eq('id', user.id)

  return NextResponse.json({ code, newPoints })
}
