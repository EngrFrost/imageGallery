import React from "react";
import { Card, Tag, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { Image } from "../../../pages/GalleryPage";

interface ImageCardProps {
  image: Image;
  onFindSimilar: (imageId: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onFindSimilar }) => {
  return (
    <Card
      hoverable
      className="gallery-card"
      cover={<img alt={image.metadata?.description} src={image.secureUrl} />}
      actions={[
        <Tooltip title="Find similar images">
          <SearchOutlined onClick={() => onFindSimilar(image.id)} />
        </Tooltip>,
      ]}
    >
      <Card.Meta
        title={
          <div
            style={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {image.metadata?.tags.map((tag: string) => (
              <Tag color="blue" key={tag}>
                {tag}
              </Tag>
            ))}
          </div>
        }
        description={
          <p className="text-sm text-gray-500">{image.metadata?.description}</p>
        }
      />
    </Card>
  );
};

export default ImageCard;
