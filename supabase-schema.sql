-- ==============================================================================
-- Cordova Water System Inc. (CWSI) - Supabase Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- 1. Water Rates Table
CREATE TABLE IF NOT EXISTS public.water_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  range_label TEXT NOT NULL,
  min_cum NUMERIC NOT NULL,
  max_cum NUMERIC,
  rate_php NUMERIC NOT NULL,
  is_minimum BOOLEAN DEFAULT FALSE,
  remarks TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Initial Water Rates
INSERT INTO public.water_rates (range_label, min_cum, max_cum, rate_php, is_minimum, remarks) VALUES
  ('0 – 5 cu. m', 0, 5, 220, true, 'Minimum charge'),
  ('6 – 10 cu. m', 6, 10, 48, false, 'Per cubic meter'),
  ('11 – 20 cu. m', 11, 20, 54, false, 'Per cubic meter'),
  ('21 – 30 cu. m', 21, 30, 65, false, 'Per cubic meter'),
  ('31+ cu. m', 31, NULL, 92, false, 'Per cubic meter')
ON CONFLICT DO NOTHING;

-- 2. Team Members Table (3 Core CWSI Officers)
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  badge TEXT NOT NULL,
  img TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed 3 Team Members
INSERT INTO public.team_members (name, role, badge, img, display_order) VALUES
  ('Angelo Dalapo', 'Officer-in-Charge', 'OIC', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop&auto=format', 1),
  ('Joann F. Adoldo', 'Billing Officer', 'BILLING OFFICER', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=600&fit=crop&auto=format', 2),
  ('ARIEL JANE L. FERRER', 'Admin & Accounting', 'ADMIN & ACCOUNTING', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&h=600&fit=crop&auto=format', 3)
ON CONFLICT DO NOTHING;

-- 3. Photo Gallery Table
CREATE TABLE IF NOT EXISTS public.gallery_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  src TEXT NOT NULL,
  alt TEXT NOT NULL,
  caption TEXT NOT NULL,
  tag TEXT DEFAULT 'Facilities',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. News & Announcements Table
CREATE TABLE IF NOT EXISTS public.news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  img TEXT NOT NULL,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Applications & Inquiries Table
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  inquiry_type TEXT NOT NULL DEFAULT 'Inquiry',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Review', 'Contacted', 'Resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.water_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public can view water rates" ON public.water_rates FOR SELECT USING (true);
CREATE POLICY "Public can view team members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Public can view gallery" ON public.gallery_photos FOR SELECT USING (true);
CREATE POLICY "Public can view published news" ON public.news FOR SELECT USING (is_published = true);
CREATE POLICY "Public can insert inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);

-- Authenticated Admin Policies (Full Access)
CREATE POLICY "Admins full access water rates" ON public.water_rates FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access team" ON public.team_members FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access gallery" ON public.gallery_photos FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access news" ON public.news FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access inquiries" ON public.inquiries FOR ALL TO authenticated USING (true);

-- 6. Storage Bucket for uploaded images (Optional in Supabase Dashboard -> Storage)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cwsi-media', 'cwsi-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view cwsi-media" ON storage.objects FOR SELECT USING (bucket_id = 'cwsi-media');
CREATE POLICY "Admins can upload to cwsi-media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cwsi-media');
