import { useEffect, useState } from "react";
import { portfolioGalleryItems, portfolioItems, type PortfolioDisplayItem } from "../data/portfolio";
import { fetchPublishedPortfolioItems } from "../lib/portfolio-service";
import { isSupabaseConfigured } from "../lib/supabase";

type PublishedPortfolioState = {
  galleryItems: PortfolioDisplayItem[];
  curatedItems: PortfolioDisplayItem[];
  isLoading: boolean;
  error: string;
};

const initialItems = {
  galleryItems: portfolioGalleryItems,
  curatedItems: portfolioItems,
};

export function usePublishedPortfolioItems(): PublishedPortfolioState {
  const [state, setState] = useState<PublishedPortfolioState>({
    ...initialItems,
    isLoading: isSupabaseConfigured,
    error: "",
  });

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return undefined;
    }

    let isCancelled = false;

    async function loadPortfolioItems() {
      try {
        const items = await fetchPublishedPortfolioItems();

        if (!isCancelled) {
          setState({
            galleryItems: items,
            curatedItems: items,
            isLoading: false,
            error: "",
          });
        }
      } catch (error) {
        if (!isCancelled) {
          setState({
            ...initialItems,
            isLoading: false,
            error: error instanceof Error ? error.message : "Portfolio data could not be loaded.",
          });
        }
      }
    }

    loadPortfolioItems();

    return () => {
      isCancelled = true;
    };
  }, []);

  return state;
}
