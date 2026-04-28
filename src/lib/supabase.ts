import { createClient } from "@supabase/supabase-js";

export type PortfolioRow = {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string | null;
  deliverable: string | null;
  focus: string | null;
  tone: string | null;
  tags: string[];
  layout: "wide" | "tall" | "panoramic";
  image_url: string | null;
  image_path: string | null;
  gallery_urls: string[];
  gallery_paths: string[];
  cta_label: string | null;
  detail_path: string | null;
  is_featured: boolean;
  is_home: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type PortfolioInsert = Omit<PortfolioRow, "id" | "created_at" | "updated_at"> & {
  id?: string;
};

export type PortfolioUpdate = Partial<PortfolioInsert>;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
