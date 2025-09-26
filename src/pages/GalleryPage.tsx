import React from "react";
import { message } from "antd";
import { ImageUpload, ImageDetailModal } from "../components/common";
import { GalleryFilters, GalleryList } from "../components/gallery";
import { useGalleryState } from "../hooks/useGalleryState";

export interface Image {
  id: string;
  secureUrl: string;
  metadata: {
    tags: string[];
    description: string;
    colors: string[];
    aiProcessingStatus: string;
  };
}

export interface PaginatedImagesResponse {
  items: Image[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const GalleryPage: React.FC = () => {
  const galleryState = useGalleryState();

  const handleUploadSuccess = () => {
    if (galleryState.page !== 1) {
      galleryState.setPage(1);
    } else {
      galleryState.refetch();
    }
    message.success("Images uploaded successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 mt-20">
      {/* Gallery Filters */}
      <GalleryFilters
        searchQuery={galleryState.searchQuery}
        onSearchChange={galleryState.setSearchQuery}
        filters={galleryState.filters}
        onColorFilter={galleryState.handleColorFilter}
        availableColors={galleryState.availableColors}
        searchMode={galleryState.searchMode}
        similarImage={galleryState.similarImage}
        onClearFilters={galleryState.clearAllFilters}
        onUploadClick={() => galleryState.setIsUploadModalOpen(true)}
        hasActiveFilters={galleryState.hasActiveFilters}
      />

      {/* Upload Modal */}
      <ImageUpload
        open={galleryState.isUploadModalOpen}
        onClose={() => galleryState.setIsUploadModalOpen(false)}
        onUpload={handleUploadSuccess}
      />

      {/* Image Detail Modal */}
      <ImageDetailModal
        image={galleryState.selectedImage}
        open={!!galleryState.selectedImage}
        onClose={() => galleryState.setSelectedImage(null)}
        onFindSimilar={galleryState.handleFindSimilar}
        onColorFilter={galleryState.handleColorFilter}
        onTagSearch={galleryState.handleTagSearch}
      />

      {/* Gallery List */}
      <main className="px-1">
        <GalleryList
          images={galleryState.images}
          totalImages={galleryState.totalImages}
          currentPage={galleryState.page}
          pageSize={8}
          isLoading={galleryState.isLoading}
          isFetching={galleryState.isFetching}
          hasActiveFilters={galleryState.hasActiveFilters}
          searchMode={galleryState.searchMode}
          similarImage={galleryState.similarImage}
          onPageChange={galleryState.setPage}
          onViewDetails={galleryState.handleViewDetails}
          onFindSimilar={galleryState.handleFindSimilar}
          onClearFilters={galleryState.clearAllFilters}
          onUploadClick={() => galleryState.setIsUploadModalOpen(true)}
        />
      </main>
    </div>
  );
};

export default GalleryPage;
