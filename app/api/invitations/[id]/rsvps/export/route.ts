import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function csvCell(value: unknown): string {
  const s = String(value ?? '');
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const invitationId = params.id;

  // Verify ownership
  const { data: inv, error: invErr } = await supabase
    .from('invitations')
    .select('id, slug, owner_id')
    .eq('id', invitationId)
    .eq('owner_id', user.id)
    .single();

  if (invErr || !inv) {
    return NextResponse.json({ error: 'Invitation not found or access denied' }, { status: 403 });
  }

  const [{ data: guests }, { data: rsvps }] = await Promise.all([
    supabase
      .from('guests')
      .select('id, display_name, slug, max_party_size')
      .eq('invitation_id', invitationId)
      .order('created_at', { ascending: true }),
    supabase
      .from('rsvps')
      .select('id, guest_id, name, attending, party_size, events_attending, meal_preference, message, created_at, updated_at')
      .eq('invitation_id', invitationId)
      .order('created_at', { ascending: false }),
  ]);

  const rsvpByGuestId = new Map<string, any>();
  const openRsvps: any[] = [];
  for (const r of rsvps || []) {
    if (r.guest_id) {
      rsvpByGuestId.set(r.guest_id, r);
    } else {
      openRsvps.push(r);
    }
  }

  const headers = [
    'Guest Name',
    'Link Type',
    'Status',
    'Party Size',
    'Events',
    'Meal Preference',
    'Message',
    'Replied At',
  ];

  const rows: string[][] = [];

  for (const g of guests || []) {
    const r = rsvpByGuestId.get(g.id);
    if (r) {
      const eventsList = Array.isArray(r.events_attending) ? r.events_attending.join('; ') : '';
      rows.push([
        g.display_name,
        'Named Link',
        r.attending ? 'Attending' : 'Declined',
        String(r.attending ? r.party_size : 0),
        eventsList,
        r.meal_preference || '',
        r.message || '',
        r.updated_at || r.created_at || '',
      ]);
    } else {
      rows.push([
        g.display_name,
        'Named Link',
        'Pending',
        '0',
        '',
        '',
        '',
        '',
      ]);
    }
  }

  for (const r of openRsvps) {
    const eventsList = Array.isArray(r.events_attending) ? r.events_attending.join('; ') : '';
    rows.push([
      r.name,
      'Open Link',
      r.attending ? 'Attending' : 'Declined',
      String(r.attending ? r.party_size : 0),
      eventsList,
      r.meal_preference || '',
      r.message || '',
      r.updated_at || r.created_at || '',
    ]);
  }

  const csvContent =
    [headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n') + '\r\n';

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="rsvps-${inv.slug}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
