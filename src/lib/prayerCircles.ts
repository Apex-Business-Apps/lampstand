import type { PrayerCircle, PrayerCircleMember, PrayerIntention } from '@/types';

// TODO: Wire these stubs to Supabase or another backend in a future iteration.
// For now, they provide a client-side API simulation using localStorage to allow UI development.

const KEYS = {
  circles: 'lampstand_prayer_circles',
  members: 'lampstand_prayer_members',
  intentions: 'lampstand_prayer_intentions',
} as const;

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function set(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export async function getMyCircles(userId: string): Promise<{ circle: PrayerCircle, member: PrayerCircleMember }[]> {
  const allMembers = get<PrayerCircleMember[]>(KEYS.members, []);
  const myMemberships = allMembers.filter(m => m.userId === userId);

  const allCircles = get<PrayerCircle[]>(KEYS.circles, []);

  return myMemberships.map(member => {
    const circle = allCircles.find(c => c.id === member.circleId);
    if (!circle) return null;
    return { circle, member };
  }).filter(Boolean) as { circle: PrayerCircle, member: PrayerCircleMember }[];
}

export async function createCircle(userId: string, name: string, displayName: string): Promise<PrayerCircle> {
  const circle: PrayerCircle = {
    id: generateId(),
    name,
    createdByUserId: userId,
    createdAt: new Date().toISOString(),
    visibility: 'invite-only',
    maxMembers: 12
  };

  const member: PrayerCircleMember = {
    circleId: circle.id,
    userId,
    displayName,
    role: 'owner',
    joinedAt: new Date().toISOString()
  };

  set(KEYS.circles, [...get<PrayerCircle[]>(KEYS.circles, []), circle]);
  set(KEYS.members, [...get<PrayerCircleMember[]>(KEYS.members, []), member]);

  return circle;
}

export async function joinCircle(circleId: string, userId: string, displayName: string): Promise<PrayerCircle> {
  const allCircles = get<PrayerCircle[]>(KEYS.circles, []);
  const circle = allCircles.find(c => c.id === circleId);

  if (!circle) throw new Error("Circle not found");

  const allMembers = get<PrayerCircleMember[]>(KEYS.members, []);
  if (!allMembers.find(m => m.circleId === circleId && m.userId === userId)) {
    const member: PrayerCircleMember = {
      circleId,
      userId,
      displayName,
      role: 'member',
      joinedAt: new Date().toISOString()
    };
    set(KEYS.members, [...allMembers, member]);
  }

  return circle;
}

export async function getCircleDetails(circleId: string): Promise<{ circle: PrayerCircle, members: PrayerCircleMember[], intentions: PrayerIntention[] }> {
  const allCircles = get<PrayerCircle[]>(KEYS.circles, []);
  const circle = allCircles.find(c => c.id === circleId);
  if (!circle) throw new Error("Circle not found");

  const members = get<PrayerCircleMember[]>(KEYS.members, []).filter(m => m.circleId === circleId);
  const intentions = get<PrayerIntention[]>(KEYS.intentions, []).filter(i => i.circleId === circleId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return { circle, members, intentions };
}

export async function shareIntention(circleId: string, authorMemberId: string, title: string, body?: string): Promise<PrayerIntention> {
  const intention: PrayerIntention = {
    id: generateId(),
    circleId,
    authorMemberId,
    title,
    body,
    createdAt: new Date().toISOString()
  };

  set(KEYS.intentions, [...get<PrayerIntention[]>(KEYS.intentions, []), intention]);

  return intention;
}
