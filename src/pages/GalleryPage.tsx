import React, { useState, useEffect, useMemo } from "react";
import { SearchOutlined, CloudUploadOutlined, ClearOutlined } from "@ant-design/icons";
import { useGetImagesQuery } from "../api/services/images";
import { message } from "antd";
import {
  Row,
  Col,
  Input,
  Pagination,
  Spin,
  Button,
  ImageUpload,
  ImageCard,
  ImageDetailModal,
} from "../components/common";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{ color?: string }>({});
  const [searchMode, setSearchMode] = useState<'all' | 'similar'>('all');
  const [similarImageId, setSimilarImageId] = useState<string>("");

  // Enhanced query with search parameter and similar image support
  const { data, isLoading, refetch, isFetching } = useGetImagesQuery({
    page,
    limit: 8, // Increased limit for better grid layout
    color: filters.color ?? "",
    search: searchQuery,
    similarTo: searchMode === 'similar' ? similarImageId : undefined,
  });

  const images = data?.items ?? [];
  const totalImages = data?.meta?.total ?? 0;

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) setPage(1); // Reset to first page on search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, page]);

  const handleColorFilter = (color: string) => {
    setPage(1);
    setFilters({ color });
    setSearchQuery(""); // Clear search when filtering by color
    message.success(`Filtering by ${color} color`);
  };

  const handleTagSearch = (tag: string) => {
    setSearchQuery(tag);
    setPage(1);
    setFilters({}); // Clear color filter when searching by tag
    message.info(`Searching for images with tag: ${tag}`);
  };

  const handleFindSimilar = (imageId: string) => {
    setSimilarImageId(imageId);
    setSearchMode('similar');
    setPage(1);
    setSearchQuery(""); // Clear text search when finding similar
    setFilters({}); // Clear color filter when finding similar
    message.info("Finding similar images...");
  };

  const clearAllFilters = () => {
    setPage(1);
    setFilters({});
    setSearchQuery("");
    setSearchMode('all');
    setSimilarImageId("");
    message.success("All filters cleared");
  };

  const handleViewDetails = (image: Image) => {
    setSelectedImage(image);
  };

  // Get unique colors from current images for dynamic color filtering
  const availableColors = useMemo(() => {
    const imageList = data?.items ?? [];
    const allColors = imageList.flatMap((image: Image) => image.metadata?.colors || []);
    return [...new Set(allColors)].slice(0, 6); // Show max 6 colors
  }, [data?.items]);

  const hasActiveFilters = searchQuery || filters.color || searchMode === 'similar';
  
  // Get the current similar image details for display
  const similarImage = searchMode === 'similar' && similarImageId 
    ? images.find((img: Image) => img.id === similarImageId) || data?.items.find((img: Image) => img.id === similarImageId)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 mt-20">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200 rounded-lg mb-6">
        <div className="p-6">
          <Row justify="space-between" align="middle" className="mb-4">
            <Col>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-800 m-0">Gallery</h1>
                {hasActiveFilters && (
                  <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {searchQuery ? `Search: "${searchQuery}"` : 
                     filters.color ? `Color: ${filters.color}` :
                     searchMode === 'similar' ? `Similar to: ${similarImage?.metadata?.description?.substring(0, 30) || 'Selected Image'}...` : 'Filtered'}
                  </span>
                )}
              </div>
            </Col>
            <Col>
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Search by tags or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: 300 }}
                  prefix={<SearchOutlined className="text-gray-400" />}
                  className="rounded-lg"
                  suffix={
                    searchQuery && (
                      <ClearOutlined 
                        className="text-gray-400 hover:text-gray-600 cursor-pointer" 
                        onClick={() => setSearchQuery("")}
                      />
                    )
                  }
                />
                <Button
                  startIcon={<CloudUploadOutlined />}
                  onClick={() => setIsUploadModalOpen(true)}
                  className=" bg-gradient-to-r from-blue-500 to-blue-600 border-none shadow-md hover:shadow-lg !text-white px-6 py-2 rounded-lg text-base"
                >
                  Upload
                </Button>
              </div>
            </Col>
          </Row>

          {/* Dynamic Color Filters - Hide when in similar search mode */}
          {availableColors.length > 0 && searchMode !== 'similar' && (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium text-gray-600">Filter by color:</span>
              {availableColors.map((color, index) => (
                <Button
                  key={`${color}-${index}`}
                  size="sm"
                  onClick={() => handleColorFilter(String(color))}
                  className={`rounded-full border transition-all duration-200 hover:scale-105 ${
                    filters.color === color 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: String(color) }}
                    />
                    <span className="text-xs capitalize">{String(color)}</span>
                  </div>
                </Button>
              ))}
              
              {hasActiveFilters && (
                <Button
                  size="sm"
                  onClick={clearAllFilters}
                  variant="ghost"
                  startIcon={<ClearOutlined />}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                >
                  Clear All
                </Button>
              )}
            </div>
          )}
          
          {/* Similar Search Mode Controls */}
          {searchMode === 'similar' && (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium text-blue-600">🔍 Similar Image Search Active</span>
              <Button
                size="sm"
                onClick={clearAllFilters}
                variant="ghost"
                startIcon={<ClearOutlined />}
                className="text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-300"
              >
                Exit Similar Search
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <ImageUpload
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={() => {
          if (page !== 1) {
            setPage(1);
          } else {
            refetch();
          }
          message.success("Images uploaded successfully!");
        }}
      />

      {/* Image Detail Modal */}
      <ImageDetailModal
        image={selectedImage}
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        onFindSimilar={handleFindSimilar}
        onColorFilter={handleColorFilter}
        onTagSearch={handleTagSearch}
      />

      {/* Main Content */}
      <main className="px-1">
        {isLoading && !isFetching ? (
          <div className="text-center py-20">
            <Spin size="large" />
            <p className="mt-4 text-gray-500">Loading your gallery...</p>
          </div>
        ) : images.length === 0 ? (
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
                onClick={() => hasActiveFilters ? clearAllFilters() : setIsUploadModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 border-none text-white px-6 py-3 rounded-lg text-base"
              >
                {hasActiveFilters ? "Clear Filters" : "Upload Images"}
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Loading Overlay */}
            {isFetching && (
              <div className="loading-overlay fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white shadow-lg rounded-lg px-4 py-2">
                <div className="flex items-center gap-2">
                  <Spin size="small" />
                  <span className="text-sm text-gray-600">Updating...</span>
                </div>
              </div>
            )}

            {/* Results Info */}
            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-2">
                Showing {images.length} of {totalImages} images
                {searchMode === 'similar' && similarImage && ` (similar to "${similarImage.metadata?.description}")`}
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
                    onClick={clearAllFilters}
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
              {images.map((image: Image) => (
                <Col xs={24} sm={12} md={8} lg={6} key={image.id}>
                  <ImageCard 
                    image={image} 
                    onViewDetails={handleViewDetails}
                    onFindSimilar={handleFindSimilar} 
                  />
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            {totalImages > (data?.meta.limit || 8) && (
              <div className="flex justify-center">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <Pagination
                    current={page}
                    total={totalImages}
                    pageSize={data?.meta.limit || 8}
                    onChange={(newPage) => setPage(newPage)}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) => 
                      `${range[0]}-${range[1]} of ${total} images`
                    }
                    className="mb-0"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default GalleryPage;
