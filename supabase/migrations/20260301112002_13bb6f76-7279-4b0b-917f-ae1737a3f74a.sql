
-- Create channels table
CREATE TABLE public.channels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Local',
  type TEXT NOT NULL DEFAULT 'mpd',
  url TEXT NOT NULL,
  clear_key JSONB,
  subscribers TEXT DEFAULT '0',
  views TEXT DEFAULT '0 watching',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public read access (no auth required per user choice)
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;

-- Anyone can read channels
CREATE POLICY "Anyone can read channels"
ON public.channels
FOR SELECT
USING (true);

-- Anyone can insert channels (open access admin per user choice)
CREATE POLICY "Anyone can insert channels"
ON public.channels
FOR INSERT
WITH CHECK (true);

-- Anyone can update channels
CREATE POLICY "Anyone can update channels"
ON public.channels
FOR UPDATE
USING (true);

-- Anyone can delete channels
CREATE POLICY "Anyone can delete channels"
ON public.channels
FOR DELETE
USING (true);
