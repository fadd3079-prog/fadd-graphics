import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Image,
  LayoutDashboard,
  Link as LinkIcon,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Save,
  Settings,
  SquarePen,
  Trash2,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { useTheme } from "../hooks/useTheme";
import { useUiLoading } from "../components/UiLoadingProvider";
import ThemeToggle from "../components/ThemeToggle";
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

const defaultContactLinks: ContactLinkSetting[] = [
  { label: "WhatsApp", value: "+62 831 5096 4050", href: "https://wa.me/6283150964050", type: "whatsapp", isActive: true, sortOrder: 1 },
  { label: "Email", value: "faddgraphics@gmail.com", href: "mailto:faddgraphics@gmail.com", type: "email", isActive: true, sortOrder: 2 },
  { label: "Instagram", value: "@fadd_graphics", href: "https://instagram.com/fadd_graphics", type: "instagram", isActive: true, sortOrder: 3 },
  { label: "LinkedIn", value: "Mufaddhol", href: "https://www.linkedin.com/in/mufaddhol-01b60333a/", type: "linkedin", isActive: true, sortOrder: 4 },
];

const defaultAboutProfile: AboutProfileSetting = {
  name: "Mufaddhol",
  role: "Founder of FADD GRAPHICS / Freelance Graphic Designer",
  shortBio: "",
  detailBio: "",
};

const siteAssetSlots: { key: SiteAssetKey; label: string; description: string; section: string }[] = [
  { key: "header_logo_light", label: "Logo header terang", description: "Dipakai di header mode terang.", section: "identity" },
  { key: "header_logo_dark", label: "Logo header gelap", description: "Dipakai di header mode gelap.", section: "identity" },
  { key: "footer_logo_light", label: "Logo footer terang", description: "Dipakai di footer mode terang.", section: "identity" },
  { key: "footer_logo_dark", label: "Logo footer gelap", description: "Dipakai di footer mode gelap.", section: "identity" },
  { key: "favicon", label: "Favicon", description: "Ikon kecil pada tab browser.", section: "identity" },
  { key: "og_image", label: "OG / social preview", description: "Gambar preview saat link dibagikan.", section: "identity" },
];

function getSettingValue<T>(settings: SiteSettingRow[], key: string, fallback: T): T {
  const setting = settings.find((item) => item.setting_key === key);

  return setting?.setting_value ? (setting.setting_value as T) : fallback;
}

function getAssetByKey(assets: SiteAssetRow[], key: SiteAssetKey) {
  return assets.find((asset) => asset.asset_key === key && asset.is_active);
}

