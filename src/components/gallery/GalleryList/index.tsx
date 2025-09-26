import React from "react";
import { Row, Col, Pagination, Button, ImageCard, ImageCardSkeleton } from "../../common";
import type { Image } from "../../../pages/GalleryPage";

interface GalleryListProps {
  images: Image[];
  totalImages: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  isFetching: boolean;
  hasActiveFilters: boolean;
  searchMode: 'all' | 'similar';
  similarImage?: Image | null;
  onPageChange: (page: number) => void;
  onViewDetails: (image: Image) => void;
  onFindSimilar: (imageId: string) => void;
  onClearFilters: () => void;
  onUploadClick: () => void;
}

const GalleryList: React.FC<GalleryListProps> = ({
  images,
  totalImages,
  currentPage,
  pageSize,
  isLoading,
  isFetching,
  hasActiveFilters,
  searchMode,
  similarImage,
  onPageChange,
  onViewDetails,
  onFindSimilar,
  onClearFilters,
  onUploadClick,
}) => {
  // Loading state - show full skeleton grid
  if ((isLoading || isFetching) && images.length === 0) {
    return (
      <>
        {/* Results Info Skeleton */}
        <div className="mb-6">
          <div className="h-4 bg-gray-200 rounded w-48 relative overflow-hidden animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
          </div>
        </div>

        {/* Skeleton Grid */}
        <Row gutter={[24, 24]} className="mb-8">
          {Array.from({ length: pageSize }).map((_, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={`skeleton-${index}`}>
              <ImageCardSkeleton />
            </Col>
          ))}
        </Row>
      </>
    );
  }

  // Empty state
  if (images.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="bg-white rounded-lg shadow-sm p-12">
          <div className="text-6xl text-gray-300 mb-4">🖼️</div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No images found</h3>
          <p className="text-gray-500 mb-6">
            {hasActiveFilters 
              ? "Try adjusting your search or filters" 
              : "Get started by uploading your first image!"
            }
          </p>
          <Button
            onClick={() => hasActiveFilters ? onClearFilters() : onUploadClick()}
            className="bg-gradient-to-r from-blue-500 to-blue-600 border-none !text-white px-6 py-3 rounded-lg text-base"
          >
            {hasActiveFilters ? "Clear Filters" : "Upload Images"}
          </Button>
        </div>
      </div>
    );
  }

  // Main content with images
  return (
    <>
      {/* Results Info */}
      <div className="mb-6">
        <div className={`text-sm text-gray-600 mb-2 transition-opacity duration-200 ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
          {isFetching && images.length === 0 ? (
            <div className="h-4 bg-gray-200 rounded w-56 animate-pulse"></div>
          ) : (
            <>
              Showing {images.length} of {totalImages} images
              {searchMode === 'similar' && similarImage && ` (similar to "${similarImage.metadata?.description}")`}
            </>
          )}
        </div>
        
        {/* Show similar image reference */}
        {searchMode === 'similar' && similarImage && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3">
            <img 
              src={similarImage.secureUrl} 
              alt="Reference" 
              className="w-12 h-12 object-cover rounded-lg border"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-800">Finding images similar to:</p>
              <p className="text-xs text-blue-600">{similarImage.metadata?.description}</p>
            </div>
            <Button
              size="sm"
              onClick={onClearFilters}
              variant="ghost"
              className="text-blue-600 hover:text-blue-800"
            >
              ✕ Clear
            </Button>
          </div>
        )}
      </div>

      {/* Image Grid */}
      <Row gutter={[24, 24]} className="mb-8">
        {isFetching && images.length > 0 ? (
          // Show mix of existing images with skeleton loading for new content
          <>
            {images.map((image: Image) => (
              <Col xs={24} sm={12} md={8} lg={6} key={image.id}>
                <div className={`transition-opacity duration-300 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
                  <ImageCard 
                    image={image} 
                    onViewDetails={onViewDetails}
                    onFindSimilar={onFindSimilar} 
                  />
                </div>
              </Col>
            ))}
            {/* Add skeleton cards when fetching to show loading state */}
            {Array.from({ length: Math.max(0, pageSize - images.length) }).map((_, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={`loading-skeleton-${index}`}>
                <ImageCardSkeleton />
              </Col>
            ))}
          </>
        ) : (
          // Normal image display
          images.map((image: Image) => (
            <Col xs={24} sm={12} md={8} lg={6} key={image.id}>
              <ImageCard 
                image={image} 
                onViewDetails={onViewDetails}
                onFindSimilar={onFindSimilar} 
              />
            </Col>
          ))
        )}
      </Row>

      {/* Pagination */}
      {totalImages > pageSize && (
        <div className="flex justify-center">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <Pagination
              current={currentPage}
              total={totalImages}
              pageSize={pageSize}
              onChange={onPageChange}
              showSizeChanger={false}
              showTotal={(total, range) => 
                `${range[0]}-${range[1]} of ${total} images`
              }
              className="mb-0"
            />
          </div>
        </div>
      )}
    </>
  );
};

export { GalleryList };
