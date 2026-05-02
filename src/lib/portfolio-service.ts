import type { PortfolioDisplayItem, PortfolioLayout } from "../data/portfolio";
import { fetchPortfolioImages, uploadMediaAssets } from "./media-service";
import {
  supabase,
  type MediaAssetRow,
  type PortfolioImageRow,
  type PortfolioInsert,
  type PortfolioRow,
} from "./supabase";

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
  imageRecordId: string;
  imageMediaId: string;
  galleryUrls: string[];
  galleryPaths: string[];
  galleryImageIds: string[];
  galleryMediaIds: string[];
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
  imageRecordId: "",
  imageMediaId: "",
  galleryUrls: [],
  galleryPaths: [],
  galleryImageIds: [],
  galleryMediaIds: [],
};

export function createDefaultPortfolioFormState(): PortfolioFormState {
  return {
    ...defaultPortfolioFormState,
    galleryUrls: [],
    galleryPaths: [],
    galleryImageIds: [],
    galleryMediaIds: [],
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

function getRowImages(row: PortfolioRow) {
  const images = row.portfolio_images?.filter((image) => image.is_active) ?? [];
  const mainImage = images.find((image) => image.image_role === "main");
  const galleryImages = images
    .filter((image) => image.image_role === "gallery")
    .sort((first, second) => first.sort_order - second.sort_order);

  return {
    mainImage,
    galleryImages,
  };
}

function mapRowToDisplayItem(row: PortfolioRow): PortfolioDisplayItem {
  const { mainImage, galleryImages } = getRowImages(row);
  const imageUrl = mainImage?.image_url ?? row.image_url ?? "";
  const imagePath = mainImage?.image_path ?? row.image_path ?? imageUrl;
  const galleryImageUrls = galleryImages.length
    ? galleryImages.map((image) => image.image_url)
    : row.gallery_urls;

  return {
    id: row.id,
    slug: row.slug,
    imageName: imagePath,
    imageUrl: imageUrl || undefined,
    title: row.title,
    category: row.category as PortfolioDisplayItem["category"],
    summary: row.summary ?? undefined,
    deliverable: row.deliverable ?? undefined,
    focus: row.focus ?? undefined,
    tone: row.tone ?? undefined,
    tags: row.tags,
    layout: row.layout,
    galleryImageUrls,
    ctaLabel: row.cta_label ?? undefined,
    detailPath: row.detail_path ?? undefined,
    isFeatured: row.is_featured,
    isHome: row.is_home,
    isPublished: row.is_published,
  };
}

export function rowToFormState(row: PortfolioRow): PortfolioFormState {
  const { mainImage, galleryImages } = getRowImages(row);
  const galleryUrls = galleryImages.length
    ? galleryImages.map((image) => image.image_url)
    : [...row.gallery_urls];
  const galleryPaths = galleryImages.length
    ? galleryImages.map((image) => image.image_path)
    : [...row.gallery_paths];

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
    imageUrl: mainImage?.image_url ?? row.image_url ?? "",
    imagePath: mainImage?.image_path ?? row.image_path ?? "",
    imageRecordId: mainImage?.id ?? "",
    imageMediaId: mainImage?.media_asset_id ?? "",
    galleryUrls,
    galleryPaths,
    galleryImageIds: galleryImages.map((image) => image.id),
    galleryMediaIds: galleryImages.map((image) => image.media_asset_id ?? ""),
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

function mediaToPortfolioUpload(media: MediaAssetRow) {
  return {
    path: media.path,
    url: media.url,
    mediaId: media.id,
  };
}

async function upsertMainPortfolioImage(itemId: string, values: PortfolioFormState) {
  const client = requireSupabase();
  const existingMainId = values.imageRecordId;

  if (!values.imageUrl) {
    if (existingMainId) {
      await client.from("portfolio_images").delete().eq("id", existingMainId);
    }

    return;
  }

  const payload = {
    portfolio_item_id: itemId,
    media_asset_id: values.imageMediaId || null,
    image_role: "main",
    image_url: values.imageUrl,
    image_path: values.imagePath || "",
    alt_text: values.title,
    sort_order: 0,
    is_active: true,
  };

  if (existingMainId) {
    const { error } = await client.from("portfolio_images").update(payload).eq("id", existingMainId);

    if (error) {
      throw error;
    }

    return;
  }

  const { error } = await client.from("portfolio_images").insert(payload);

  if (error) {
    throw error;
  }
}

async function syncGalleryPortfolioImages(itemId: string, values: PortfolioFormState) {
  const client = requireSupabase();
  const currentImages = await fetchPortfolioImages([itemId]);
  const currentGalleryImages = currentImages.filter((image) => image.image_role === "gallery");
  const nextIds = new Set(values.galleryImageIds.filter(Boolean));

  const deletedImages = currentGalleryImages.filter((image) => !nextIds.has(image.id));

  if (deletedImages.length) {
    const { error } = await client
      .from("portfolio_images")
      .delete()
      .in("id", deletedImages.map((image) => image.id));

    if (error) {
      throw error;
    }
  }

  const updates = values.galleryUrls.map((url, index) => {
    const imageId = values.galleryImageIds[index];
    const payload = {
      portfolio_item_id: itemId,
      media_asset_id: values.galleryMediaIds[index] || null,
      image_role: "gallery",
      image_url: url,
      image_path: values.galleryPaths[index] || "",
      alt_text: `${values.title} ${index + 1}`,
      sort_order: index + 1,
      is_active: true,
    };

    return imageId
      ? client.from("portfolio_images").update(payload).eq("id", imageId)
      : client.from("portfolio_images").insert(payload);
  });
  const results = await Promise.all(updates);
  const firstError = results.find((result) => result.error)?.error;

  if (firstError) {
    throw firstError;
  }
}

async function syncPortfolioImages(itemId: string, values: PortfolioFormState) {
  await upsertMainPortfolioImage(itemId, values);
  await syncGalleryPortfolioImages(itemId, values);
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

function attachPortfolioImages(rows: PortfolioRow[], images: PortfolioImageRow[]) {
  const imagesByItemId = images.reduce<Record<string, PortfolioImageRow[]>>((groups, image) => {
    groups[image.portfolio_item_id] = groups[image.portfolio_item_id] ?? [];
    groups[image.portfolio_item_id].push(image);

    return groups;
  }, {});

  return rows.map((row) => ({
    ...row,
    portfolio_images: imagesByItemId[row.id] ?? [],
  }));
}

export async function fetchPublishedPortfolioItems() {
  if (!supabase) {
    return {
      galleryItems: [],
      featuredItems: [],
      homeItems: [],
      detailItems: [],
      curatedItems: [],
    };
  }

  const client = supabase;
  const selectColumns = "id,title,slug,category,summary,deliverable,focus,tone,tags,layout,image_url,image_path,gallery_urls,cta_label,detail_path,is_featured,is_home,is_published,sort_order,created_at";
  const createVisibilityQuery = (column: "is_home" | "is_featured" | "is_published") =>
    client
      .from("portfolio_items")
      .select(selectColumns)
      .eq(column, true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

  const [homeResult, featuredResult, publishedResult] = await Promise.all([
    createVisibilityQuery("is_home"),
    createVisibilityQuery("is_featured"),
    createVisibilityQuery("is_published"),
  ]);
  const firstError = homeResult.error ?? featuredResult.error ?? publishedResult.error;

  if (firstError) {
    throw firstError;
  }

  const rawHomeRows = homeResult.data as PortfolioRow[];
  const rawFeaturedRows = featuredResult.data as PortfolioRow[];
  const rawPublishedRows = publishedResult.data as PortfolioRow[];
  const itemIds = [...rawHomeRows, ...rawFeaturedRows, ...rawPublishedRows]
    .map((row) => row.id)
    .filter((id, index, ids) => ids.indexOf(id) === index);
  const images = await fetchPortfolioImages(itemIds);
  const homeItems = attachPortfolioImages(rawHomeRows, images).map(mapRowToDisplayItem);
  const featuredItems = attachPortfolioImages(rawFeaturedRows, images).map(mapRowToDisplayItem);
  const galleryItems = attachPortfolioImages(rawPublishedRows, images).map(mapRowToDisplayItem);
  const detailItems = [...homeItems, ...featuredItems, ...galleryItems].filter(
    (item, index, items) => items.findIndex((candidate) => candidate.id === item.id) === index,
  );

  return {
    galleryItems,
    featuredItems,
    homeItems,
    detailItems,
    curatedItems: detailItems,
  };
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

  const rows = data as PortfolioRow[];
  const images = await fetchPortfolioImages(rows.map((row) => row.id));

  return attachPortfolioImages(rows, images);
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

  const createdRow = data as PortfolioRow;

  await syncPortfolioImages(createdRow.id, values);

  return createdRow;
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

  await syncPortfolioImages(itemId, values);

  return data as PortfolioRow;
}

export async function deletePortfolioItem(row: PortfolioRow) {
  const client = requireSupabase();
  const { error } = await client.from("portfolio_items").delete().eq("id", row.id);

  if (error) {
    throw error;
  }
}

export async function removePortfolioStorageFiles(paths: string[]) {
  const client = requireSupabase();
  const normalizedPaths = paths.filter(Boolean);

  if (!normalizedPaths.length) {
    return;
  }

  const { error } = await client.storage.from("site-media").remove(normalizedPaths);

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
  const uploadedMedia = await uploadMediaAssets(files, {
    section: "portfolio",
    usageType: "portfolio-image",
    label: "Portfolio image",
    altText: "Portfolio image",
  });

  return uploadedMedia.map(mediaToPortfolioUpload);
}
