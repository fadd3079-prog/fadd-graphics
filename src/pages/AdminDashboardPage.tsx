import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowDown, ArrowUp, LogOut, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { useAdminAuth } from "../hooks/useAdminAuth";
import {
  createDefaultPortfolioFormState,
  createPortfolioItem,
  deletePortfolioItem,
  fetchAdminPortfolioItems,
  removePortfolioStorageFiles,
  rowToFormState,
  updatePortfolioItem,
  updatePortfolioOrder,
  uploadPortfolioImages,
  type PortfolioFormState,
} from "../lib/portfolio-service";
import type { PortfolioRow } from "../lib/supabase";

const categoryOptions = [
  "logo",
  "identity",
  "campaign",
  "editorial",
  "event",
  "promotion",
  "announcement",
];

const layoutOptions = ["wide", "tall", "panoramic"] as const;

function AdminDashboardPage() {
  const { user, signOut } = useAdminAuth();
  const [items, setItems] = useState<PortfolioRow[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<PortfolioFormState>(() => createDefaultPortfolioFormState());
  const [formResetKey, setFormResetKey] = useState(0);
  const formSessionRef = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");

  const loadItems = async () => {
    setIsLoading(true);
    setStatus("");

    try {
      setItems(await fetchAdminPortfolioItems());
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Portfolio data could not be loaded.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const updateField =
    (field: keyof PortfolioFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const target = event.target;
      const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;

      setFormValues((currentValues) => ({
        ...currentValues,
        [field]: value,
      }));
    };

  const resetForm = () => {
    formSessionRef.current += 1;
    setSelectedItemId(null);
    setFormValues(createDefaultPortfolioFormState());
    setFormResetKey((currentKey) => currentKey + 1);
    setStatus("");
  };

  const handleEdit = (row: PortfolioRow) => {
    formSessionRef.current += 1;
    setSelectedItemId(row.id);
    setFormValues(rowToFormState(row));
    setFormResetKey((currentKey) => currentKey + 1);
    setStatus("");
  };

  const handleMainImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files?.length) {
      return;
    }

    try {
      const uploadSession = formSessionRef.current;
      const [image] = await uploadPortfolioImages(files);

      if (uploadSession !== formSessionRef.current) {
        await removePortfolioStorageFiles([image.path]).catch(() => undefined);
        return;
      }

      setFormValues((currentValues) => ({
        ...currentValues,
        imageUrl: image.url,
        imagePath: image.path,
      }));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      event.target.value = "";
    }
  };

  const handleGalleryUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files?.length) {
      return;
    }

    try {
      const uploadSession = formSessionRef.current;
      const images = await uploadPortfolioImages(files);

      if (uploadSession !== formSessionRef.current) {
        await removePortfolioStorageFiles(images.map((image) => image.path)).catch(() => undefined);
        return;
      }

      setFormValues((currentValues) => ({
        ...currentValues,
        galleryUrls: [...currentValues.galleryUrls, ...images.map((image) => image.url)],
        galleryPaths: [...currentValues.galleryPaths, ...images.map((image) => image.path)],
      }));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Gallery upload failed.");
    } finally {
      event.target.value = "";
    }
  };

  const handleRemoveGalleryImage = async (index: number) => {
    const removedPath = formValues.galleryPaths[index];
    const nextValues = {
      ...formValues,
      galleryUrls: formValues.galleryUrls.filter((_, imageIndex) => imageIndex !== index),
      galleryPaths: formValues.galleryPaths.filter((_, imageIndex) => imageIndex !== index),
    };

    setIsSaving(true);
    setStatus("");

    try {
      if (selectedItemId) {
        await updatePortfolioItem(selectedItemId, nextValues);
      }

      if (removedPath) {
        await removePortfolioStorageFiles([removedPath]);
      }

      setFormValues(nextValues);
      await loadItems();
      setStatus("Gallery image removed.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Gallery image could not be removed.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setStatus("");

    try {
      const isEditing = Boolean(selectedItemId);
      const savedItem = selectedItemId
        ? await updatePortfolioItem(selectedItemId, formValues)
        : await createPortfolioItem(formValues);

      resetForm();
      await loadItems();
      setStatus(isEditing ? "Portfolio item updated." : `Portfolio item "${savedItem.title}" created.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Portfolio item could not be saved.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (row: PortfolioRow) => {
    const confirmed = window.confirm(`Delete "${row.title}"?`);

    if (!confirmed) {
      return;
    }

    setStatus("");

    try {
      await deletePortfolioItem(row);
      await loadItems();
      setStatus("Portfolio item deleted.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Portfolio item could not be deleted.");
    }
  };

  const handleMoveItem = async (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= items.length) {
      return;
    }

    const nextItems = [...items];
    const [movedItem] = nextItems.splice(index, 1);

    nextItems.splice(nextIndex, 0, movedItem);
    const orderedItems = nextItems.map((item, itemIndex) => ({
      ...item,
      sort_order: itemIndex + 1,
    }));

    setItems(orderedItems);
    setStatus("");

    try {
      await updatePortfolioOrder(orderedItems);
      setStatus("Portfolio order updated.");
    } catch (error) {
      await loadItems();
      setStatus(error instanceof Error ? error.message : "Portfolio order could not be updated.");
    }
  };

  return (
    <section className="section-shell pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pt-36">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <span className="eyebrow">Portfolio admin</span>
          <h1 className="mt-4 text-[2.3rem] font-bold leading-[0.98] tracking-[-0.055em] text-text sm:text-[3rem]">
            Kelola portfolio.
          </h1>
          <p className="mt-4 max-w-2xl text-[0.98rem] leading-7 text-muted">
            Buat, edit, publish, draft, upload gambar, dan tandai karya unggulan dari dashboard privat.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-line bg-card px-4 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-muted">
            {user?.email}
          </span>
          <button type="button" className="button-secondary" onClick={signOut}>
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {status ? (
        <p className="mt-6 rounded-[1rem] border border-line bg-card px-4 py-3 text-[0.92rem] leading-6 text-muted">
          {status}
        </p>
      ) : null}

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form className="section-frame rounded-[1.6rem] p-5 sm:p-6" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="editorial-note">{selectedItemId ? "Edit item" : "New item"}</p>
              <h2 className="mt-2 text-[1.45rem] font-bold tracking-[-0.045em] text-text">
                {selectedItemId ? formValues.title : "Tambah portfolio"}
              </h2>
            </div>
            <button type="button" className="button-secondary" onClick={resetForm}>
              <Plus className="h-4 w-4" />
              Baru
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-text">
              <span>Judul</span>
              <input className="input-shell" value={formValues.title} onChange={updateField("title")} required />
            </label>
            <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-text">
              <span>Slug</span>
              <input className="input-shell" value={formValues.slug} onChange={updateField("slug")} placeholder="auto dari judul" />
            </label>
            <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-text">
              <span>Kategori</span>
              <select className="input-shell" value={formValues.category} onChange={updateField("category")}>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-text">
              <span>Layout</span>
              <select className="input-shell" value={formValues.layout} onChange={updateField("layout")}>
                {layoutOptions.map((layout) => (
                  <option key={layout} value={layout}>
                    {layout}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-text">
              <span>Deliverable</span>
              <input className="input-shell" value={formValues.deliverable} onChange={updateField("deliverable")} />
            </label>
            <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-text">
              <span>Tone</span>
              <input className="input-shell" value={formValues.tone} onChange={updateField("tone")} />
            </label>
            <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-text">
              <span>CTA label</span>
              <input className="input-shell" value={formValues.ctaLabel} onChange={updateField("ctaLabel")} />
            </label>
            <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-text">
              <span>Detail path</span>
              <input className="input-shell" value={formValues.detailPath} onChange={updateField("detailPath")} />
            </label>
            <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-text sm:col-span-2">
              <span>Fokus</span>
              <input className="input-shell" value={formValues.focus} onChange={updateField("focus")} />
            </label>
            <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-text sm:col-span-2">
              <span>Summary</span>
              <textarea className="input-shell min-h-[110px] resize-none" value={formValues.summary} onChange={updateField("summary")} />
            </label>
            <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-text sm:col-span-2">
              <span>Tags</span>
              <input className="input-shell" value={formValues.tags} onChange={updateField("tags")} placeholder="Logo, Branding, Editorial" />
            </label>
            <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-text">
              <span>Sort order</span>
              <input className="input-shell" type="number" value={formValues.sortOrder} onChange={updateField("sortOrder")} />
            </label>
            <div className="grid gap-3 rounded-[1.1rem] border border-line bg-surface p-4">
              <label className="flex items-center justify-between gap-4 text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-text">
                <span>Featured</span>
                <input type="checkbox" checked={formValues.isFeatured} onChange={updateField("isFeatured")} />
              </label>
              <label className="flex items-center justify-between gap-4 text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-text">
                <span>Home</span>
                <input type="checkbox" checked={formValues.isHome} onChange={updateField("isHome")} />
              </label>
              <label className="flex items-center justify-between gap-4 text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-text">
                <span>Published</span>
                <input type="checkbox" checked={formValues.isPublished} onChange={updateField("isPublished")} />
              </label>
            </div>
          </div>

          <div className="mt-5 grid gap-3 rounded-[1.2rem] border border-line bg-surface p-4">
            <label className="button-secondary cursor-pointer justify-center">
              <Upload className="h-4 w-4" />
              Upload main image
              <input key={`main-${formResetKey}`} type="file" accept="image/*" className="hidden" onChange={handleMainImageUpload} />
            </label>
            {formValues.imageUrl ? (
              <img src={formValues.imageUrl} alt="" className="max-h-48 w-full rounded-[1rem] object-contain" />
            ) : null}
            <label className="button-secondary cursor-pointer justify-center">
              <Upload className="h-4 w-4" />
              Upload gallery
              <input key={`gallery-${formResetKey}`} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
            </label>
            {formValues.galleryUrls.length ? (
              <div className="grid grid-cols-3 gap-2">
                {formValues.galleryUrls.map((url, index) => (
                  <div key={url} className="relative overflow-hidden rounded-[0.8rem] border border-line bg-card">
                    <img src={url} alt="" className="aspect-[4/3] w-full object-cover" />
                    <button
                      type="button"
                      aria-label="Remove gallery image"
                      className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/75 text-white hover:bg-accent"
                      onClick={() => handleRemoveGalleryImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <button type="submit" className="button-primary mt-6 w-full justify-center" disabled={isSaving}>
            {isSaving ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-bg/50 border-t-bg" />
            ) : (
              <Pencil className="h-4 w-4" />
            )}
            Simpan portfolio
          </button>
        </form>

        <div className="section-frame rounded-[1.6rem] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="editorial-note">All items</p>
              <h2 className="mt-2 text-[1.45rem] font-bold tracking-[-0.045em] text-text">
                {items.length} portfolio
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {isLoading ? (
              <div className="flex min-h-[12rem] items-center justify-center">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-lineStrong border-t-accent" />
              </div>
            ) : null}

            {!isLoading && !items.length ? (
              <p className="rounded-[1rem] border border-line bg-surface px-4 py-3 text-[0.92rem] leading-6 text-muted">
                Belum ada portfolio dari Supabase.
              </p>
            ) : null}

            {items.map((item, index) => (
              <article key={item.id} className="rounded-[1.2rem] border border-line bg-surface p-4">
                <div className="flex gap-4">
                  {item.image_url ? (
                    <img src={item.image_url} alt="" className="h-20 w-28 shrink-0 rounded-[0.8rem] object-cover" />
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="editorial-note">{item.category}</span>
                      <span className="rounded-full border border-lineStrong/70 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-muted">
                        {item.is_published ? "Published" : "Draft"}
                      </span>
                      {item.is_featured ? (
                        <span className="rounded-full border border-lineStrong/70 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-muted">
                          Featured
                        </span>
                      ) : null}
                      {item.is_home ? (
                        <span className="rounded-full border border-lineStrong/70 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-muted">
                          Home
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-2 truncate text-[1.05rem] font-bold tracking-[-0.04em] text-text">
                      {item.title}
                    </h3>
                    <p className="mt-1 truncate text-[0.88rem] leading-6 text-muted">{item.slug}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="button" className="button-secondary" onClick={() => handleEdit(item)}>
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        className="button-secondary"
                        onClick={() => handleMoveItem(index, -1)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                        Up
                      </button>
                      <button
                        type="button"
                        className="button-secondary"
                        onClick={() => handleMoveItem(index, 1)}
                        disabled={index === items.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                        Down
                      </button>
                      <button type="button" className="button-secondary" onClick={() => handleDelete(item)}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboardPage;
