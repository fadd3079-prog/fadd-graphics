import {
  supabase,
  type MediaAssetRow,
  type PortfolioImageRow,
  type SiteAssetRow,
  type SiteSettingRow,
} from "./supabase";

export type SiteAssetKey =
  | "header_logo_light"
  | "header_logo_dark"
  | "footer_logo_light"
  | "footer_logo_dark"
  | "favicon"
  | "og_image"
  | "founder_photo";

export type ContactLinkSetting = {
  label: string;
  value: string;
  href: string;
  type: "whatsapp" | "email" | "instagram" | "linkedin" | "other";
  isActive: boolean;
  sortOrder: number;
};

export type AboutProfileSetting = {
  name: string;
  role: string;
  shortBio: string;
  detailBio: string;
};

export type PublicSiteData = {
  assets: Record<string, SiteAssetRow>;
  settings: Record<string, unknown>;
};

type UploadMediaOptions = {
  section: string;
  usageType: string;
  label?: string;
  altText?: string;
};

const mediaBucket = "site-media";
const defaultAdminMediaLimit = 48;

function requireSupabase() {
  if (!supabase) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return supabase;
}

function normalizePathSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "media";
}

function getStorageExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (!extension) {
    return "webp";
  }

  return extension === "jpeg" ? "jpg" : extension;
}

function assertImageFile(file: File) {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error("File harus berupa gambar JPG, JPEG, PNG, WEBP, atau SVG.");
  }
}

async function createMediaAssetRow(file: File, path: string, url: string, options: UploadMediaOptions) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("media_assets")
    .insert({
      bucket: mediaBucket,
      path,
      url,
      label: options.label || file.name,
      alt_text: options.altText || options.label || file.name,
      section: options.section,
      usage_type: options.usageType,
      mime_type: file.type || null,
      size_bytes: file.size,
      is_active: true,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as MediaAssetRow;
}

export async function uploadMediaAssets(files: FileList | File[], options: UploadMediaOptions) {
  const client = requireSupabase();
  const section = normalizePathSegment(options.section);
  const usageType = normalizePathSegment(options.usageType);

  return Promise.all(
    Array.from(files).map(async (file) => {
      assertImageFile(file);

      const path = `${section}/${usageType}/${crypto.randomUUID()}.${getStorageExtension(file)}`;
      const { error } = await client.storage.from(mediaBucket).upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
        contentType: file.type || undefined,
      });

      if (error) {
        throw error;
      }

      const { data } = client.storage.from(mediaBucket).getPublicUrl(path);

      return createMediaAssetRow(file, path, data.publicUrl, options);
    }),
  );
}

type FetchAdminMediaAssetsOptions = {
  limit?: number;
  offset?: number;
};

export async function fetchAdminMediaAssets(options: FetchAdminMediaAssetsOptions = {}) {
  const client = requireSupabase();
  const limit = options.limit ?? defaultAdminMediaLimit;
  const offset = options.offset ?? 0;
  const { data, error } = await client
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw error;
  }

  return data as MediaAssetRow[];
}

export async function fetchAdminMediaAssetCount() {
  const client = requireSupabase();
  const { count, error } = await client
    .from("media_assets")
    .select("id", { count: "exact", head: true });

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function fetchAdminSiteAssets() {
  const client = requireSupabase();
  const { data, error } = await client
    .from("site_assets")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  return data as SiteAssetRow[];
}

export async function fetchAdminSiteSettings() {
  const client = requireSupabase();
  const { data, error } = await client
    .from("site_settings")
    .select("*")
    .order("setting_key", { ascending: true });

  if (error) {
    throw error;
  }

  return data as SiteSettingRow[];
}

export async function fetchPublicSiteData(): Promise<PublicSiteData> {
  if (!supabase) {
    return {
      assets: {},
      settings: {},
    };
  }

  const [assetsResult, settingsResult] = await Promise.all([
    supabase.from("site_assets").select("*").eq("is_active", true).order("sort_order", { ascending: true }),
    supabase.from("site_settings").select("*").eq("is_public", true),
  ]);
  const firstError = assetsResult.error ?? settingsResult.error;

  if (firstError) {
    throw firstError;
  }

  const assets = Object.fromEntries(
    (assetsResult.data as SiteAssetRow[]).map((asset) => [asset.asset_key, asset]),
  );
  const settings = Object.fromEntries(
    (settingsResult.data as SiteSettingRow[]).map((setting) => [setting.setting_key, setting.setting_value]),
  );

  return {
    assets,
    settings,
  };
}

export async function upsertSiteAsset(assetKey: SiteAssetKey, media: MediaAssetRow, meta?: Partial<SiteAssetRow>) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("site_assets")
    .upsert(
      {
        asset_key: assetKey,
        media_asset_id: media.id,
        url: media.url,
        path: media.path,
        label: meta?.label ?? media.label,
        alt_text: meta?.alt_text ?? media.alt_text,
        section: meta?.section ?? media.section,
        usage_type: meta?.usage_type ?? media.usage_type,
        sort_order: meta?.sort_order ?? 0,
        is_active: true,
      },
      { onConflict: "asset_key" },
    )
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as SiteAssetRow;
}

export async function upsertSiteSetting(settingKey: string, settingValue: unknown, isPublic = true) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("site_settings")
    .upsert(
      {
        setting_key: settingKey,
        setting_value: settingValue,
        is_public: isPublic,
      },
      { onConflict: "setting_key" },
    )
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as SiteSettingRow;
}

async function countMediaReferences(mediaAssetId: string) {
  const client = requireSupabase();
  const [siteAssetsResult, portfolioImagesResult] = await Promise.all([
    client.from("site_assets").select("id", { count: "exact", head: true }).eq("media_asset_id", mediaAssetId),
    client.from("portfolio_images").select("id", { count: "exact", head: true }).eq("media_asset_id", mediaAssetId),
  ]);
  const firstError = siteAssetsResult.error ?? portfolioImagesResult.error;

  if (firstError) {
    throw firstError;
  }

  return (siteAssetsResult.count ?? 0) + (portfolioImagesResult.count ?? 0);
}

export async function deleteMediaAsset(row: MediaAssetRow) {
  const client = requireSupabase();
  const references = await countMediaReferences(row.id);

  if (references > 0) {
    throw new Error("Media masih dipakai di website atau portfolio. Lepaskan penggunaan terlebih dahulu.");
  }

  const { error: deleteError } = await client.from("media_assets").delete().eq("id", row.id);

  if (deleteError) {
    throw deleteError;
  }

  const { error: storageError } = await client.storage.from(row.bucket).remove([row.path]);

  if (storageError) {
    throw storageError;
  }
}

export async function fetchPortfolioImages(itemIds: string[]) {
  if (!supabase || !itemIds.length) {
    return [] as PortfolioImageRow[];
  }

  const { data, error } = await supabase
    .from("portfolio_images")
    .select("*")
    .in("portfolio_item_id", itemIds)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    const message = error.message?.toLowerCase() ?? "";

    if (message.includes("portfolio_images") || message.includes("does not exist")) {
      return [] as PortfolioImageRow[];
    }

    throw error;
  }

  return data as PortfolioImageRow[];
}
