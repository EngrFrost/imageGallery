import { useState, useEffect, useMemo } from "react";
import { message } from "antd";
import { useGetImagesQuery } from "../api/services/images";
import type { Image } from "../pages/GalleryPage";
import { PAGE_LIMIT } from "../utils/constants";

interface UseGalleryStateReturn {
  // State
  searchQuery: string;
  page: number;
  filters: { color?: string };
  searchMode: "all" | "similar";
  similarImageId: string;
  selectedImage: Image | null;
  isUploadModalOpen: boolean;

  // Derived state
  images: Image[];
  totalImages: number;
  isLoading: boolean;
  isFetching: boolean;
  hasActiveFilters: boolean;
  availableColors: string[];
  similarImage: Image | null;

  // Actions
  setSearchQuery: (query: string) => void;
  setPage: (page: number) => void;
  setSelectedImage: (image: Image | null) => void;
  setIsUploadModalOpen: (open: boolean) => void;
  handleColorFilter: (color: string) => void;
  handleTagSearch: (tag: string) => void;
  handleFindSimilar: (imageId: string) => void;
  clearAllFilters: () => void;
  handleViewDetails: (image: Image) => void;
  refetch: () => void;
}

const useGalleryState = (): UseGalleryStateReturn => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{ color?: string }>({});
  const [searchMode, setSearchMode] = useState<"all" | "similar">("all");
  const [similarImageId, setSimilarImageId] = useState<string>("");

  // API query
  const { data, isLoading, refetch, isFetching } = useGetImagesQuery({
    page,
    limit: PAGE_LIMIT,
    color: filters.color ?? "",
    search: searchQuery,
    similarTo: searchMode === "similar" ? similarImageId : undefined,
  });

  // Derived state
  const images = data?.items ?? [];
  const totalImages = data?.meta?.total ?? 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) setPage(1); // Reset to first page on search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]); // Intentionally excluding 'page' to avoid infinite loop

  // Get unique colors from current images for dynamic color filtering
  const availableColors = useMemo(() => {
    const imageList = data?.items ?? [];
    const allColors = imageList.flatMap(
      (image: Image) => image.metadata?.colors || []
    );
    return [...new Set(allColors)].slice(0, 6) as string[]; // Show max 6 colors
  }, [data?.items]);

  const hasActiveFilters = Boolean(
    searchQuery || filters.color || searchMode === "similar"
  );

  // Get the current similar image details for display
  const similarImage =
    searchMode === "similar" && similarImageId
      ? images.find((img: Image) => img.id === similarImageId) ||
        data?.items.find((img: Image) => img.id === similarImageId)
      : null;

  const handleColorFilter = (color: string) => {
    setPage(1);
    setFilters({ color });
    setSearchQuery("");
    message.success(`Filtering by ${color} color`);
  };

  const handleTagSearch = (tag: string) => {
    setSearchQuery(tag);
    setPage(1);
    setFilters({});
    message.info(`Searching for images with tag: ${tag}`);
  };

  const handleFindSimilar = (imageId: string) => {
    setSimilarImageId(imageId);
    setSearchMode("similar");
    setPage(1);
    setSearchQuery("");
    setFilters({});
    message.info("Finding similar images...");
  };

  const clearAllFilters = () => {
    setPage(1);
    setFilters({});
    setSearchQuery("");
    setSearchMode("all");
    setSimilarImageId("");
    message.success("All filters cleared");
  };

  const handleViewDetails = (image: Image) => {
    setSelectedImage(image);
  };

  return {
    // State
    searchQuery,
    page,
    filters,
    searchMode,
    similarImageId,
    selectedImage,
    isUploadModalOpen,

    // Derived state
    images,
    totalImages,
    isLoading,
    isFetching,
    hasActiveFilters,
    availableColors,
    similarImage,

    // Actions
    setSearchQuery,
    setPage,
    setSelectedImage,
    setIsUploadModalOpen,
    handleColorFilter,
    handleTagSearch,
    handleFindSimilar,
    clearAllFilters,
    handleViewDetails,
    refetch,
  };
};

export { useGalleryState };
