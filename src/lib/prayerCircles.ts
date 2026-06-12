/**
 * Prayer Circles - collaborative invite-only prayer spaces.
 *
 * Auth users: data persisted to Supabase (cross-device, sharable).
 * Guest users: localStorage fallback (device-local, still functional).
 *
 * The dual-mode pattern matches the rest of the LampStand storage layer.
 * The public API is identical in both modes so UI components are unaffected.
 */
import type { PrayerCircle, PrayerCircleMember, PrayerIntention } from '@/types';
import { supabase } from '@/integrations/supabase/client';

// ─── localStorage helpers (guest fallback) ────────────────────────────────

const KEYS = {
  circles: 'lampstand_prayer_circles',
  members: 'lampstand_prayer_members',
  intentions: 'lampstand_prayer_intentions',
} as const;

function lsGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function lsSet(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Auth helper ──────────────────────────────────────────────────────────

async function getAuthUserId(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────

export async function getMyCircles(
  userId: string,
): Promise<{ circle: PrayerCircle; member: PrayerCircleMember }[]> {
  const authId = await getAuthUserId();

  if (authId) {
    const { data, error } = await supabase
      .from('prayer_circle_members')
      .select('*, prayer_circles(*)')
      .eq('user_id', authId);

    if (error) throw error;
    if (!data) return [];

    return data
      .filter((row) => row.prayer_circles)
      .map((row) => ({
        circle: dbRowToCircle(row.prayer_circles),
        member: dbRowToMember(row, row.circle_id),
      }));
  }

  // Guest fallback
  const allMembers = lsGet<PrayerCircleMember[]>(KEYS.members, []);
  const allCircles = lsGet<PrayerCircle[]>(KEYS.circles, []);
  return allMembers
    .filter((m) => m.userId === userId)
    .map((member) => {
      const circle = allCircles.find((c) => c.id === member.circleId);
      if (!circle) return null;
      return { circle, member };
    })
    .filter(Boolean) as { circle: PrayerCircle; member: PrayerCircleMember }[];
}

export async function createCircle(
  userId: string,
  name: string,
  displayName: string,
): Promise<PrayerCircle> {
  const authId = await getAuthUserId();

  if (authId) {
    const { data: circleData, error: circleErr } = await supabase
      .from('prayer_circles')
      .insert({ name, created_by_user_id: authId })
      .select()
      .single();
    if (circleErr) throw circleErr;

    const { error: memberErr } = await supabase
      .from('prayer_circle_members')
      .insert({ circle_id: circleData.id, user_id: authId, display_name: displayName, role: 'owner' });
    if (memberErr) throw memberErr;

    return dbRowToCircle(circleData);
  }

  // Guest fallback
  const circle: PrayerCircle = {
    id: crypto.randomUUID(),
    name,
    createdByUserId: userId,
    createdAt: new Date().toISOString(),
    visibility: 'invite-only',
    maxMembers: 12,
  };
  const member: PrayerCircleMember = {
    circleId: circle.id,
    userId,
    displayName,
    role: 'owner',
    joinedAt: new Date().toISOString(),
  };
  lsSet(KEYS.circles, [...lsGet<PrayerCircle[]>(KEYS.circles, []), circle]);
  lsSet(KEYS.members, [...lsGet<PrayerCircleMember[]>(KEYS.members, []), member]);
  return circle;
}

export async function joinCircle(
  circleId: string,
  userId: string,
  displayName: string,
): Promise<PrayerCircle> {
  const authId = await getAuthUserId();

  if (authId) {
    const { error: joinErr } = await supabase
      .from('prayer_circle_members')
      .upsert(
        { circle_id: circleId, user_id: authId, display_name: displayName, role: 'member' },
        { onConflict: 'circle_id,user_id' },
      );
    if (joinErr) throw joinErr;

    const { data, error } = await supabase
      .from('prayer_circles')
      .select()
      .eq('id', circleId)
      .single();
    if (error) throw error;
    return dbRowToCircle(data);
  }

  // Guest fallback
  const allCircles = lsGet<PrayerCircle[]>(KEYS.circles, []);
  const circle = allCircles.find((c) => c.id === circleId);
  if (!circle) throw new Error('Circle not found');
  const allMembers = lsGet<PrayerCircleMember[]>(KEYS.members, []);
  if (!allMembers.find((m) => m.circleId === circleId && m.userId === userId)) {
    lsSet(KEYS.members, [
      ...allMembers,
      { circleId, userId, displayName, role: 'member', joinedAt: new Date().toISOString() },
    ]);
  }
  return circle;
}

export async function getCircleDetails(circleId: string): Promise<{
  circle: PrayerCircle;
  members: PrayerCircleMember[];
  intentions: PrayerIntention[];
}> {
  const authId = await getAuthUserId();

  if (authId) {
    const [circleRes, membersRes, intentionsRes] = await Promise.all([
      supabase.from('prayer_circles').select().eq('id', circleId).single(),
      supabase.from('prayer_circle_members').select().eq('circle_id', circleId),
      supabase
        .from('prayer_intentions')
        .select()
        .eq('circle_id', circleId)
        .order('created_at', { ascending: false }),
    ]);

    if (circleRes.error) throw circleRes.error;
    return {
      circle: dbRowToCircle(circleRes.data),
      members: (membersRes.data ?? []).map((r) => dbRowToMember(r, circleId)),
      intentions: (intentionsRes.data ?? []).map(dbRowToIntention),
    };
  }

  // Guest fallback
  const allCircles = lsGet<PrayerCircle[]>(KEYS.circles, []);
  const circle = allCircles.find((c) => c.id === circleId);
  if (!circle) throw new Error('Circle not found');
  const members = lsGet<PrayerCircleMember[]>(KEYS.members, []).filter(
    (m) => m.circleId === circleId,
  );
  const intentions = lsGet<PrayerIntention[]>(KEYS.intentions, [])
    .filter((i) => i.circleId === circleId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return { circle, members, intentions };
}

export async function shareIntention(
  circleId: string,
  authorMemberId: string,
  title: string,
  body?: string,
): Promise<PrayerIntention> {
  const authId = await getAuthUserId();

  if (authId) {
    const { data, error } = await supabase
      .from('prayer_intentions')
      .insert({ circle_id: circleId, author_member_id: authId, title, body: body ?? null })
      .select()
      .single();
    if (error) throw error;
    return dbRowToIntention(data);
  }

  // Guest fallback
  const intention: PrayerIntention = {
    id: crypto.randomUUID(),
    circleId,
    authorMemberId,
    title,
    body,
    createdAt: new Date().toISOString(),
  };
  lsSet(KEYS.intentions, [...lsGet<PrayerIntention[]>(KEYS.intentions, []), intention]);
  return intention;
}

// ─── DB row mappers ────────────────────────────────────────────────────────

function dbRowToCircle(row: Record<string, unknown>): PrayerCircle {
  return {
    id: row.id as string,
    name: row.name as string,
    createdByUserId: row.created_by_user_id as string,
    createdAt: row.created_at as string,
    visibility: 'invite-only',
    maxMembers: (row.max_members as number) ?? 12,
  };
}

function dbRowToMember(row: Record<string, unknown>, circleId: string): PrayerCircleMember {
  return {
    circleId: (row.circle_id as string) ?? circleId,
    userId: row.user_id as string,
    displayName: row.display_name as string,
    role: (row.role as 'owner' | 'member') ?? 'member',
    joinedAt: row.joined_at as string,
  };
}

function dbRowToIntention(row: Record<string, unknown>): PrayerIntention {
  return {
    id: row.id as string,
    circleId: row.circle_id as string,
    authorMemberId: row.author_member_id as string,
    title: row.title as string,
    body: (row.body as string | null) ?? undefined,
    createdAt: row.created_at as string,
    answeredAt: (row.answered_at as string | null) ?? undefined,
  };
}
