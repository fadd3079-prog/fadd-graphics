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
  portfolio_images?: PortfolioImageRow[];
};

export type PortfolioInsert = Omit<PortfolioRow, "id" | "created_at" | "updated_at" | "portfolio_images"> & {
  id?: string;
};

export type PortfolioUpdate = Partial<PortfolioInsert>;

export type MediaAssetRow = {
  id: string;
  bucket: string;
  path: string;
  url: string;
  label: string;
  alt_text: string;
  section: string;
  usage_type: string;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type SiteAssetRow = {
  id: string;
  asset_key: string;
  media_asset_id: string | null;
  url: string;
  path: string;
  label: string;
  alt_text: string;
  section: string;
  usage_type: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type SiteSettingRow = {
  id: string;
  setting_key: string;
  setting_value: unknown;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type PortfolioImageRow = {
  id: string;
  portfolio_item_id: string;
  media_asset_id: string | null;
  image_role: "main" | "gallery";
  image_url: string;
  image_path: string;
  alt_text: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

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
