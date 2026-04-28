-- SQL Migration for Supabase

-- Extinguishers Table
CREATE TABLE IF NOT EXISTS public.extinguishers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    map_id TEXT,
    location TEXT NOT NULL,
    sub_location TEXT,
    type TEXT NOT NULL,
    capacity TEXT,
    status TEXT NOT NULL DEFAULT 'Seguro',
    last_recharge_date TEXT,
    expiry_date TEXT,
    inspections JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Responsibles Table
CREATE TABLE IF NOT EXISTS public.responsibles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Activities Table
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.extinguishers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responsibles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Simple Policies (Allow all authenticated users for now)
CREATE POLICY "Allow all for authenticated" ON public.extinguishers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated" ON public.responsibles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated" ON public.activities FOR ALL USING (auth.role() = 'authenticated');

/*
INSTRUÇÕES ADICIONAIS:
1. No painel do Supabase, vá em 'Storage' e crie um balde (bucket) chamado 'photos' e marque como PUBLIC.
2. Em 'Authentication' > 'URL Configuration', mude o 'Site URL' para a URL do seu app (Shared App URL).
*/
