import React from "react";
import { Skeleton } from "antd";

const ImageCardSkeleton: React.FC = () => {
  return (
    <div className="gallery-card rounded-xl overflow-hidden bg-white shadow-md h-80 flex flex-col animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-48 bg-gray-200 flex-shrink-0 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4 bg-white flex-1 flex flex-col space-y-3">
        {/* Description lines */}
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-gray-200 rounded w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-4/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-3/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
          </div>
        </div>
        
        {/* Status indicators */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
            <div className="h-2 bg-gray-200 rounded w-16 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
            </div>
          </div>
          <div className="h-2 bg-gray-200 rounded w-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ImageCardSkeleton };