function AdminDashboardPage() {
  const { user, signOut } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
  const { beginLoading } = useUiLoading();
  const [activeTab, setActiveTab] = useState<AdminTab>("ringkasan");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [items, setItems] = useState<PortfolioRow[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAssetRow[]>([]);
  const [siteAssets, setSiteAssets] = useState<SiteAssetRow[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<PortfolioFormState>(() => createDefaultPortfolioFormState());
  const [formResetKey, setFormResetKey] = useState(0);
  const [contactLinks, setContactLinks] = useState<ContactLinkSetting[]>(defaultContactLinks);
  const [aboutProfile, setAboutProfile] = useState<AboutProfileSetting>(defaultAboutProfile);
  const formSessionRef = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");

  const siteAssetMap = useMemo(
    () => Object.fromEntries(siteAssets.map((asset) => [asset.asset_key, asset])),
    [siteAssets],
  ) as Record<string, SiteAssetRow | undefined>;
  const activeTabData = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setStatus("");
    const endLoading = beginLoading();

    try {
      const [portfolioRows, mediaRows, assetRows, settingRows] = await Promise.all([
        fetchAdminPortfolioItems(),
        fetchAdminMediaAssets(),
        fetchAdminSiteAssets(),
        fetchAdminSiteSettings(),
      ]);

      setItems(portfolioRows);
      setMediaAssets(mediaRows);
      setSiteAssets(assetRows);
      setContactLinks(getSettingValue(settingRows, "contact_links", defaultContactLinks));
      setAboutProfile(getSettingValue(settingRows, "about_profile", defaultAboutProfile));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Dashboard tidak dapat dimuat.");
    } finally {
      setIsLoading(false);
      endLoading();
    }
  }, [beginLoading]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

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
    setActiveTab("portofolio");
  };

  const handleMainImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files?.length) {
      return;
    }

    const endLoading = beginLoading();

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
        imageMediaId: image.mediaId,
      }));
      await loadDashboard();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unggah gambar utama gagal.");
    } finally {
      event.target.value = "";
      endLoading();
    }
  };

  const handleGalleryUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files?.length) {
      return;
    }

    const endLoading = beginLoading();

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
        galleryImageIds: [...currentValues.galleryImageIds, ...images.map(() => "")],
        galleryMediaIds: [...currentValues.galleryMediaIds, ...images.map((image) => image.mediaId)],
      }));
      await loadDashboard();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unggah galeri gagal.");
    } finally {
      event.target.value = "";
      endLoading();
    }
  };

  const handleRemoveGalleryImage = async (index: number) => {
    const nextValues = {
      ...formValues,
      galleryUrls: formValues.galleryUrls.filter((_, imageIndex) => imageIndex !== index),
      galleryPaths: formValues.galleryPaths.filter((_, imageIndex) => imageIndex !== index),
      galleryImageIds: formValues.galleryImageIds.filter((_, imageIndex) => imageIndex !== index),
      galleryMediaIds: formValues.galleryMediaIds.filter((_, imageIndex) => imageIndex !== index),
    };

    setIsSaving(true);
    setStatus("");
    const endLoading = beginLoading();

    try {
      if (selectedItemId) {
        await updatePortfolioItem(selectedItemId, nextValues);
        await loadDashboard();
      }

      setFormValues(nextValues);
      setStatus("Gambar galeri dilepas dari portofolio.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Gambar galeri tidak dapat dilepas.");
    } finally {
      setIsSaving(false);
      endLoading();
    }
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setStatus("");
    const endLoading = beginLoading();

    try {
      const isEditing = Boolean(selectedItemId);
      const savedItem = selectedItemId
        ? await updatePortfolioItem(selectedItemId, formValues)
        : await createPortfolioItem(formValues);

      resetForm();
      await loadDashboard();
      setStatus(isEditing ? "Portofolio berhasil diperbarui." : `Portofolio "${savedItem.title}" berhasil dibuat.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Portofolio tidak dapat disimpan.");
    } finally {
      setIsSaving(false);
      endLoading();
    }
  };

  const handleDelete = async (row: PortfolioRow) => {
    const confirmed = window.confirm(`Hapus "${row.title}" dari portofolio? Media yang sudah diunggah tetap tersimpan di Media Library.`);

    if (!confirmed) {
      return;
    }

    setStatus("");
    const endLoading = beginLoading();

    try {
      await deletePortfolioItem(row);
      await loadDashboard();
      setStatus("Portofolio berhasil dihapus.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Portofolio tidak dapat dihapus.");
    } finally {
      endLoading();
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
    const endLoading = beginLoading();

    try {
      await updatePortfolioOrder(orderedItems);
      setStatus("Urutan portofolio berhasil diperbarui.");
    } catch (error) {
      await loadDashboard();
      setStatus(error instanceof Error ? error.message : "Urutan portofolio tidak dapat diperbarui.");
    } finally {
      endLoading();
    }
  };

  const handleMediaUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files?.length) {
      return;
    }

    const endLoading = beginLoading();

    try {
      await uploadMediaAssets(files, {
        section: "library",
        usageType: "general",
        label: "Media library",
        altText: "Media library",
      });
      await loadDashboard();
      setStatus("Media berhasil diupload.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Media tidak dapat diupload.");
    } finally {
      event.target.value = "";
      endLoading();
    }
  };

  const handleDeleteMedia = async (row: MediaAssetRow) => {
    const confirmed = window.confirm(`Hapus media "${row.label}"?`);

    if (!confirmed) {
      return;
    }

    const endLoading = beginLoading();

    try {
      await deleteMediaAsset(row);
      await loadDashboard();
      setStatus("Media berhasil dihapus.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Media tidak dapat dihapus.");
    } finally {
      endLoading();
    }
  };

  const handleSiteAssetUpload = (assetKey: SiteAssetKey, label: string, section: string) => async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files?.length) {
      return;
    }

    const endLoading = beginLoading();

    try {
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
      await loadDashboard();
      setStatus(`${label} berhasil diperbarui.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : `${label} tidak dapat diupload.`);
    } finally {
      event.target.value = "";
      endLoading();
    }
  };

  const handleFounderPhotoUpload = handleSiteAssetUpload("founder_photo", "Foto profil Mufaddhol", "about");

  const updateContactLink =
    (index: number, field: keyof ContactLinkSetting) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const target = event.target;
      const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;

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
    setIsSaving(true);
    const endLoading = beginLoading();

    try {
      await upsertSiteSetting(
        "contact_links",
        contactLinks.map((link, index) => ({
          ...link,
          sortOrder: index + 1,
        })),
      );
      await loadDashboard();
      setStatus("Pengaturan kontak berhasil disimpan.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Kontak tidak dapat disimpan.");
    } finally {
      setIsSaving(false);
      endLoading();
    }
  };

  const saveAboutProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    const endLoading = beginLoading();

    try {
      await upsertSiteSetting("about_profile", aboutProfile);
      await loadDashboard();
      setStatus("Profil berhasil disimpan.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Profil tidak dapat disimpan.");
    } finally {
      setIsSaving(false);
      endLoading();
    }
  };

  const handleSignOut = async () => {
    const endLoading = beginLoading();

    try {
      await signOut();
    } finally {
      endLoading();
    }
  };

  return (
    <section className="min-h-screen bg-bg lg:h-screen lg:overflow-hidden">
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
          className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[18rem] flex-col overflow-hidden border-r border-line bg-card shadow-lift transition-transform duration-300 lg:sticky lg:top-0 lg:z-20 lg:translate-x-0 lg:shadow-none ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } ${isSidebarCollapsed ? "lg:w-[5.5rem]" : "lg:w-[18rem]"}`}
        >
          <div className="flex h-16 items-center justify-between border-b border-line px-4">
            <div className={`min-w-0 ${isSidebarCollapsed ? "lg:hidden" : ""}`}>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.045em] text-muted">CMS privat</p>
              <p className="truncate text-[0.98rem] font-bold tracking-[-0.035em] text-text">FADD GRAPHICS</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={isSidebarCollapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
                className="hidden h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-text hover:border-accent/60 hover:text-accent lg:flex"
                onClick={() => setIsSidebarCollapsed((currentValue) => !currentValue)}
              >
                {isSidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
              </button>
              <button
                type="button"
                aria-label="Tutup sidebar"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-text hover:border-accent/60 hover:text-accent lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
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
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-[0.9rem] font-semibold ${
                    isActive ? "bg-text text-bg shadow-soft" : "text-muted hover:bg-surface hover:text-text"
                  } ${isSidebarCollapsed ? "lg:justify-center lg:px-0" : ""}`}
                  title={isSidebarCollapsed ? tab.label : undefined}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  <span className={isSidebarCollapsed ? "lg:hidden" : ""}>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="border-t border-line p-3">
            <button
              type="button"
              className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-[0.9rem] font-semibold text-muted hover:bg-surface hover:text-text ${
                isSidebarCollapsed ? "lg:justify-center lg:px-0" : ""
              }`}
              onClick={handleSignOut}
              title={isSidebarCollapsed ? "Keluar" : undefined}
            >
              <LogOut className="h-4.5 w-4.5 shrink-0" />
              <span className={isSidebarCollapsed ? "lg:hidden" : ""}>Keluar</span>
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1 lg:h-screen lg:min-h-0 lg:overflow-y-auto">
          <header className="sticky top-0 z-30 border-b border-line bg-bg">
            <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-3 sm:px-6 xl:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  aria-label="Buka menu admin"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-card text-text hover:border-accent/60 hover:text-accent lg:hidden"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <Menu className="h-4.5 w-4.5" />
                </button>
                <div className="min-w-0">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.045em] text-muted">{activeTabData.label}</p>
                  <h1 className="truncate text-[1.45rem] font-bold leading-tight tracking-[-0.045em] text-text sm:text-[1.75rem]">
                    Dashboard admin
                  </h1>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="hidden max-w-[16rem] truncate rounded-full border border-line bg-card px-3.5 py-2 text-[0.78rem] font-semibold text-muted sm:block">
                  {user?.email}
                </span>
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
              </div>
            </div>
          </header>

          <main className="px-4 py-5 sm:px-6 sm:py-6 xl:px-8 2xl:px-10">
            <div className="mx-auto w-full max-w-[1720px]">
              <div className="mb-6 rounded-3xl border border-line bg-card px-5 py-4 shadow-soft sm:px-6">
                <p className="admin-kicker">Dashboard privat</p>
                <p className="mt-1 text-[0.94rem] leading-6 text-muted">
                  Kelola portofolio, media, identitas visual website, profil, dan kontak dari satu tempat.
                </p>
              </div>

              {status ? (
                <p className="mb-6 rounded-2xl border border-line bg-card px-4 py-3 text-[0.92rem] leading-6 text-muted">
                  {status}
                </p>
              ) : null}

              <div className="min-w-0">
          {activeTab === "ringkasan" ? (
            <div className="grid gap-5">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { label: "Total portofolio", value: items.length },
                  { label: "Media tersimpan", value: mediaAssets.length },
                  { label: "Aset identitas aktif", value: siteAssets.filter((asset) => asset.is_active).length },
                ].map((card) => (
                  <article key={card.label} className="admin-panel rounded-[1.45rem] p-5">
                    <p className="editorial-note">{card.label}</p>
                    <p className="mt-4 text-[2.4rem] font-extrabold tracking-[-0.06em] text-text">{card.value}</p>
                  </article>
                ))}
              </div>
              <div className="admin-panel rounded-[1.6rem] p-5 sm:p-6">
                <p className="editorial-note">Status konten</p>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <p className="rounded-[1rem] border border-line bg-surface p-4 text-[0.92rem] leading-6 text-muted">
                    Beranda: {items.filter((item) => item.is_home).length} item tampil di highlight halaman utama.
                  </p>
                  <p className="rounded-[1rem] border border-line bg-surface p-4 text-[0.92rem] leading-6 text-muted">
                    Unggulan: {items.filter((item) => item.is_featured).length} item dipakai sebagai karya pilihan.
                  </p>
                  <p className="rounded-[1rem] border border-line bg-surface p-4 text-[0.92rem] leading-6 text-muted">
                    Terbit: {items.filter((item) => item.is_published).length} item tampil di halaman portofolio.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "portofolio" ? (
            <div className="grid gap-6 2xl:grid-cols-[0.95fr_1.05fr]">
              <form className="admin-panel rounded-[1.6rem] p-5 sm:p-6" onSubmit={handleSubmit}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="editorial-note">{selectedItemId ? "Edit portofolio" : "Portofolio baru"}</p>
                    <h2 className="mt-2 text-[1.45rem] font-bold tracking-[-0.045em] text-text">
                      {selectedItemId ? formValues.title : "Tambah item"}
                    </h2>
                  </div>
                  <button type="button" className="button-secondary" onClick={resetForm}>
                    <Plus className="h-4 w-4" />
                    Baru
                  </button>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-text">
                    <span>Judul</span>
                    <input className="input-shell" value={formValues.title} onChange={updateField("title")} required />
                  </label>
                  <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-text">
                    <span>Slug</span>
                    <input className="input-shell" value={formValues.slug} onChange={updateField("slug")} placeholder="otomatis dari judul" />
                  </label>
                  <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-text">
                    <span>Kategori</span>
                    <select className="input-shell" value={formValues.category} onChange={updateField("category")}>
                      {categoryOptions.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-text">
                    <span>Tata letak</span>
                    <select className="input-shell" value={formValues.layout} onChange={updateField("layout")}>
                      {layoutOptions.map((layout) => (
                        <option key={layout} value={layout}>{layout}</option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-text">
                    <span>Hasil kerja</span>
                    <input className="input-shell" value={formValues.deliverable} onChange={updateField("deliverable")} />
                  </label>
                  <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-text">
                    <span>Nuansa</span>
                    <input className="input-shell" value={formValues.tone} onChange={updateField("tone")} />
                  </label>
                  <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-text">
                    <span>Label CTA</span>
                    <input className="input-shell" value={formValues.ctaLabel} onChange={updateField("ctaLabel")} />
                  </label>
                  <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-text">
                    <span>Path detail</span>
                    <input className="input-shell" value={formValues.detailPath} onChange={updateField("detailPath")} />
                  </label>
                  <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-text sm:col-span-2">
                    <span>Fokus</span>
                    <input className="input-shell" value={formValues.focus} onChange={updateField("focus")} />
                  </label>
                  <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-text sm:col-span-2">
                    <span>Ringkasan</span>
                    <textarea className="input-shell min-h-[110px] resize-none" value={formValues.summary} onChange={updateField("summary")} />
                  </label>
                  <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-text sm:col-span-2">
                    <span>Tag</span>
                    <input className="input-shell" value={formValues.tags} onChange={updateField("tags")} placeholder="Logo, Branding, Editorial" />
                  </label>
                  <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-text">
                    <span>Urutan</span>
                    <input className="input-shell" type="number" value={formValues.sortOrder} onChange={updateField("sortOrder")} />
                  </label>
                  <div className="grid gap-3 rounded-[1.1rem] border border-line bg-surface p-4">
                    {[
                      ["isHome", "Beranda"],
                      ["isFeatured", "Unggulan"],
                      ["isPublished", "Terbit"],
                    ].map(([field, label]) => (
                      <label key={field} className="flex items-center justify-between gap-4 text-[0.82rem] font-semibold uppercase tracking-[0.06em] text-text">
                        <span>{label}</span>
                        <input type="checkbox" checked={Boolean(formValues[field as keyof PortfolioFormState])} onChange={updateField(field as keyof PortfolioFormState)} />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 rounded-[1.2rem] border border-line bg-surface p-4">
                  <label className="button-secondary cursor-pointer justify-center">
                    <Upload className="h-4 w-4" />
                    Unggah gambar utama
                    <input key={`main-${formResetKey}`} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" className="hidden" onChange={handleMainImageUpload} />
                  </label>
                  {formValues.imageUrl ? (
                    <img src={formValues.imageUrl} alt="" className="max-h-48 w-full rounded-[1rem] object-contain" />
                  ) : (
                    <p className="rounded-[1rem] border border-line bg-card px-4 py-4 text-center text-[0.9rem] leading-6 text-muted">Belum ada gambar utama.</p>
                  )}
                  <label className="button-secondary cursor-pointer justify-center">
                    <Upload className="h-4 w-4" />
                    Unggah galeri
                    <input key={`gallery-${formResetKey}`} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" multiple className="hidden" onChange={handleGalleryUpload} />
                  </label>
                  {formValues.galleryUrls.length ? (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {formValues.galleryUrls.map((url, index) => (
                        <div key={`${url}-${index}`} className="relative overflow-hidden rounded-[0.8rem] border border-line bg-card">
                          <img src={url} alt="" className="aspect-[4/3] w-full object-cover" />
                          <div className="absolute inset-x-1.5 top-1.5 flex justify-between gap-1">
                            <button type="button" aria-label="Pindah kiri" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/75 text-white hover:bg-accent" onClick={() => moveGalleryImage(index, -1)}>
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button type="button" aria-label="Pindah kanan" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/75 text-white hover:bg-accent" onClick={() => moveGalleryImage(index, 1)}>
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                          <button type="button" aria-label="Lepas gambar galeri" className="absolute bottom-1.5 right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/75 text-white hover:bg-accent" onClick={() => handleRemoveGalleryImage(index)}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                <button type="submit" className="button-primary mt-6 w-full justify-center" disabled={isSaving}>
                  <Save className="h-4 w-4" />
                  Simpan portofolio
                </button>
              </form>

              <div className="admin-panel rounded-[1.6rem] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="editorial-note">Daftar portofolio</p>
                    <h2 className="mt-2 text-[1.45rem] font-bold tracking-[-0.045em] text-text">{items.length} item</h2>
                  </div>
                </div>
                <div className="mt-6 grid gap-3">
                  {isLoading ? <div className="min-h-[12rem]" aria-hidden="true" /> : null}
                  {!isLoading && !items.length ? (
                    <p className="rounded-[1rem] border border-line bg-surface px-4 py-3 text-[0.92rem] leading-6 text-muted">Belum ada portofolio dari Supabase.</p>
                  ) : null}
                  {items.map((item, index) => (
                    <article key={item.id} className="rounded-[1.2rem] border border-line bg-surface p-4">
                      <div className="flex gap-4">
                        {item.image_url ? <img src={item.image_url} alt="" className="h-20 w-28 shrink-0 rounded-[0.8rem] object-cover" /> : null}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="editorial-note">{item.category}</span>
                            {item.is_home ? <span className="rounded-full border border-lineStrong/70 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-muted">Beranda</span> : null}
                            {item.is_featured ? <span className="rounded-full border border-lineStrong/70 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-muted">Unggulan</span> : null}
                            {item.is_published ? <span className="rounded-full border border-lineStrong/70 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-muted">Terbit</span> : null}
                            {!item.is_home && !item.is_featured && !item.is_published ? <span className="rounded-full border border-lineStrong/70 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-muted">Draf</span> : null}
                          </div>
                          <h3 className="mt-2 truncate text-[1.05rem] font-bold tracking-[-0.04em] text-text">{item.title}</h3>
                          <p className="mt-1 truncate text-[0.88rem] leading-6 text-muted">{item.slug}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <button type="button" className="button-secondary" onClick={() => handleEdit(item)}><SquarePen className="h-4 w-4" />Edit</button>
                            <button type="button" className="button-secondary" onClick={() => handleMoveItem(index, -1)} disabled={index === 0}><ChevronUp className="h-4 w-4" />Naik</button>
                            <button type="button" className="button-secondary" onClick={() => handleMoveItem(index, 1)} disabled={index === items.length - 1}><ChevronDown className="h-4 w-4" />Turun</button>
                            <button type="button" className="button-secondary" onClick={() => handleDelete(item)}><Trash2 className="h-4 w-4" />Hapus</button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "media" ? (
            <div className="admin-panel rounded-[1.6rem] p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="editorial-note">Media Library</p>
                  <h2 className="mt-2 text-[1.45rem] font-bold tracking-[-0.045em] text-text">Semua aset visual</h2>
                </div>
                <label className="button-primary cursor-pointer">
                  <Upload className="h-4 w-4" />
                  Unggah media
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" multiple className="hidden" onChange={handleMediaUpload} />
                </label>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {mediaAssets.map((media) => (
                  <article key={media.id} className="rounded-[1.2rem] border border-line bg-surface p-3">
                    <div className="overflow-hidden rounded-[0.95rem] border border-line bg-card">
                      <img src={media.url} alt={media.alt_text || media.label} className="aspect-[4/3] w-full object-contain" loading="lazy" />
                    </div>
                    <div className="mt-3 grid gap-1.5">
                      <p className="truncate text-[0.92rem] font-semibold text-text">{media.label}</p>
                      <p className="truncate text-[0.78rem] text-muted">{media.section} / {media.usage_type}</p>
                      <p className="truncate text-[0.78rem] text-muted">{media.path}</p>
                    </div>
                    <button type="button" className="button-secondary mt-3 w-full justify-center" onClick={() => handleDeleteMedia(media)}>
                      <Trash2 className="h-4 w-4" />
                      Hapus jika tidak dipakai
                    </button>
                  </article>
                ))}
                {!mediaAssets.length ? <p className="rounded-[1rem] border border-line bg-surface px-4 py-5 text-center text-[0.92rem] leading-6 text-muted sm:col-span-2 xl:col-span-3">Belum ada media.</p> : null}
              </div>
            </div>
          ) : null}

          {activeTab === "identitas" ? (
            <div className="grid gap-5 md:grid-cols-2">
              {siteAssetSlots.map((slot) => {
                const asset = getAssetByKey(siteAssets, slot.key);

                return (
                  <article key={slot.key} className="admin-panel rounded-[1.5rem] p-5">
                    <p className="editorial-note">{slot.label}</p>
                    <p className="mt-2 text-[0.92rem] leading-6 text-muted">{slot.description}</p>
                    <div className="mt-4 overflow-hidden rounded-[1rem] border border-line bg-surface">
                      {asset?.url ? <img src={asset.url} alt={asset.alt_text || slot.label} className="max-h-44 w-full object-contain p-4" /> : <div className="flex min-h-[10rem] items-center justify-center px-5 text-center text-[0.9rem] text-muted">Belum diatur.</div>}
                    </div>
                    <label className="button-secondary mt-4 cursor-pointer justify-center">
                      <Upload className="h-4 w-4" />
                      Ganti aset
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" className="hidden" onChange={handleSiteAssetUpload(slot.key, slot.label, slot.section)} />
                    </label>
                  </article>
                );
              })}
            </div>
          ) : null}

          {activeTab === "profil" ? (
            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <article className="admin-panel rounded-[1.5rem] p-5">
                <p className="editorial-note">Foto profil</p>
                <div className="mt-4 overflow-hidden rounded-[1.2rem] border border-line bg-surface">
                  {siteAssetMap.founder_photo?.url ? <img src={siteAssetMap.founder_photo.url} alt="Foto profil" className="aspect-[4/5] w-full object-cover" /> : <div className="flex aspect-[4/5] items-center justify-center px-6 text-center text-[0.92rem] text-muted">Belum ada foto profil.</div>}
                </div>
                <label className="button-secondary mt-4 cursor-pointer justify-center">
                  <Upload className="h-4 w-4" />
                  Ganti foto profil
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFounderPhotoUpload} />
                </label>
              </article>
              <form className="admin-panel rounded-[1.5rem] p-5" onSubmit={saveAboutProfile}>
                <p className="editorial-note">Data profil</p>
                <div className="mt-5 grid gap-4">
                  <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-text">
                    <span>Nama</span>
                    <input className="input-shell" value={aboutProfile.name} onChange={(event) => setAboutProfile((profile) => ({ ...profile, name: event.target.value }))} />
                  </label>
                  <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-text">
                    <span>Peran</span>
                    <input className="input-shell" value={aboutProfile.role} onChange={(event) => setAboutProfile((profile) => ({ ...profile, role: event.target.value }))} />
                  </label>
                  <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-text">
                    <span>Bio singkat</span>
                    <textarea className="input-shell min-h-[100px] resize-none" value={aboutProfile.shortBio} onChange={(event) => setAboutProfile((profile) => ({ ...profile, shortBio: event.target.value }))} />
                  </label>
                  <label className="space-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-text">
                    <span>Bio detail</span>
                    <textarea className="input-shell min-h-[140px] resize-none" value={aboutProfile.detailBio} onChange={(event) => setAboutProfile((profile) => ({ ...profile, detailBio: event.target.value }))} />
                  </label>
                </div>
                <button type="submit" className="button-primary mt-5 w-full justify-center" disabled={isSaving}>
                  <Save className="h-4 w-4" />
                  Simpan profil
                </button>
              </form>
            </div>
          ) : null}

          {activeTab === "kontak" ? (
            <form className="admin-panel rounded-[1.6rem] p-5 sm:p-6" onSubmit={saveContactSettings}>
              <div>
                <p className="editorial-note">Kontak publik</p>
                <h2 className="mt-2 text-[1.45rem] font-bold tracking-[-0.045em] text-text">Link yang tampil di website</h2>
              </div>
              <div className="mt-6 grid gap-4">
                {contactLinks.map((link, index) => (
                  <article key={`${link.type}-${index}`} className="grid gap-3 rounded-[1.2rem] border border-line bg-surface p-4 lg:grid-cols-[0.8fr_1fr_1fr_0.7fr_auto] lg:items-center">
                    <input className="input-shell" value={link.label} onChange={updateContactLink(index, "label")} placeholder="Label" />
                    <input className="input-shell" value={link.value} onChange={updateContactLink(index, "value")} placeholder="Teks tampil" />
                    <input className="input-shell" value={link.href} onChange={updateContactLink(index, "href")} placeholder="URL" />
                    <select className="input-shell" value={link.type} onChange={updateContactLink(index, "type")}>
                      {["whatsapp", "email", "instagram", "linkedin", "other"].map((type) => <option key={type} value={type}>{type}</option>)}
                    </select>
                    <label className="flex items-center justify-between gap-3 rounded-[1rem] border border-line bg-card px-4 py-3 text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-text">
                      Aktif
                      <input type="checkbox" checked={link.isActive} onChange={updateContactLink(index, "isActive")} />
                    </label>
                  </article>
                ))}
              </div>
              <button type="submit" className="button-primary mt-5 justify-center" disabled={isSaving}>
                <Save className="h-4 w-4" />
                Simpan kontak
              </button>
            </form>
          ) : null}

          {activeTab === "pengaturan" ? (
            <div className="admin-panel rounded-[1.6rem] p-5 sm:p-6">
              <p className="editorial-note">Pengaturan</p>
              <h2 className="mt-2 text-[1.45rem] font-bold tracking-[-0.045em] text-text">Catatan operasional</h2>
              <div className="mt-5 grid gap-3 text-[0.94rem] leading-7 text-muted">
                <p className="rounded-[1rem] border border-line bg-surface p-4">Semua gambar baru disimpan di Supabase Storage bucket `site-media` dan metadata disimpan di database.</p>
                <p className="rounded-[1rem] border border-line bg-surface p-4">Portofolio menggunakan `portfolio_items` untuk metadata dan `portfolio_images` untuk gambar utama serta galeri.</p>
                <p className="rounded-[1rem] border border-line bg-surface p-4">Aset global seperti logo, favicon, OG image, dan foto profil diatur dari tab Identitas Website dan About / Profil.</p>
              </div>
            </div>
          ) : null}
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboardPage;
