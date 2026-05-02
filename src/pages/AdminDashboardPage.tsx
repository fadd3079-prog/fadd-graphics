import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Circle,
  FileImage,
  Image,
  LayoutDashboard,
  Link as LinkIcon,
  Loader2,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Save,
  Search,
  Settings,
  SquarePen,
  Trash2,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { useTheme } from "../hooks/useTheme";
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
import {
  deleteMediaAsset,
  fetchAdminMediaAssetCount,
  fetchAdminMediaAssets,
  fetchAdminSiteAssets,
  fetchAdminSiteSettings,
  uploadMediaAssets,
  upsertSiteAsset,
  upsertSiteSetting,
  type AboutProfileSetting,
  type ContactLinkSetting,
  type SiteAssetKey,
} from "../lib/media-service";
import type { MediaAssetRow, PortfolioRow, SiteAssetRow, SiteSettingRow } from "../lib/supabase";

const categoryOptions = ["logo", "identity", "campaign", "editorial", "event", "promotion", "announcement"];
const layoutOptions = ["wide", "tall", "panoramic"] as const;
const mediaPageSize = 48;

const tabs = [
  { id: "ringkasan", label: "Ringkasan", icon: LayoutDashboard },
  { id: "portofolio", label: "Portofolio", icon: Image },
  { id: "media", label: "Media Library", icon: Upload },
  { id: "identitas", label: "Identitas Website", icon: Settings },
  { id: "profil", label: "About / Profil", icon: UserRound },
  { id: "kontak", label: "Kontak", icon: LinkIcon },
  { id: "pengaturan", label: "Pengaturan", icon: Settings },
] as const;

type AdminTab = (typeof tabs)[number]["id"];
type StatusTone = "normal" | "success" | "danger";
type BusyKey =
  | "base"
  | "portfolio-save"
  | "portfolio-delete"
  | "portfolio-order"
  | "main-upload"
  | "gallery-upload"
  | "gallery-delete"
  | "media-load"
  | "media-upload"
  | "media-delete"
  | "asset-upload"
  | "profile-save"
  | "contact-save"
  | "logout";

type PortfolioStatusFilter = "semua" | "beranda" | "unggulan" | "terbit" | "draf";

const defaultContactLinks: ContactLinkSetting[] = [
  { label: "WhatsApp", value: "+62 831 5096 4050", href: "https://wa.me/6283150964050", type: "whatsapp", isActive: true, sortOrder: 1 },
  { label: "Email", value: "faddgraphics@gmail.com", href: "mailto:faddgraphics@gmail.com", type: "email", isActive: true, sortOrder: 2 },
  { label: "Instagram", value: "@fadd_graphics", href: "https://instagram.com/fadd_graphics", type: "instagram", isActive: true, sortOrder: 3 },
  { label: "LinkedIn", value: "Mufaddhol", href: "https://www.linkedin.com/in/mufaddhol-01b60333a/", type: "linkedin", isActive: true, sortOrder: 4 },
  { label: "Lainnya", value: "", href: "", type: "other", isActive: false, sortOrder: 5 },
];

const defaultAboutProfile: AboutProfileSetting = {
  name: "Mufaddhol",
  role: "Founder of FADD GRAPHICS / Freelance Graphic Designer",
  shortBio: "",
  detailBio: "",
};

const siteAssetSlots: { key: SiteAssetKey; label: string; description: string; section: string; accept: string }[] = [
  { key: "header_logo_light", label: "Logo header terang", description: "Dipakai di header mode terang.", section: "identity", accept: "image/jpeg,image/png,image/webp,image/svg+xml" },
  { key: "header_logo_dark", label: "Logo header gelap", description: "Dipakai di header mode gelap.", section: "identity", accept: "image/jpeg,image/png,image/webp,image/svg+xml" },
  { key: "footer_logo_light", label: "Logo footer terang", description: "Dipakai di footer mode terang.", section: "identity", accept: "image/jpeg,image/png,image/webp,image/svg+xml" },
  { key: "footer_logo_dark", label: "Logo footer gelap", description: "Dipakai di footer mode gelap.", section: "identity", accept: "image/jpeg,image/png,image/webp,image/svg+xml" },
  { key: "favicon", label: "Favicon", description: "Ikon kecil pada tab browser.", section: "identity", accept: "image/png,image/webp,image/svg+xml" },
  { key: "og_image", label: "OG / social preview", description: "Gambar preview saat link dibagikan.", section: "identity", accept: "image/jpeg,image/png,image/webp" },
];

function getSettingValue<T>(settings: SiteSettingRow[], key: string, fallback: T): T {
  const setting = settings.find((item) => item.setting_key === key);

  return setting?.setting_value ? (setting.setting_value as T) : fallback;
}

