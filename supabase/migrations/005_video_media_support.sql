-- supabase/migrations/005_video_media_support.sql

ALTER TABLE media_assets 
ADD COLUMN IF NOT EXISTS mime_type text,
ADD COLUMN IF NOT EXISTS size_bytes bigint,
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb NOT NULL;

ALTER TABLE public.media_assets 
ALTER COLUMN storage_provider SET DEFAULT 'supabase';
