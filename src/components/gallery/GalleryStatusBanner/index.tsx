import React from "react";
import type { Image } from "../../../pages/GalleryPage";

interface GalleryStatusBannerProps {
  searchQuery: string;
  filters: { color?: string };
  searchMode: 'all' | 'similar';
  similarImage: Image | null;
  hasActiveFilters: boolean;
}

const GalleryStatusBanner: React.FC<GalleryStatusBannerProps> = ({
  searchQuery,
  filters,
  searchMode,
  similarImage,
  hasActiveFilters,
}) => {
  if (!hasActiveFilters) return null;

  const getStatusText = () => {
    if (searchQuery) return `Search: "${searchQuery}"`;
    if (filters.color) return `Color: ${filters.color}`;
    if (searchMode === 'similar') {
      return `Similar to: ${similarImage?.metadata?.description?.substring(0, 30) || 'Selected Image'}...`;
    }
    return 'Filtered';
  };

  return (
    <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
      {getStatusText()}
    </span>
  );
};

export { GalleryStatusBanner };
