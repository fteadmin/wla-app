-- Create contests table
CREATE TABLE IF NOT EXISTS public.contests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  prize TEXT NOT NULL,
  end_date DATE NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contest_participants table
CREATE TABLE IF NOT EXISTS public.contest_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contest_id UUID REFERENCES public.contests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(contest_id, user_id)
);

-- Create marketplace_items table
CREATE TABLE IF NOT EXISTS public.marketplace_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contests (everyone can read, only admins can create/update/delete)
CREATE POLICY "Anyone can view contests"
  ON public.contests FOR SELECT
  USING (true);

CREATE POLICY "Admins can create contests"
  ON public.contests FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update contests"
  ON public.contests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete contests"
  ON public.contests FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for contest_participants (anyone authenticated can join, view their own)
CREATE POLICY "Anyone can view contest participants"
  ON public.contest_participants FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can join contests"
  ON public.contest_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for marketplace_items (everyone can read, only admins can create/update/delete)
CREATE POLICY "Anyone can view marketplace items"
  ON public.marketplace_items FOR SELECT
  USING (true);

CREATE POLICY "Admins can create marketplace items"
  ON public.marketplace_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update marketplace items"
  ON public.marketplace_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete marketplace items"
  ON public.marketplace_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_contests_created_at ON public.contests(created_at DESC);
CREATE INDEX idx_contests_end_date ON public.contests(end_date);
CREATE INDEX idx_contest_participants_contest_id ON public.contest_participants(contest_id);
CREATE INDEX idx_contest_participants_user_id ON public.contest_participants(user_id);
CREATE INDEX idx_marketplace_items_created_at ON public.marketplace_items(created_at DESC);
CREATE INDEX idx_marketplace_items_category ON public.marketplace_items(category);
CREATE INDEX idx_marketplace_items_status ON public.marketplace_items(status);

-- Add function to update participant counts
CREATE OR REPLACE FUNCTION update_contest_participants()
RETURNS TRIGGER AS $$
BEGIN
  -- This is a placeholder for future functionality to update participant counts
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contests_updated_at
  BEFORE UPDATE ON public.contests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketplace_items_updated_at
  BEFORE UPDATE ON public.marketplace_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
