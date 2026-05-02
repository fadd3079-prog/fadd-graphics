import { useEffect, useMemo, useState } from "react";
import { siteCopy, type Language } from "../data/site-content";
import type { ContactLinkSetting, PublicSiteData, SiteAssetKey } from "../lib/media-service";

type SiteDataState = PublicSiteData & {
  isLoading: boolean;
  error: string;
};

const initialSiteData: SiteDataState = {
  assets: {},
  settings: {},
  isLoading: Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY),
  error: "",
};

let cachedSiteData = initialSiteData;
let inFlightRequest: Promise<SiteDataState> | null = null;
const subscribers = new Set<(state: SiteDataState) => void>();

function publishSiteData(nextState: SiteDataState) {
  cachedSiteData = nextState;
  subscribers.forEach((subscriber) => subscriber(cachedSiteData));
}

export function ensureSiteDataLoaded() {
  if (!cachedSiteData.isLoading && !cachedSiteData.error) {
    return Promise.resolve(cachedSiteData);
  }

  if (inFlightRequest) {
    return inFlightRequest;
  }

  inFlightRequest = import("../lib/media-service")
    .then(({ fetchPublicSiteData }) => fetchPublicSiteData())
    .then((siteData) => {
      const nextState = {
        ...siteData,
        isLoading: false,
        error: "",
      };

      publishSiteData(nextState);
      return nextState;
    })
    .catch((error) => {
      const nextState = {
        assets: {},
        settings: {},
        isLoading: false,
        error: error instanceof Error ? error.message : "Site data could not be loaded.",
      };

      publishSiteData(nextState);
      return nextState;
    })
    .finally(() => {
      inFlightRequest = null;
    });

  return inFlightRequest;
}

export function useSiteData() {
  const [state, setState] = useState(cachedSiteData);

  useEffect(() => {
    subscribers.add(setState);
    void ensureSiteDataLoaded();

    return () => {
      subscribers.delete(setState);
    };
  }, []);

  return state;
}

export function useSiteAsset(assetKey: SiteAssetKey) {
  const { assets } = useSiteData();

  return assets[assetKey];
}

export function useResolvedSiteAssets() {
  const { assets } = useSiteData();

  return useMemo(
    () => ({
      headerLogoLight: assets.header_logo_light,
      headerLogoDark: assets.header_logo_dark ?? assets.header_logo_light,
      footerLogoLight: assets.footer_logo_light ?? assets.header_logo_light,
      footerLogoDark: assets.footer_logo_dark ?? assets.header_logo_dark ?? assets.footer_logo_light ?? assets.header_logo_light,
      favicon: assets.favicon,
      ogImage: assets.og_image,
      founderPhoto: assets.founder_photo,
    }),
    [assets],
  );
}

function isContactLink(value: unknown): value is ContactLinkSetting {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as ContactLinkSetting;

  return Boolean(candidate.label && candidate.href && candidate.value);
}

export function useContactLinks(language: Language) {
  const { settings } = useSiteData();
  const contactLinks = Array.isArray(settings.contact_links)
    ? settings.contact_links.filter(isContactLink)
    : [];

  return contactLinks.length
    ? [...contactLinks]
        .filter((link) => link.isActive !== false)
        .sort((first, second) => first.sortOrder - second.sortOrder)
    : siteCopy[language].contact.links.map((link, index) => ({
        ...link,
        type: link.label.toLowerCase() as ContactLinkSetting["type"],
        isActive: true,
        sortOrder: index + 1,
      }));
}
