-- 1. Habilitar suporte a UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tabela de Extintores
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

-- 3. Tabela de Responsáveis
CREATE TABLE IF NOT EXISTS public.responsibles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela de Atividades
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Habilitar Segurança (RLS)
ALTER TABLE public.extinguishers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responsibles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- 6. Políticas de Acesso Total
DROP POLICY IF EXISTS "Acesso Total Extintores" ON public.extinguishers;
CREATE POLICY "Acesso Total Extintores" ON public.extinguishers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acesso Total Responsaveis" ON public.responsibles;
CREATE POLICY "Acesso Total Responsaveis" ON public.responsibles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acesso Total Atividades" ON public.activities;
CREATE POLICY "Acesso Total Atividades" ON public.activities FOR ALL USING (true) WITH CHECK (true);

-- 7. Forçar recarregamento do cache (IMPORTANTE)
NOTIFY pgrst, 'reload schema';
