-- ============================================================
-- MIGRATION: prayer_circles integrity fix
-- Fixes: F-008 (missing FK constraints), F-009 (missing UPDATE
-- policies), and the semantic RLS mismatch on prayer_intentions
-- where author_member_id (a member UUID) was compared directly
-- to auth.uid() (a user UUID) — they are different UUID spaces.
-- ============================================================

-- 1. FK: prayer_circles.created_by_user_id → auth.users(id)
ALTER TABLE public.prayer_circles
  ADD CONSTRAINT fk_prayer_circles_creator
  FOREIGN KEY (created_by_user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

-- 2. FK: prayer_circle_members.user_id → auth.users(id)
ALTER TABLE public.prayer_circle_members
  ADD CONSTRAINT fk_prayer_circle_members_user
  FOREIGN KEY (user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

-- 3. FK: prayer_intentions.author_member_id → prayer_circle_members(id)
--    (intentionally NOT auth.users — author_member_id is a member row UUID)
ALTER TABLE public.prayer_intentions
  ADD CONSTRAINT fk_prayer_intentions_author_member
  FOREIGN KEY (author_member_id)
  REFERENCES public.prayer_circle_members(id)
  ON DELETE CASCADE;

-- 4. Fix RLS INSERT policy on prayer_intentions:
--    Old: auth.uid() = author_member_id  ← WRONG (different UUID spaces)
--    New: verify the member row belongs to the calling user AND is the author
DROP POLICY IF EXISTS "Circle members can share intentions" ON public.prayer_intentions;
CREATE POLICY "Circle members can share intentions"
  ON public.prayer_intentions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.prayer_circle_members pcm
      WHERE pcm.circle_id = prayer_intentions.circle_id
        AND pcm.user_id   = auth.uid()
        AND pcm.id        = prayer_intentions.author_member_id
    )
  );

-- 5. Fix RLS DELETE policy on prayer_intentions (same mismatch)
DROP POLICY IF EXISTS "Authors can delete their intentions" ON public.prayer_intentions;
CREATE POLICY "Authors can delete their intentions"
  ON public.prayer_intentions FOR DELETE
  USING (
    author_member_id IN (
      SELECT id FROM public.prayer_circle_members
      WHERE user_id = auth.uid()
    )
  );

-- 6. Add missing UPDATE policy on prayer_circles (creators can rename/edit)
CREATE POLICY "Circle creator can update circle"
  ON public.prayer_circles FOR UPDATE
  USING (created_by_user_id = auth.uid())
  WITH CHECK (created_by_user_id = auth.uid());

-- 7. Add missing UPDATE policy on prayer_intentions (authors can edit their own)
CREATE POLICY "Authors can update their intentions"
  ON public.prayer_intentions FOR UPDATE
  USING (
    author_member_id IN (
      SELECT id FROM public.prayer_circle_members
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    author_member_id IN (
      SELECT id FROM public.prayer_circle_members
      WHERE user_id = auth.uid()
    )
  );
