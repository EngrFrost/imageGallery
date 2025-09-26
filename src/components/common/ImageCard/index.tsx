import React from "react";
import { Button } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import type { Image } from "../../../pages/GalleryPage";

interface ImageCardProps {
  image: Image;
  onViewDetails: (image: Image) => void;
  onFindSimilar: (imageId: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onViewDetails, onFindSimilar }) => {
  return (
    <div className="gallery-card group rounded-xl overflow-hidden bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-80 flex flex-col">
      <div className="relative flex-shrink-0 overflow-hidden">
        <img
          alt={image.metadata?.description}
          src={image.secureUrl}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          onClick={() => onViewDetails(image)}
        />
        
        {/* Overlay with actions - appears on hover */}
        <div className="absolute inset-0 bg-transparent bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button
              type="primary"
              shape="circle"
              icon={<EyeOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(image);
              }}
              className="bg-white bg-opacity-90 border-none text-blue-600 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
            />
            <Button
              type="primary"
              shape="circle"
              icon={<SearchOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onFindSimilar(image.id);
              }}
              className="bg-white bg-opacity-90 border-none text-green-600 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-white flex-1 flex flex-col" onClick={() => onViewDetails(image)}>
        <p className="text-sm text-gray-600 line-clamp-3 flex-1 leading-relaxed">
          {image.metadata?.description || "No description available"}
        </p>
        
        {/* Processing status indicator */}
        <div className="mt-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              image.metadata?.aiProcessingStatus === 'completed' 
                ? 'bg-green-400' 
                : 'bg-yellow-400'
            }`} />
            <span className="text-xs text-gray-400 capitalize">
              {image.metadata?.aiProcessingStatus || 'Processing'}
            </span>
          </div>
          
          {image.metadata?.tags && image.metadata.tags.length > 0 && (
            <span className="text-xs text-blue-500 font-medium">
              {image.metadata.tags.length} tag{image.metadata.tags.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export { ImageCard };
