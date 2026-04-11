
CREATE TABLE public.daily_light_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  passage_ref text NOT NULL,
  theme text,
  shown_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, shown_date)
);

ALTER TABLE public.daily_light_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own daily light history"
  ON public.daily_light_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily light history"
  ON public.daily_light_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_daily_light_history_user_date
  ON public.daily_light_history (user_id, shown_date DESC);
