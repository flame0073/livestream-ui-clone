
-- Add unique constraint on channel name
ALTER TABLE public.channels ADD CONSTRAINT channels_name_unique UNIQUE (name);

-- Create watch history table (stored in localStorage, no table needed)
