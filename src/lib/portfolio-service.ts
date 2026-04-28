import type { PortfolioDisplayItem, PortfolioLayout } from "../data/portfolio";
import { supabase, type PortfolioInsert, type PortfolioRow } from "./supabase";

export type PortfolioFormState = {
  id?: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  deliverable: string;
  focus: string;
  tone: string;
  tags: string;
  layout: PortfolioLayout;
  ctaLabel: string;
  detailPath: string;
  sortOrder: string;
  isFeatured: boolean;
  isHome: boolean;
  isPublished: boolean;
  imageUrl: string;
  imagePath: string;
  galleryUrls: string[];
  galleryPaths: string[];
};

export const defaultPortfolioFormState: PortfolioFormState = {
  title: "",
  slug: "",
  category: "logo",
  summary: "",
  deliverable: "Logo",
  focus: "",
  tone: "",
  tags: "",
  layout: "wide",
  ctaLabel: "",
  detailPath: "",
  sortOrder: "0",
  isFeatured: false,
  isHome: false,
  isPublished: false,
  imageUrl: "",
  imagePath: "",
  galleryUrls: [],
  galleryPaths: [],
};

export function createDefaultPortfolioFormState(): PortfolioFormState {
  return {
    ...defaultPortfolioFormState,
    galleryUrls: [],
    galleryPaths: [],
  };
}

function requireSupabase() {
  if (!supabase) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return supabase;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function mapRowToDisplayItem(row: PortfolioRow): PortfolioDisplayItem {
  return {
    id: row.id,
    slug: row.slug,
    imageName: row.image_path ?? row.image_url ?? "",
    imageUrl: row.image_url ?? undefined,
    title: row.title,
    category: row.category as PortfolioDisplayItem["category"],
    summary: row.summary ?? undefined,
    deliverable: row.deliverable ?? undefined,
    focus: row.focus ?? undefined,
    tone: row.tone ?? undefined,
    tags: row.tags,
    layout: row.layout,
    galleryImageUrls: row.gallery_urls,
    ctaLabel: row.cta_label ?? undefined,
    detailPath: row.detail_path ?? undefined,
    isFeatured: row.is_featured,
    isHome: row.is_home,
  };
}

export function rowToFormState(row: PortfolioRow): PortfolioFormState {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    summary: row.summary ?? "",
    deliverable: row.deliverable ?? "",
    focus: row.focus ?? "",
    tone: row.tone ?? "",
    tags: row.tags.join(", "),
    layout: row.layout,
    ctaLabel: row.cta_label ?? "",
    detailPath: row.detail_path ?? "",
    sortOrder: String(row.sort_order),
    isFeatured: row.is_featured,
    isHome: row.is_home,
    isPublished: row.is_published,
    imageUrl: row.image_url ?? "",
    imagePath: row.image_path ?? "",
    galleryUrls: [...row.gallery_urls],
    galleryPaths: [...row.gallery_paths],
  };
}

function formStateToPayload(values: PortfolioFormState): PortfolioInsert {
  return {
    title: values.title.trim(),
    slug: slugify(values.slug || values.title),
    category: values.category.trim() || "logo",
    summary: values.summary.trim() || null,
    deliverable: values.deliverable.trim() || null,
    focus: values.focus.trim() || null,
    tone: values.tone.trim() || null,
    tags: normalizeTags(values.tags),
    layout: values.layout,
    image_url: values.imageUrl || null,
    image_path: values.imagePath || null,
    gallery_urls: values.galleryUrls,
    gallery_paths: values.galleryPaths,
    cta_label: values.ctaLabel.trim() || null,
    detail_path: values.detailPath.trim() || null,
    is_featured: values.isFeatured,
    is_home: values.isHome,
    is_published: values.isPublished,
    sort_order: Number.parseInt(values.sortOrder, 10) || 0,
  };
}

function getReadablePortfolioError(error: unknown) {
  const portfolioError = error as { code?: string; message?: string } | null;
  const message = portfolioError?.message ?? "";

  if (portfolioError?.code === "23505" || message.toLowerCase().includes("duplicate")) {
    return new Error("Slug sudah digunakan. Gunakan slug yang unik untuk portfolio ini.");
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error(message || "Portfolio item could not be saved.");
}

async function ensureSlugIsAvailable(slug: string, currentItemId?: string) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("portfolio_items")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (data && data.id !== currentItemId) {
    throw new Error("Slug sudah digunakan. Gunakan slug yang unik untuk portfolio ini.");
  }
}

export async function fetchPublishedPortfolioItems() {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as PortfolioRow[]).map(mapRowToDisplayItem);
}

export async function fetchAdminPortfolioItems() {
  const client = requireSupabase();
  const { data, error } = await client
    .from("portfolio_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data as PortfolioRow[];
}

export async function createPortfolioItem(values: PortfolioFormState) {
  const client = requireSupabase();
  const payload = formStateToPayload(values);

  if (!payload.slug) {
    throw new Error("Slug wajib diisi atau judul harus menghasilkan slug yang valid.");
  }

  await ensureSlugIsAvailable(payload.slug);

  const { data, error } = await client
    .from("portfolio_items")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw getReadablePortfolioError(error);
  }

  return data as PortfolioRow;
}

export async function updatePortfolioItem(itemId: string, values: PortfolioFormState) {
  const client = requireSupabase();
  const payload = formStateToPayload(values);

  if (!payload.slug) {
    throw new Error("Slug wajib diisi atau judul harus menghasilkan slug yang valid.");
  }

  await ensureSlugIsAvailable(payload.slug, itemId);

  const { data, error } = await client
    .from("portfolio_items")
    .update(payload)
    .eq("id", itemId)
    .select("*")
    .single();

  if (error) {
    throw getReadablePortfolioError(error);
  }

  return data as PortfolioRow;
}

export async function deletePortfolioItem(row: PortfolioRow) {
  const client = requireSupabase();
  const paths = [row.image_path, ...row.gallery_paths].filter((path): path is string => Boolean(path));
  const { error } = await client.from("portfolio_items").delete().eq("id", row.id);

  if (error) {
    throw error;
  }

  if (paths.length) {
    await client.storage.from("portfolio").remove(paths);
  }
}

export async function removePortfolioStorageFiles(paths: string[]) {
  const client = requireSupabase();
  const normalizedPaths = paths.filter(Boolean);

  if (!normalizedPaths.length) {
    return;
  }

  const { error } = await client.storage.from("portfolio").remove(normalizedPaths);

  if (error) {
    throw error;
  }
}

export async function updatePortfolioOrder(rows: PortfolioRow[]) {
  const client = requireSupabase();
  const updates = rows.map((row, index) =>
    client
      .from("portfolio_items")
      .update({ sort_order: index + 1 })
      .eq("id", row.id),
  );
  const results = await Promise.all(updates);
  const error = results.find((result) => result.error)?.error;

  if (error) {
    throw error;
  }
}

export async function uploadPortfolioImages(files: FileList | File[]) {
  const client = requireSupabase();
  const uploadedFiles = await Promise.all(
    Array.from(files).map(async (file) => {
      const extension = file.name.split(".").pop() || "webp";
      const filename = `${crypto.randomUUID()}.${extension}`;
      const path = `portfolio/${filename}`;
      const { error } = await client.storage.from("portfolio").upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
      });

      if (error) {
        throw error;
      }

      const { data } = client.storage.from("portfolio").getPublicUrl(path);

      return {
        path,
        url: data.publicUrl,
      };
    }),
  );

  return uploadedFiles;
}
