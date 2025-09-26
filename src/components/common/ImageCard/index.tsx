import React from "react";
import { Tag } from "antd";
import type { Image } from "../../../pages/GalleryPage";

interface ImageCardProps {
  image: Image;
  onFindSimilar: (imageId: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  return (
    <div className="group rounded-lg overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl h-80 flex flex-col">
      <div className="relative flex-shrink-0">
        <img
          alt={image.metadata?.description}
          src={image.secureUrl}
          className="w-full h-48 object-cover"
        />
      </div>

      <div className="p-4 bg-gray-50 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-2 mb-2 flex-shrink-0">
          {image.metadata?.tags.map((tag: string) => (
            <Tag color="blue" key={tag} className="text-xs">
              {tag}
            </Tag>
          ))}
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 flex-1">
          {image.metadata?.description}
        </p>
      </div>
    </div>
  );
};

export { ImageCard };