function getAssetByKey(assets: SiteAssetRow[], key: SiteAssetKey) {
  return assets.find((asset) => asset.asset_key === key && asset.is_active);
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatBytes(value: number | null) {
  if (!value) {
    return "-";
  }

  if (value < 1024 * 1024) {
    return `${Math.round(value / 1024)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function normalizeSearch(value: string) {
  return value.trim().toLowerCase();
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function AdminShellButton({
  children,
  className,
  disabled,
  variant = "secondary",
  ...props
}: {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger" | "ghost";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants = {
    primary: "border-text bg-text text-bg hover:bg-accent hover:text-white",
    secondary: "border-line bg-card text-text hover:border-accent/70 hover:text-accent",
    danger: "border-line bg-card text-text hover:border-red-500/60 hover:text-red-600 dark:hover:text-red-300",
    ghost: "border-transparent bg-transparent text-muted hover:bg-surface hover:text-text",
  };

  return (
    <button
      {...props}
      disabled={disabled}
      className={cx(
        "inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border px-3.5 py-2 text-[0.82rem] font-semibold transition disabled:pointer-events-none disabled:opacity-55",
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="text-[0.72rem] font-bold uppercase tracking-[0.06em] text-muted">{children}</span>;
}

function StatusBadge({ children, tone = "normal" }: { children: ReactNode; tone?: StatusTone }) {
  const toneClass = {
    normal: "border-line bg-surface text-muted",
    success: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    danger: "border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300",
  };

  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.055em]", toneClass[tone])}>
      {children}
    </span>
  );
}

function SectionCard({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cx("rounded-2xl border border-line bg-card shadow-soft", className)}>{children}</section>;
}

function EmptyState({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-dashed border-lineStrong bg-surface/70 px-4 py-8 text-center text-[0.9rem] leading-6 text-muted">{children}</div>;
}

function AdminDashboardPage() {
  const { user, signOut } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<AdminTab>("ringkasan");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [items, setItems] = useState<PortfolioRow[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAssetRow[]>([]);
  const [mediaTotal, setMediaTotal] = useState(0);
  const [siteAssets, setSiteAssets] = useState<SiteAssetRow[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<PortfolioFormState>(() => createDefaultPortfolioFormState());
  const [formResetKey, setFormResetKey] = useState(0);
  const [contactLinks, setContactLinks] = useState<ContactLinkSetting[]>(defaultContactLinks);
  const [aboutProfile, setAboutProfile] = useState<AboutProfileSetting>(defaultAboutProfile);
  const [portfolioSearch, setPortfolioSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("semua");
  const [statusFilter, setStatusFilter] = useState<PortfolioStatusFilter>("semua");
  const [mediaPage, setMediaPage] = useState(0);
  const [status, setStatus] = useState<{ tone: StatusTone; text: string } | null>(null);
  const [busyKeys, setBusyKeys] = useState<Set<BusyKey>>(() => new Set(["base"]));
  const formSessionRef = useRef(0);
  const isContactDirtyRef = useRef(false);
  const isAboutDirtyRef = useRef(false);
  const isInitialLoading = busyKeys.has("base");
  const isSaving = busyKeys.size > 0 && !busyKeys.has("base");

  const runBusy = useCallback(async <T,>(key: BusyKey, task: () => Promise<T>) => {
    setBusyKeys((current) => new Set(current).add(key));

    try {
      return await task();
    } finally {
      setBusyKeys((current) => {
        const next = new Set(current);
        next.delete(key);
        return next;
      });
    }
  }, []);

  const showStatus = useCallback((tone: StatusTone, text: string) => {
    setStatus({ tone, text });
  }, []);

  const loadMediaPage = useCallback(
    async (page = mediaPage) => {
      await runBusy("media-load", async () => {
        const offset = page * mediaPageSize;
        const [mediaRows, totalCount] = await Promise.all([
          fetchAdminMediaAssets({ limit: mediaPageSize, offset }),
          fetchAdminMediaAssetCount(),
        ]);

        setMediaAssets(mediaRows);
        setMediaTotal(totalCount);
      });
    },
    [mediaPage, runBusy],
  );

  const loadBaseData = useCallback(async () => {
    await runBusy("base", async () => {
      setStatus(null);
      const [portfolioRows, mediaCount, assetRows, settingRows] = await Promise.all([
        fetchAdminPortfolioItems(),
        fetchAdminMediaAssetCount(),
        fetchAdminSiteAssets(),
        fetchAdminSiteSettings(),
      ]);
      const nextContactLinks = getSettingValue(settingRows, "contact_links", defaultContactLinks);
      const nextAboutProfile = getSettingValue(settingRows, "about_profile", defaultAboutProfile);

      setItems(portfolioRows);
      setMediaTotal(mediaCount);
      setSiteAssets(assetRows);

      if (!isContactDirtyRef.current) {
        setContactLinks(nextContactLinks);
      }

      if (!isAboutDirtyRef.current) {
        setAboutProfile(nextAboutProfile);
      }
    });
  }, [runBusy]);

  useEffect(() => {
    void loadBaseData().catch((error) => showStatus("danger", error instanceof Error ? error.message : "Dashboard tidak dapat dimuat."));
  }, [loadBaseData, showStatus]);

  useEffect(() => {
    if (activeTab !== "media" || mediaAssets.length) {
      return;
    }

    void loadMediaPage(0).catch((error) => showStatus("danger", error instanceof Error ? error.message : "Media tidak dapat dimuat."));
  }, [activeTab, loadMediaPage, mediaAssets.length, showStatus]);

  const siteAssetMap = useMemo(
    () => Object.fromEntries(siteAssets.map((asset) => [asset.asset_key, asset])),
    [siteAssets],
  ) as Record<string, SiteAssetRow | undefined>;

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedItemId) ?? null,
    [items, selectedItemId],
  );

  const stats = useMemo(() => {
    const home = items.filter((item) => item.is_home).length;
    const featured = items.filter((item) => item.is_featured).length;
    const published = items.filter((item) => item.is_published).length;

    return {
      total: items.length,
      media: mediaTotal,
      home,
      featured,
      published,
      draft: items.length - published,
      assets: siteAssets.filter((asset) => asset.is_active).length,
    };
  }, [items, mediaTotal, siteAssets]);

  const recentItems = useMemo(
    () => [...items].sort((first, second) => new Date(second.updated_at).getTime() - new Date(first.updated_at).getTime()).slice(0, 5),
    [items],
  );

  const filteredItems = useMemo(() => {
    const search = normalizeSearch(portfolioSearch);

    return items.filter((item) => {
      const matchesSearch = !search || [item.title, item.slug, item.category, item.summary ?? ""].some((value) => normalizeSearch(value).includes(search));
      const matchesCategory = categoryFilter === "semua" || item.category === categoryFilter;
      const matchesStatus =
        statusFilter === "semua" ||
        (statusFilter === "beranda" && item.is_home) ||
        (statusFilter === "unggulan" && item.is_featured) ||
        (statusFilter === "terbit" && item.is_published) ||
        (statusFilter === "draf" && !item.is_published);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [categoryFilter, items, portfolioSearch, statusFilter]);

  const mediaPageCount = Math.max(1, Math.ceil(mediaTotal / mediaPageSize));

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

  const resetFormState = useCallback(() => {
    formSessionRef.current += 1;
    setSelectedItemId(null);
    setFormValues(createDefaultPortfolioFormState());
    setFormResetKey((currentKey) => currentKey + 1);
    setStatus(null);
  }, []);

  const handleEdit = (row: PortfolioRow) => {
    formSessionRef.current += 1;
    setSelectedItemId(row.id);
    setFormValues(rowToFormState(row));
    setFormResetKey((currentKey) => currentKey + 1);
    setStatus(null);
    setActiveTab("portofolio");
    setIsSidebarOpen(false);
  };

  const handleMainImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files?.length) {
      return;
    }

    await runBusy("main-upload", async () => {
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
        imageMediaId: image.mediaId,
      }));
      const [mediaCount] = await Promise.all([fetchAdminMediaAssetCount()]);
      setMediaTotal(mediaCount);
      showStatus("success", "Gambar utama sudah diunggah. Simpan portofolio untuk menerapkan perubahan.");
    }).catch((error) => showStatus("danger", error instanceof Error ? error.message : "Unggah gambar utama gagal."));

    event.target.value = "";
  };

  const handleGalleryUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files?.length) {
      return;
    }

    await runBusy("gallery-upload", async () => {
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
        galleryImageIds: [...currentValues.galleryImageIds, ...images.map(() => "")],
        galleryMediaIds: [...currentValues.galleryMediaIds, ...images.map((image) => image.mediaId)],
      }));
      const [mediaCount] = await Promise.all([fetchAdminMediaAssetCount()]);
      setMediaTotal(mediaCount);
      showStatus("success", "Gambar galeri sudah diunggah. Simpan portofolio untuk menerapkan perubahan.");
    }).catch((error) => showStatus("danger", error instanceof Error ? error.message : "Unggah galeri gagal."));

    event.target.value = "";
  };

  const handleRemoveGalleryImage = async (index: number) => {
    const nextValues = {
      ...formValues,
      galleryUrls: formValues.galleryUrls.filter((_, imageIndex) => imageIndex !== index),
      galleryPaths: formValues.galleryPaths.filter((_, imageIndex) => imageIndex !== index),
      galleryImageIds: formValues.galleryImageIds.filter((_, imageIndex) => imageIndex !== index),
      galleryMediaIds: formValues.galleryMediaIds.filter((_, imageIndex) => imageIndex !== index),
    };

    await runBusy("gallery-delete", async () => {
      if (selectedItemId) {
        await updatePortfolioItem(selectedItemId, nextValues);
        const portfolioRows = await fetchAdminPortfolioItems();
        setItems(portfolioRows);
      }

      setFormValues(nextValues);
      showStatus("success", "Gambar galeri dilepas dari portofolio.");
    }).catch((error) => showStatus("danger", error instanceof Error ? error.message : "Gambar galeri tidak dapat dilepas."));
  };

  const moveGalleryImage = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= formValues.galleryUrls.length) {
      return;
    }

    const moveValue = <T,>(values: T[]) => {
      const nextValues = [...values];
      const [movedValue] = nextValues.splice(index, 1);

      nextValues.splice(nextIndex, 0, movedValue);
      return nextValues;
    };

    setFormValues((currentValues) => ({
      ...currentValues,
      galleryUrls: moveValue(currentValues.galleryUrls),
      galleryPaths: moveValue(currentValues.galleryPaths),
      galleryImageIds: moveValue(currentValues.galleryImageIds),
      galleryMediaIds: moveValue(currentValues.galleryMediaIds),
    }));
  };

  const handleSubmitPortfolio = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await runBusy("portfolio-save", async () => {
      const isEditing = Boolean(selectedItemId);
      const savedItem = selectedItemId
        ? await updatePortfolioItem(selectedItemId, formValues)
        : await createPortfolioItem(formValues);
      const [portfolioRows, mediaCount] = await Promise.all([fetchAdminPortfolioItems(), fetchAdminMediaAssetCount()]);

      resetFormState();
      setItems(portfolioRows);
      setMediaTotal(mediaCount);
      showStatus("success", isEditing ? "Portofolio berhasil diperbarui." : `Portofolio "${savedItem.title}" berhasil dibuat.`);
    }).catch((error) => showStatus("danger", error instanceof Error ? error.message : "Portofolio tidak dapat disimpan."));
  };

  const handleDeletePortfolio = async (row: PortfolioRow) => {
    const confirmed = window.confirm(`Hapus "${row.title}" dari portofolio? Media yang sudah diunggah tetap tersimpan di Media Library.`);

    if (!confirmed) {
      return;
    }

    await runBusy("portfolio-delete", async () => {
      await deletePortfolioItem(row);

      if (selectedItemId === row.id) {
        resetFormState();
      }

      const portfolioRows = await fetchAdminPortfolioItems();
      setItems(portfolioRows);
      showStatus("success", "Portofolio berhasil dihapus.");
    }).catch((error) => showStatus("danger", error instanceof Error ? error.message : "Portofolio tidak dapat dihapus."));
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

    await runBusy("portfolio-order", async () => {
      await updatePortfolioOrder(orderedItems);
      showStatus("success", "Urutan portofolio berhasil diperbarui.");
    }).catch(async (error) => {
      const portfolioRows = await fetchAdminPortfolioItems();
      setItems(portfolioRows);
      showStatus("danger", error instanceof Error ? error.message : "Urutan portofolio tidak dapat diperbarui.");
    });
  };

  const handleMediaUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files?.length) {
      return;
    }

    await runBusy("media-upload", async () => {
      await uploadMediaAssets(files, {
        section: "library",
        usageType: "general",
        label: "Media library",
        altText: "Media library",
      });
      setMediaPage(0);
      await loadMediaPage(0);
      showStatus("success", "Media berhasil diunggah.");
    }).catch((error) => showStatus("danger", error instanceof Error ? error.message : "Media tidak dapat diunggah."));

    event.target.value = "";
  };

  const handleDeleteMedia = async (row: MediaAssetRow) => {
    const confirmed = window.confirm(`Hapus media "${row.label}"? Media yang masih dipakai tidak akan bisa dihapus.`);

    if (!confirmed) {
      return;
    }

    await runBusy("media-delete", async () => {
      await deleteMediaAsset(row);
      await loadMediaPage(mediaPage);
      showStatus("success", "Media berhasil dihapus.");
    }).catch((error) => showStatus("danger", error instanceof Error ? error.message : "Media tidak dapat dihapus."));
  };

  const handleSiteAssetUpload = (assetKey: SiteAssetKey, label: string, section: string) => async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files?.length) {
      return;
    }

    await runBusy("asset-upload", async () => {
      const [media] = await uploadMediaAssets(files, {
        section,
        usageType: assetKey,
        label,
        altText: label,
      });

      await upsertSiteAsset(assetKey, media, {
        label,
        alt_text: label,
        section,
        usage_type: assetKey,
      });

      const [assetRows, mediaCount] = await Promise.all([fetchAdminSiteAssets(), fetchAdminMediaAssetCount()]);
      setSiteAssets(assetRows);
      setMediaTotal(mediaCount);
      showStatus("success", `${label} berhasil diperbarui.`);
    }).catch((error) => showStatus("danger", error instanceof Error ? error.message : `${label} tidak dapat diunggah.`));

    event.target.value = "";
  };

  const handleFounderPhotoUpload = handleSiteAssetUpload("founder_photo", "Foto profil Mufaddhol", "about");

  const updateContactLink =
    (index: number, field: keyof ContactLinkSetting) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const target = event.target;
      const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
      isContactDirtyRef.current = true;

      setContactLinks((currentLinks) =>
        currentLinks.map((link, linkIndex) =>
          linkIndex === index
            ? {
                ...link,
                [field]: value,
              }
            : link,
        ),
      );
    };

  const saveContactSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const invalidLink = contactLinks.find((link) => link.isActive && (!link.label.trim() || !link.value.trim() || !link.href.trim()));

    if (invalidLink) {
      showStatus("danger", "Link kontak aktif wajib memiliki label, teks tampil, dan URL.");
      return;
    }

    await runBusy("contact-save", async () => {
      await upsertSiteSetting(
        "contact_links",
        contactLinks.map((link, index) => ({
          ...link,
          sortOrder: index + 1,
        })),
      );
      isContactDirtyRef.current = false;
      showStatus("success", "Pengaturan kontak berhasil disimpan.");
    }).catch((error) => showStatus("danger", error instanceof Error ? error.message : "Kontak tidak dapat disimpan."));
  };

  const saveAboutProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await runBusy("profile-save", async () => {
      await upsertSiteSetting("about_profile", aboutProfile);
      isAboutDirtyRef.current = false;
      showStatus("success", "Profil berhasil disimpan.");
    }).catch((error) => showStatus("danger", error instanceof Error ? error.message : "Profil tidak dapat disimpan."));
  };

  const handleSignOut = async () => {
    await runBusy("logout", async () => {
      await signOut();
    }).catch((error) => showStatus("danger", error instanceof Error ? error.message : "Logout gagal."));
  };

  const changeMediaPage = async (page: number) => {
    const nextPage = Math.min(Math.max(page, 0), mediaPageCount - 1);
    setMediaPage(nextPage);
    await loadMediaPage(nextPage).catch((error) => showStatus("danger", error instanceof Error ? error.message : "Media tidak dapat dimuat."));
  };

  const renderStatusBadges = (item: PortfolioRow) => (
    <div className="flex flex-wrap gap-1.5">
      {item.is_home ? <StatusBadge tone="success">Beranda</StatusBadge> : null}
      {item.is_featured ? <StatusBadge tone="success">Unggulan</StatusBadge> : null}
      {item.is_published ? <StatusBadge tone="success">Terbit</StatusBadge> : <StatusBadge>Draf</StatusBadge>}
    </div>
  );

  return (
    <section className="min-h-screen bg-bg text-text lg:h-screen lg:overflow-hidden">
      {isSidebarOpen ? (
        <button
          type="button"
          aria-label="Tutup menu admin"
          className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}

      <div className="flex min-h-screen lg:h-screen">
        <aside
          className={cx(
            "fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-line bg-card shadow-lift transition-[width,transform] duration-300 lg:sticky lg:top-0 lg:z-20 lg:translate-x-0 lg:shadow-none",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
            isSidebarCollapsed ? "w-[5.5rem]" : "w-[18.5rem]",
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-line px-3.5">
            <div className={cx("min-w-0", isSidebarCollapsed && "lg:hidden")}>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.08em] text-muted">CMS privat</p>
              <p className="truncate text-[1rem] font-extrabold tracking-[-0.04em] text-text">FADD GRAPHICS</p>
            </div>
            <div className="flex items-center gap-2">
              <AdminShellButton
                type="button"
                variant="secondary"
                className="hidden h-10 w-10 px-0 lg:inline-flex"
                aria-label={isSidebarCollapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
                onClick={() => setIsSidebarCollapsed((currentValue) => !currentValue)}
              >
                {isSidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
              </AdminShellButton>
              <AdminShellButton
                type="button"
                variant="secondary"
                className="h-10 w-10 px-0 lg:hidden"
                aria-label="Tutup sidebar"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </AdminShellButton>
            </div>
          </div>

          <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsSidebarOpen(false);
                    }}
                    title={isSidebarCollapsed ? tab.label : undefined}
                    className={cx(
                      "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-[0.88rem] font-bold transition",
                      isActive ? "bg-text text-bg shadow-soft" : "text-muted hover:bg-surface hover:text-text",
                      isSidebarCollapsed && "lg:justify-center lg:px-0",
                    )}
                  >
                    <Icon className="h-[1.125rem] w-[1.125rem] shrink-0" />
                    <span className={cx("truncate", isSidebarCollapsed && "lg:hidden")}>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="border-t border-line p-3">
            <button
              type="button"
              onClick={() => void handleSignOut()}
              title={isSidebarCollapsed ? "Keluar" : undefined}
              className={cx(
                "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-[0.88rem] font-bold text-muted transition hover:bg-surface hover:text-text",
                isSidebarCollapsed && "lg:justify-center lg:px-0",
              )}
            >
              {busyKeys.has("logout") ? <Loader2 className="h-[1.125rem] w-[1.125rem] animate-spin" /> : <LogOut className="h-[1.125rem] w-[1.125rem]" />}
              <span className={cx(isSidebarCollapsed && "lg:hidden")}>Keluar</span>
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1 lg:h-screen lg:min-h-0 lg:overflow-y-auto">
          <header className="sticky top-0 z-30 border-b border-line bg-bg/95 backdrop-blur">
            <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-3 sm:px-6 xl:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <AdminShellButton type="button" variant="secondary" className="h-10 w-10 px-0 lg:hidden" aria-label="Buka menu admin" onClick={() => setIsSidebarOpen(true)}>
                  <Menu className="h-[1.125rem] w-[1.125rem]" />
                </AdminShellButton>
                <div className="min-w-0">
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.07em] text-muted">{tabs.find((tab) => tab.id === activeTab)?.label}</p>
                  <h1 className="truncate text-[1.35rem] font-extrabold tracking-[-0.045em] text-text sm:text-[1.7rem]">Dashboard admin</h1>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="hidden max-w-[15rem] truncate rounded-full border border-line bg-card px-3 py-2 text-[0.78rem] font-semibold text-muted sm:block">
                  {user?.email}
                </span>
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
              </div>
            </div>
          </header>

          <main className="px-4 py-5 sm:px-6 xl:px-8">
            <div className="w-full space-y-5">
              <div className="flex flex-col gap-3 rounded-2xl border border-line bg-card p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.07em] text-muted">Ruang kerja CMS</p>
                  <p className="mt-1 text-[0.92rem] leading-6 text-muted">
                    Kelola portofolio, media, identitas website, profil, dan kontak tanpa memuat ulang dashboard.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <AdminShellButton type="button" variant="primary" onClick={() => {
                    resetFormState();
                    setActiveTab("portofolio");
                  }}>
                    <Plus className="h-4 w-4" />
                    Portofolio baru
                  </AdminShellButton>
                  <label className="inline-flex min-h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-line bg-card px-3.5 py-2 text-[0.82rem] font-semibold text-text transition hover:border-accent/70 hover:text-accent">
                    <Upload className="h-4 w-4" />
                    Unggah media
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" multiple className="hidden" onChange={handleMediaUpload} />
                  </label>
                </div>
              </div>

              {status ? (
                <div className={cx(
                  "flex items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-[0.9rem] leading-6",
                  status.tone === "success" && "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                  status.tone === "danger" && "border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300",
                  status.tone === "normal" && "border-line bg-card text-muted",
                )}>
                  <span>{status.text}</span>
                  <button type="button" aria-label="Tutup pesan" className="text-current opacity-70 hover:opacity-100" onClick={() => setStatus(null)}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : null}

              {isInitialLoading ? (
                <SectionCard className="flex min-h-[22rem] items-center justify-center p-8">
                  <div className="flex items-center gap-3 text-[0.9rem] font-semibold text-muted">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Memuat data admin
                  </div>
                </SectionCard>
              ) : null}

              {!isInitialLoading && activeTab === "ringkasan" ? (
                <div className="space-y-5">
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
                    {[
                      ["Portofolio", stats.total],
                      ["Media", stats.media],
                      ["Beranda", stats.home],
                      ["Unggulan", stats.featured],
                      ["Terbit", stats.published],
                      ["Draf", stats.draft],
                    ].map(([label, value]) => (
                      <SectionCard key={label} className="p-4">
                        <p className="text-[0.72rem] font-bold uppercase tracking-[0.07em] text-muted">{label}</p>
                        <p className="mt-3 text-[2rem] font-black tracking-[-0.06em] text-text">{value}</p>
                      </SectionCard>
                    ))}
                  </div>

                  <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
                    <SectionCard className="p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[0.72rem] font-bold uppercase tracking-[0.07em] text-muted">Update terbaru</p>
                          <h2 className="mt-1 text-[1.25rem] font-extrabold tracking-[-0.04em] text-text">Aktivitas konten</h2>
                        </div>
                      </div>
                      <div className="mt-5 overflow-hidden rounded-xl border border-line">
                        {recentItems.length ? (
                          <div className="divide-y divide-line">
                            {recentItems.map((item) => (
                              <button key={item.id} type="button" className="grid w-full gap-3 bg-card p-4 text-left hover:bg-surface md:grid-cols-[1fr_auto] md:items-center" onClick={() => handleEdit(item)}>
                                <div className="min-w-0">
                                  <p className="truncate text-[0.95rem] font-bold text-text">{item.title}</p>
                                  <p className="mt-1 text-[0.78rem] text-muted">{formatDate(item.updated_at)}</p>
                                </div>
                                {renderStatusBadges(item)}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <EmptyState>Belum ada update portofolio.</EmptyState>
                        )}
                      </div>
                    </SectionCard>

                    <SectionCard className="p-5">
                      <p className="text-[0.72rem] font-bold uppercase tracking-[0.07em] text-muted">Aksi cepat</p>
                      <h2 className="mt-1 text-[1.25rem] font-extrabold tracking-[-0.04em] text-text">Mulai kerja</h2>
                      <div className="mt-5 grid gap-3">
                        <AdminShellButton type="button" variant="primary" className="justify-start" onClick={() => {
                          resetFormState();
                          setActiveTab("portofolio");
                        }}>
                          <Plus className="h-4 w-4" />
                          Tambah portofolio
                        </AdminShellButton>
                        <label className="inline-flex min-h-10 cursor-pointer items-center justify-start gap-2 rounded-xl border border-line bg-card px-3.5 py-2 text-[0.82rem] font-semibold text-text transition hover:border-accent/70 hover:text-accent">
                          <Upload className="h-4 w-4" />
                          Unggah aset visual
                          <input type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" multiple className="hidden" onChange={handleMediaUpload} />
                        </label>
                        <AdminShellButton type="button" variant="secondary" className="justify-start" onClick={() => setActiveTab("identitas")}>
                          <FileImage className="h-4 w-4" />
                          Kelola identitas website
                        </AdminShellButton>
                      </div>
                    </SectionCard>
                  </div>
                </div>
              ) : null}

              {!isInitialLoading && activeTab === "portofolio" ? (
                <div className="grid gap-5 2xl:grid-cols-[minmax(24rem,0.82fr)_minmax(0,1.18fr)]">
                  <SectionCard className="p-5">
                    <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-[0.72rem] font-bold uppercase tracking-[0.07em] text-muted">{selectedItemId ? "Mode edit" : "Mode buat"}</p>
                        <h2 className="mt-1 truncate text-[1.3rem] font-extrabold tracking-[-0.045em] text-text">{selectedItemId ? formValues.title || selectedItem?.title : "Portofolio baru"}</h2>
                      </div>
                      <AdminShellButton type="button" variant="secondary" onClick={resetFormState}>
                        <Plus className="h-4 w-4" />
                        Baru
                      </AdminShellButton>
                    </div>

                    <form className="mt-5 space-y-5" onSubmit={handleSubmitPortfolio}>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="space-y-2">
                          <FieldLabel>Judul</FieldLabel>
                          <input className="input-shell" value={formValues.title} onChange={updateField("title")} required />
                        </label>
                        <label className="space-y-2">
                          <FieldLabel>Slug</FieldLabel>
                          <input className="input-shell" value={formValues.slug} onChange={updateField("slug")} placeholder="otomatis dari judul" />
                        </label>
                        <label className="space-y-2">
                          <FieldLabel>Kategori</FieldLabel>
                          <select className="input-shell" value={formValues.category} onChange={updateField("category")}>
                            {categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}
                          </select>
                        </label>
                        <label className="space-y-2">
                          <FieldLabel>Tata letak</FieldLabel>
                          <select className="input-shell" value={formValues.layout} onChange={updateField("layout")}>
                            {layoutOptions.map((layout) => <option key={layout} value={layout}>{layout}</option>)}
                          </select>
                        </label>
                        <label className="space-y-2">
                          <FieldLabel>Hasil kerja</FieldLabel>
                          <input className="input-shell" value={formValues.deliverable} onChange={updateField("deliverable")} />
                        </label>
                        <label className="space-y-2">
                          <FieldLabel>Nuansa</FieldLabel>
                          <input className="input-shell" value={formValues.tone} onChange={updateField("tone")} />
                        </label>
                        <label className="space-y-2">
                          <FieldLabel>Label CTA</FieldLabel>
                          <input className="input-shell" value={formValues.ctaLabel} onChange={updateField("ctaLabel")} />
                        </label>
                        <label className="space-y-2">
                          <FieldLabel>Path detail</FieldLabel>
                          <input className="input-shell" value={formValues.detailPath} onChange={updateField("detailPath")} />
                        </label>
                        <label className="space-y-2 sm:col-span-2">
                          <FieldLabel>Fokus</FieldLabel>
                          <input className="input-shell" value={formValues.focus} onChange={updateField("focus")} />
                        </label>
                        <label className="space-y-2 sm:col-span-2">
                          <FieldLabel>Ringkasan</FieldLabel>
                          <textarea className="input-shell min-h-[104px] resize-none" value={formValues.summary} onChange={updateField("summary")} />
                        </label>
                        <label className="space-y-2 sm:col-span-2">
                          <FieldLabel>Tag</FieldLabel>
                          <input className="input-shell" value={formValues.tags} onChange={updateField("tags")} placeholder="Logo, Branding, Editorial" />
                        </label>
                        <label className="space-y-2">
                          <FieldLabel>Urutan</FieldLabel>
                          <input className="input-shell" type="number" value={formValues.sortOrder} onChange={updateField("sortOrder")} />
                        </label>
                        <div className="grid gap-2 rounded-xl border border-line bg-surface p-3">
                          {[
                            ["isHome", "Beranda"],
                            ["isFeatured", "Unggulan"],
                            ["isPublished", "Terbit"],
                          ].map(([field, label]) => (
                            <label key={field} className="flex min-h-9 items-center justify-between gap-3 text-[0.78rem] font-bold uppercase tracking-[0.06em] text-text">
                              <span>{label}</span>
                              <input type="checkbox" checked={Boolean(formValues[field as keyof PortfolioFormState])} onChange={updateField(field as keyof PortfolioFormState)} />
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-4 rounded-xl border border-line bg-surface p-4">
                        <div className="flex flex-wrap gap-2">
                          <label className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-line bg-card px-3.5 py-2 text-[0.82rem] font-semibold text-text transition hover:border-accent/70 hover:text-accent">
                            {busyKeys.has("main-upload") ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                            Gambar utama
                            <input key={`main-${formResetKey}`} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" className="hidden" onChange={handleMainImageUpload} />
                          </label>
                          <label className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-line bg-card px-3.5 py-2 text-[0.82rem] font-semibold text-text transition hover:border-accent/70 hover:text-accent">
                            {busyKeys.has("gallery-upload") ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                            Galeri
                            <input key={`gallery-${formResetKey}`} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" multiple className="hidden" onChange={handleGalleryUpload} />
                          </label>
                        </div>

                        {formValues.imageUrl ? (
                          <div className="overflow-hidden rounded-xl border border-line bg-card">
                            <img src={formValues.imageUrl} alt="" className="max-h-56 w-full object-contain" />
                          </div>
                        ) : (
                          <EmptyState>Belum ada gambar utama.</EmptyState>
                        )}

                        {formValues.galleryUrls.length ? (
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {formValues.galleryUrls.map((url, index) => (
                              <div key={`${url}-${index}`} className="relative overflow-hidden rounded-xl border border-line bg-card">
                                <img src={url} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
                                <div className="absolute inset-x-1.5 top-1.5 flex justify-between gap-1">
                                  <button type="button" aria-label="Pindah kiri" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/75 text-white hover:bg-accent" onClick={() => moveGalleryImage(index, -1)}>
                                    <ChevronLeft className="h-4 w-4" />
                                  </button>
                                  <button type="button" aria-label="Pindah kanan" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/75 text-white hover:bg-accent" onClick={() => moveGalleryImage(index, 1)}>
                                    <ChevronRight className="h-4 w-4" />
                                  </button>
                                </div>
                                <button type="button" aria-label="Lepas gambar galeri" className="absolute bottom-1.5 right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/75 text-white hover:bg-red-600" onClick={() => void handleRemoveGalleryImage(index)}>
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      <AdminShellButton type="submit" variant="primary" className="w-full" disabled={busyKeys.has("portfolio-save")}>
                        {busyKeys.has("portfolio-save") ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {selectedItemId ? "Simpan perubahan" : "Buat portofolio"}
                      </AdminShellButton>
                    </form>
                  </SectionCard>

                  <SectionCard className="p-5">
                    <div className="flex flex-col gap-3 border-b border-line pb-4 xl:flex-row xl:items-end xl:justify-between">
                      <div>
                        <p className="text-[0.72rem] font-bold uppercase tracking-[0.07em] text-muted">Daftar portofolio</p>
                        <h2 className="mt-1 text-[1.3rem] font-extrabold tracking-[-0.045em] text-text">{filteredItems.length} item tampil</h2>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-[minmax(12rem,1fr)_10rem_10rem] xl:w-[38rem]">
                        <label className="relative">
                          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                          <input className="input-shell pl-9" value={portfolioSearch} onChange={(event) => setPortfolioSearch(event.target.value)} placeholder="Cari judul, slug, kategori" />
                        </label>
                        <select className="input-shell" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                          <option value="semua">Semua kategori</option>
                          {categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}
                        </select>
                        <select className="input-shell" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as PortfolioStatusFilter)}>
                          <option value="semua">Semua status</option>
                          <option value="beranda">Beranda</option>
                          <option value="unggulan">Unggulan</option>
                          <option value="terbit">Terbit</option>
                          <option value="draf">Draf</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-4 overflow-hidden rounded-xl border border-line">
                      {filteredItems.length ? (
                        <div className="divide-y divide-line">
                          {filteredItems.map((item) => {
                            const absoluteIndex = items.findIndex((candidate) => candidate.id === item.id);

                            return (
                              <article key={item.id} className={cx("grid gap-4 bg-card p-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center", selectedItemId === item.id && "bg-surface")}>
                                <div className="flex min-w-0 gap-4">
                                  {item.image_url ? <img src={item.image_url} alt="" className="h-20 w-28 shrink-0 rounded-xl object-cover" loading="lazy" /> : <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-muted"><Image className="h-5 w-5" /></div>}
                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <StatusBadge>{item.category}</StatusBadge>
                                      {renderStatusBadges(item)}
                                    </div>
                                    <h3 className="mt-2 truncate text-[1rem] font-extrabold tracking-[-0.035em] text-text">{item.title}</h3>
                                    <p className="mt-1 truncate text-[0.82rem] text-muted">{item.slug}</p>
                                    <p className="mt-1 text-[0.76rem] text-muted">Diperbarui {formatDate(item.updated_at)}</p>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2 xl:justify-end">
                                  <AdminShellButton type="button" variant="secondary" onClick={() => handleEdit(item)}><SquarePen className="h-4 w-4" />Edit</AdminShellButton>
                                  <AdminShellButton type="button" variant="secondary" onClick={() => void handleMoveItem(absoluteIndex, -1)} disabled={absoluteIndex <= 0}><ArrowUp className="h-4 w-4" />Naik</AdminShellButton>
                                  <AdminShellButton type="button" variant="secondary" onClick={() => void handleMoveItem(absoluteIndex, 1)} disabled={absoluteIndex < 0 || absoluteIndex === items.length - 1}><ArrowDown className="h-4 w-4" />Turun</AdminShellButton>
                                  <AdminShellButton type="button" variant="danger" onClick={() => void handleDeletePortfolio(item)}><Trash2 className="h-4 w-4" />Hapus</AdminShellButton>
                                </div>
                              </article>
                            );
                          })}
                        </div>
                      ) : (
                        <EmptyState>Tidak ada portofolio yang sesuai filter.</EmptyState>
                      )}
                    </div>
                  </SectionCard>
                </div>
              ) : null}

              {!isInitialLoading && activeTab === "media" ? (
                <SectionCard className="p-5">
                  <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[0.72rem] font-bold uppercase tracking-[0.07em] text-muted">Media Library</p>
                      <h2 className="mt-1 text-[1.3rem] font-extrabold tracking-[-0.045em] text-text">{mediaTotal} aset visual</h2>
                    </div>
                    <label className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-text bg-text px-3.5 py-2 text-[0.82rem] font-semibold text-bg transition hover:bg-accent hover:text-white">
                      {busyKeys.has("media-upload") ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      Unggah media
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" multiple className="hidden" onChange={handleMediaUpload} />
                    </label>
                  </div>

                  <div className="mt-5">
                    {busyKeys.has("media-load") ? (
                      <div className="flex min-h-48 items-center justify-center text-[0.9rem] font-semibold text-muted"><Loader2 className="mr-2 h-5 w-5 animate-spin" />Memuat media</div>
                    ) : mediaAssets.length ? (
                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {mediaAssets.map((media) => (
                          <article key={media.id} className="overflow-hidden rounded-xl border border-line bg-surface">
                            <div className="border-b border-line bg-card">
                              <img src={media.url} alt={media.alt_text || media.label} className="aspect-[4/3] w-full object-contain" loading="lazy" />
                            </div>
                            <div className="grid gap-2 p-3">
                              <p className="truncate text-[0.9rem] font-bold text-text">{media.label}</p>
                              <div className="grid gap-1 text-[0.76rem] text-muted">
                                <p className="truncate">{media.section} / {media.usage_type}</p>
                                <p className="truncate">{media.mime_type || "-"} / {formatBytes(media.size_bytes)}</p>
                                <p className="truncate">{media.path}</p>
                                <p>{formatDate(media.created_at)}</p>
                              </div>
                              <AdminShellButton type="button" variant="danger" className="mt-1 w-full" onClick={() => void handleDeleteMedia(media)} disabled={busyKeys.has("media-delete")}>
                                <Trash2 className="h-4 w-4" />
                                Hapus jika tidak dipakai
                              </AdminShellButton>
                            </div>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <EmptyState>Belum ada media.</EmptyState>
                    )}
                  </div>

                  <div className="mt-5 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[0.82rem] font-semibold text-muted">Halaman {mediaPage + 1} dari {mediaPageCount}</p>
                    <div className="flex gap-2">
                      <AdminShellButton type="button" variant="secondary" className="h-10 w-10 px-0" onClick={() => void changeMediaPage(0)} disabled={mediaPage === 0}><ChevronsLeft className="h-4 w-4" /></AdminShellButton>
                      <AdminShellButton type="button" variant="secondary" className="h-10 w-10 px-0" onClick={() => void changeMediaPage(mediaPage - 1)} disabled={mediaPage === 0}><ChevronLeft className="h-4 w-4" /></AdminShellButton>
                      <AdminShellButton type="button" variant="secondary" className="h-10 w-10 px-0" onClick={() => void changeMediaPage(mediaPage + 1)} disabled={mediaPage >= mediaPageCount - 1}><ChevronRight className="h-4 w-4" /></AdminShellButton>
                      <AdminShellButton type="button" variant="secondary" className="h-10 w-10 px-0" onClick={() => void changeMediaPage(mediaPageCount - 1)} disabled={mediaPage >= mediaPageCount - 1}><ChevronsRight className="h-4 w-4" /></AdminShellButton>
                    </div>
                  </div>
                </SectionCard>
              ) : null}

              {!isInitialLoading && activeTab === "identitas" ? (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {siteAssetSlots.map((slot) => {
                    const asset = getAssetByKey(siteAssets, slot.key);

                    return (
                      <SectionCard key={slot.key} className="p-5">
                        <p className="text-[0.72rem] font-bold uppercase tracking-[0.07em] text-muted">{slot.label}</p>
                        <p className="mt-2 min-h-10 text-[0.88rem] leading-5 text-muted">{slot.description}</p>
                        <div className="mt-4 overflow-hidden rounded-xl border border-line bg-surface">
                          {asset?.url ? <img src={asset.url} alt={asset.alt_text || slot.label} className="max-h-44 w-full object-contain p-4" loading="lazy" /> : <div className="flex min-h-[11rem] items-center justify-center px-5 text-center text-[0.9rem] text-muted">Belum diatur.</div>}
                        </div>
                        {asset ? (
                          <div className="mt-3 grid gap-1 text-[0.75rem] text-muted">
                            <p className="truncate">{asset.path}</p>
                            <p>Diperbarui {formatDate(asset.updated_at)}</p>
                          </div>
                        ) : null}
                        <label className="mt-4 inline-flex min-h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-line bg-card px-3.5 py-2 text-[0.82rem] font-semibold text-text transition hover:border-accent/70 hover:text-accent">
                          {busyKeys.has("asset-upload") ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                          Ganti aset
                          <input type="file" accept={slot.accept} className="hidden" onChange={handleSiteAssetUpload(slot.key, slot.label, slot.section)} />
                        </label>
                      </SectionCard>
                    );
                  })}
                </div>
              ) : null}

              {!isInitialLoading && activeTab === "profil" ? (
                <div className="grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
                  <SectionCard className="p-5">
                    <p className="text-[0.72rem] font-bold uppercase tracking-[0.07em] text-muted">Foto profil</p>
                    <div className="mt-4 overflow-hidden rounded-xl border border-line bg-surface">
                      {siteAssetMap.founder_photo?.url ? <img src={siteAssetMap.founder_photo.url} alt="Foto profil" className="aspect-[4/5] w-full object-cover" loading="lazy" /> : <div className="flex aspect-[4/5] items-center justify-center px-6 text-center text-[0.92rem] text-muted">Belum ada foto profil.</div>}
                    </div>
                    <label className="mt-4 inline-flex min-h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-line bg-card px-3.5 py-2 text-[0.82rem] font-semibold text-text transition hover:border-accent/70 hover:text-accent">
                      {busyKeys.has("asset-upload") ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      Ganti foto profil
                      <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFounderPhotoUpload} />
                    </label>
                  </SectionCard>

                  <SectionCard className="p-5">
                    <form onSubmit={saveAboutProfile}>
                      <div className="border-b border-line pb-4">
                        <p className="text-[0.72rem] font-bold uppercase tracking-[0.07em] text-muted">Data profil</p>
                        <h2 className="mt-1 text-[1.3rem] font-extrabold tracking-[-0.045em] text-text">Informasi About</h2>
                      </div>
                      <div className="mt-5 grid gap-4">
                        <label className="space-y-2">
                          <FieldLabel>Nama</FieldLabel>
                          <input className="input-shell" value={aboutProfile.name} onChange={(event) => {
                            isAboutDirtyRef.current = true;
                            setAboutProfile((profile) => ({ ...profile, name: event.target.value }));
                          }} />
                        </label>
                        <label className="space-y-2">
                          <FieldLabel>Peran</FieldLabel>
                          <input className="input-shell" value={aboutProfile.role} onChange={(event) => {
                            isAboutDirtyRef.current = true;
                            setAboutProfile((profile) => ({ ...profile, role: event.target.value }));
                          }} />
                        </label>
                        <label className="space-y-2">
                          <FieldLabel>Bio singkat</FieldLabel>
                          <textarea className="input-shell min-h-[104px] resize-none" value={aboutProfile.shortBio} onChange={(event) => {
                            isAboutDirtyRef.current = true;
                            setAboutProfile((profile) => ({ ...profile, shortBio: event.target.value }));
                          }} />
                        </label>
                        <label className="space-y-2">
                          <FieldLabel>Bio detail</FieldLabel>
                          <textarea className="input-shell min-h-[148px] resize-none" value={aboutProfile.detailBio} onChange={(event) => {
                            isAboutDirtyRef.current = true;
                            setAboutProfile((profile) => ({ ...profile, detailBio: event.target.value }));
                          }} />
                        </label>
                      </div>
                      <AdminShellButton type="submit" variant="primary" className="mt-5 w-full" disabled={busyKeys.has("profile-save")}>
                        {busyKeys.has("profile-save") ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Simpan profil
                      </AdminShellButton>
                    </form>
                  </SectionCard>
                </div>
              ) : null}

              {!isInitialLoading && activeTab === "kontak" ? (
                <SectionCard className="p-5">
                  <form onSubmit={saveContactSettings}>
                    <div className="flex flex-col gap-2 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-[0.72rem] font-bold uppercase tracking-[0.07em] text-muted">Kontak publik</p>
                        <h2 className="mt-1 text-[1.3rem] font-extrabold tracking-[-0.045em] text-text">Link yang tampil di website</h2>
                      </div>
                      <AdminShellButton type="submit" variant="primary" disabled={busyKeys.has("contact-save")}>
                        {busyKeys.has("contact-save") ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Simpan kontak
                      </AdminShellButton>
                    </div>
                    <div className="mt-5 grid gap-3">
                      {contactLinks.map((link, index) => (
                        <article key={`${link.type}-${index}`} className="grid gap-3 rounded-xl border border-line bg-surface p-4 xl:grid-cols-[0.85fr_1fr_1.4fr_0.8fr_auto] xl:items-center">
                          <input className="input-shell" value={link.label} onChange={updateContactLink(index, "label")} placeholder="Label" />
                          <input className="input-shell" value={link.value} onChange={updateContactLink(index, "value")} placeholder="Teks tampil" />
                          <input className="input-shell" value={link.href} onChange={updateContactLink(index, "href")} placeholder="URL" />
                          <select className="input-shell" value={link.type} onChange={updateContactLink(index, "type")}>
                            {["whatsapp", "email", "instagram", "linkedin", "other"].map((type) => <option key={type} value={type}>{type}</option>)}
                          </select>
                          <label className="flex min-h-11 items-center justify-between gap-3 rounded-xl border border-line bg-card px-4 py-3 text-[0.78rem] font-bold uppercase tracking-[0.06em] text-text">
                            Aktif
                            <input type="checkbox" checked={link.isActive} onChange={updateContactLink(index, "isActive")} />
                          </label>
                        </article>
                      ))}
                    </div>
                  </form>
                </SectionCard>
              ) : null}

              {!isInitialLoading && activeTab === "pengaturan" ? (
                <div className="grid gap-5 xl:grid-cols-3">
                  {[
                    ["Storage", "Semua gambar baru disimpan di bucket site-media dan metadata disimpan di tabel media_assets."],
                    ["Portofolio", "Metadata karya berada di portfolio_items. Gambar utama dan galeri disinkronkan melalui portfolio_images."],
                    ["Keamanan", "Media yang masih dipakai oleh website atau portofolio tidak bisa dihapus dari Media Library."],
                    ["Operasional", "Gunakan tombol Baru untuk memulai item baru. Mode edit hanya memperbarui item yang sedang dipilih."],
                    ["Publikasi", "Beranda, Unggulan, dan Terbit dapat diaktifkan secara terpisah untuk setiap portofolio."],
                    ["Performa", "Media Library dimuat per halaman agar dashboard tetap ringan saat aset bertambah banyak."],
                  ].map(([title, text]) => (
                    <SectionCard key={title} className="p-5">
                      <p className="text-[0.72rem] font-bold uppercase tracking-[0.07em] text-muted">{title}</p>
                      <p className="mt-3 text-[0.92rem] leading-6 text-muted">{text}</p>
                    </SectionCard>
                  ))}
                </div>
              ) : null}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboardPage;
