-- CRM & Appointment Booking Table Schema for Robert Rich Garcia Portfolio

CREATE TABLE IF NOT EXISTS public.consultation_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  service_type TEXT NOT NULL,
  bottleneck TEXT,
  current_tools TEXT,
  preferred_date DATE,
  preferred_time_slot TEXT,
  meeting_platform TEXT DEFAULT 'Google Meet',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.consultation_bookings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts from portfolio website
CREATE POLICY "Allow public booking submissions"
ON public.consultation_bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow authenticated users / service role to read and manage
CREATE POLICY "Allow service role full access"
ON public.consultation_bookings
FOR ALL
TO service_role
USING (true);

-- Indices for rapid querying
CREATE INDEX IF NOT EXISTS idx_consultation_bookings_created_at ON public.consultation_bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultation_bookings_email ON public.consultation_bookings(email);
CREATE INDEX IF NOT EXISTS idx_consultation_bookings_status ON public.consultation_bookings(status);
