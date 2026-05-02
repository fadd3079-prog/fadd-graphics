import { useEffect, useState } from "react";
import { emptyPortfolioItems, type PortfolioDisplayItem } from "../data/portfolio";

type PublishedPortfolioState = {
  galleryItems: PortfolioDisplayItem[];
  curatedItems: PortfolioDisplayItem[];
  featuredItems: PortfolioDisplayItem[];
  homeItems: PortfolioDisplayItem[];
  detailItems: PortfolioDisplayItem[];
  isLoading: boolean;
  error: string;
};

const initialItems = {
  galleryItems: emptyPortfolioItems,
  curatedItems: emptyPortfolioItems,
  featuredItems: emptyPortfolioItems,
  homeItems: emptyPortfolioItems,
  detailItems: emptyPortfolioItems,
};
const hasSupabaseConfig = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

let cachedState: PublishedPortfolioState = {
  ...initialItems,
  isLoading: hasSupabaseConfig,
  error: "",
};
let inFlightRequest: Promise<PublishedPortfolioState> | null = null;
const subscribers = new Set<(state: PublishedPortfolioState) => void>();

function publishState(nextState: PublishedPortfolioState) {
  cachedState = nextState;
  subscribers.forEach((subscriber) => subscriber(cachedState));
}

export function ensurePublishedPortfolioItemsLoaded() {
  if (!hasSupabaseConfig || (!cachedState.isLoading && !cachedState.error)) {
    return Promise.resolve(cachedState);
  }

  if (inFlightRequest) {
    return inFlightRequest;
  }

  inFlightRequest = import("../lib/portfolio-service")
    .then(({ fetchPublishedPortfolioItems }) => fetchPublishedPortfolioItems())
    .then((portfolioItems) => {
      const nextState = {
        ...portfolioItems,
        isLoading: false,
        error: "",
      };

      publishState(nextState);
      return nextState;
    })
    .catch((error) => {
      const nextState = {
        ...initialItems,
        isLoading: false,
        error: error instanceof Error ? error.message : "Portfolio data could not be loaded.",
      };

      publishState(nextState);
      return nextState;
    })
    .finally(() => {
      inFlightRequest = null;
    });

  return inFlightRequest;
}

function loadPublishedPortfolioItems() {
  void ensurePublishedPortfolioItemsLoaded();
}

export function usePublishedPortfolioItems(): PublishedPortfolioState {
  const [state, setState] = useState<PublishedPortfolioState>(cachedState);

  useEffect(() => {
    subscribers.add(setState);
    loadPublishedPortfolioItems();

    return () => {
      subscribers.delete(setState);
    };
  }, []);

  return state;
}
