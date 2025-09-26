import React from "react";
import { SearchOutlined, ClearOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { Row, Col, Input, Button } from "../../common";
import { GalleryStatusBanner } from "../GalleryStatusBanner";
import type { Image } from "../../../pages/GalleryPage";

interface GalleryFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: { color?: string };
  onColorFilter: (color: string) => void;
  availableColors: string[];
  searchMode: 'all' | 'similar';
  similarImage: Image | null;
  onClearFilters: () => void;
  onUploadClick: () => void;
  hasActiveFilters: boolean;
}

const GalleryFilters: React.FC<GalleryFiltersProps> = ({
  searchQuery,
  onSearchChange,
  filters,
  onColorFilter,
  availableColors,
  searchMode,
  similarImage,
  onClearFilters,
  onUploadClick,
  hasActiveFilters,
}) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 rounded-lg mb-6">
      <div className="p-6">
        {/* Search and Upload Row */}
        <Row justify="space-between" align="middle" className="mb-4">
          <Col>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-800 m-0">Gallery</h1>
              <GalleryStatusBanner
                searchQuery={searchQuery}
                filters={filters}
                searchMode={searchMode}
                similarImage={similarImage}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </Col>
          <Col>
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search by tags or description..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                style={{ width: 300 }}
                prefix={<SearchOutlined className="text-gray-400" />}
                className="rounded-lg"
                suffix={
                  searchQuery && (
                    <ClearOutlined 
                      className="text-gray-400 hover:text-gray-600 cursor-pointer" 
                      onClick={() => onSearchChange("")}
                    />
                  )
                }
              />
              <Button
                startIcon={<CloudUploadOutlined />}
                onClick={onUploadClick}
                className="bg-gradient-to-r from-blue-500 to-blue-600 border-none shadow-md hover:shadow-lg !text-white px-6 py-2 rounded-lg text-base"
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
                onClick={() => onColorFilter(color)}
                className={`rounded-full border transition-all duration-200 hover:scale-105 ${
                  filters.color === color 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs capitalize">{color}</span>
                </div>
              </Button>
            ))}
            
            {hasActiveFilters && (
              <Button
                size="sm"
                onClick={onClearFilters}
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
              onClick={onClearFilters}
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
  );
};

export { GalleryFilters };
