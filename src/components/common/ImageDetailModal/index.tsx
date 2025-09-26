import React from "react";
import { Modal, Tag, Divider, Button } from "antd";
import { 
  EyeOutlined, 
  TagOutlined, 
  BgColorsOutlined,
  SearchOutlined,
  CloseOutlined
} from "@ant-design/icons";
import type { Image } from "../../../pages/GalleryPage";

interface ImageDetailModalProps {
  image: Image | null;
  open: boolean;
  onClose: () => void;
  onFindSimilar: (imageId: string) => void;
  onColorFilter: (color: string) => void;
  onTagSearch: (tag: string) => void;
}

const ImageDetailModal: React.FC<ImageDetailModalProps> = ({
  image,
  open,
  onClose,
  onFindSimilar,
  onColorFilter,
  onTagSearch,
}) => {
  if (!image) return null;

  const handleColorClick = (color: string) => {
    onColorFilter(color);
    onClose();
  };

  const handleTagClick = (tag: string) => {
    onTagSearch(tag);
    onClose();
  };

  const handleFindSimilar = () => {
    onFindSimilar(image.id);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="90vw"
      style={{ maxWidth: 1200 }}
      className="image-detail-modal"
      closeIcon={<CloseOutlined className="text-gray-500 hover:text-gray-700 text-lg" />}
    >
      <div className="flex flex-col lg:flex-row gap-6 p-4">
        {/* Image Section */}
        <div className="flex-1 flex justify-center items-center bg-gray-50 rounded-lg overflow-hidden min-h-[400px]">
          <img
            src={image.secureUrl}
            alt={image.metadata?.description}
            className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
          />
        </div>

        {/* Details Section */}
        <div className="lg:w-96 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <EyeOutlined className="text-blue-500" />
              Image Details
            </h3>
            <Divider className="my-3" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Description</h4>
            <p className="text-gray-800 leading-relaxed bg-gray-50 p-3 rounded-lg">
              {image.metadata?.description || "No description available"}
            </p>
          </div>

          {/* Tags */}
          {image.metadata?.tags && image.metadata.tags.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wide flex items-center gap-2">
                <TagOutlined />
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {image.metadata.tags.map((tag: string) => (
                  <Tag 
                    key={tag}
                    color="blue" 
                    className="cursor-pointer transition-all duration-200 hover:bg-blue-600 hover:border-blue-600 text-xs px-2 py-1"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
              <p className="text-xs text-gray-500 italic">Click a tag to search for similar images</p>
            </div>
          )}

          {/* Colors */}
          {image.metadata?.colors && image.metadata.colors.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wide flex items-center gap-2">
                <BgColorsOutlined />
                Dominant Colors
              </h4>
              <div className="flex flex-wrap gap-2">
                {image.metadata.colors.map((color: string, index: number) => (
                  <div 
                    key={index} 
                    className="group cursor-pointer transition-all duration-200 hover:scale-110"
                    onClick={() => handleColorClick(color)}
                  >
                    <div className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 rounded-lg p-2">
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-gray-200 shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs text-gray-600 font-mono">{color}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 italic">Click a color to find similar colored images</p>
            </div>
          )}

          {/* Processing Status */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wide">AI Processing Status</h4>
            <Tag color={image.metadata?.aiProcessingStatus === 'completed' ? 'green' : 'orange'}>
              {image.metadata?.aiProcessingStatus || 'Unknown'}
            </Tag>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-200">
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleFindSimilar}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 border-none hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
              size="large"
            >
              Find Similar Images
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export { ImageDetailModal };
