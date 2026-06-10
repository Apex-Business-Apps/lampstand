-- Prayer Circles — collaborative prayer spaces for authenticated users.
-- Guests use localStorage fallback; this schema serves auth users only.

CREATE TABLE IF NOT EXISTS public.prayer_circles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_by_user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  visibility TEXT NOT NULL DEFAULT 'invite-only',
  max_members INTEGER NOT NULL DEFAULT 12
);

CREATE TABLE IF NOT EXISTS public.prayer_circle_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  circle_id UUID NOT NULL REFERENCES public.prayer_circles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (circle_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.prayer_intentions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  circle_id UUID NOT NULL REFERENCES public.prayer_circles(id) ON DELETE CASCADE,
  author_member_id UUID NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  answered_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.prayer_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_intentions ENABLE ROW LEVEL SECURITY;

-- prayer_circles: owners and members can view; only creator can insert
CREATE POLICY "Circle members can view their circles"
  ON public.prayer_circles FOR SELECT
  USING (
    auth.uid() = created_by_user_id
    OR EXISTS (
      SELECT 1 FROM public.prayer_circle_members pcm
      WHERE pcm.circle_id = prayer_circles.id
        AND pcm.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create circles"
  ON public.prayer_circles FOR INSERT
  WITH CHECK (auth.uid() = created_by_user_id);

CREATE POLICY "Circle owner can delete circle"
  ON public.prayer_circles FOR DELETE
  USING (auth.uid() = created_by_user_id);

-- prayer_circle_members: members can view memberships in their circles
CREATE POLICY "Members can view circle memberships"
  ON public.prayer_circle_members FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.prayer_circle_members pcm2
      WHERE pcm2.circle_id = prayer_circle_members.circle_id
        AND pcm2.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can join circles"
  ON public.prayer_circle_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members can leave circles"
  ON public.prayer_circle_members FOR DELETE
  USING (auth.uid() = user_id);

-- prayer_intentions: only circle members can read/write
CREATE POLICY "Circle members can view intentions"
  ON public.prayer_intentions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.prayer_circle_members pcm
      WHERE pcm.circle_id = prayer_intentions.circle_id
        AND pcm.user_id = auth.uid()
    )
  );

CREATE POLICY "Circle members can share intentions"
  ON public.prayer_intentions FOR INSERT
  WITH CHECK (
    auth.uid() = author_member_id
    AND EXISTS (
      SELECT 1 FROM public.prayer_circle_members pcm
      WHERE pcm.circle_id = prayer_intentions.circle_id
        AND pcm.user_id = auth.uid()
    )
  );

CREATE POLICY "Authors can delete their intentions"
  ON public.prayer_intentions FOR DELETE
  USING (auth.uid() = author_member_id);

CREATE INDEX IF NOT EXISTS idx_pcm_user ON public.prayer_circle_members (user_id);
CREATE INDEX IF NOT EXISTS idx_pcm_circle ON public.prayer_circle_members (circle_id);
CREATE INDEX IF NOT EXISTS idx_pi_circle ON public.prayer_intentions (circle_id, created_at DESC);
