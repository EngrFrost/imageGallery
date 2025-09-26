import React from "react";
import { Card, Tag, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { Image } from "../../types/image";

interface ImageCardProps {
  image: Image;
  onFindSimilar: (imageId: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onFindSimilar }) => {
  return (
    <Card
      hoverable
      className="gallery-card"
      cover={<img alt="" src={image.url} />}
      actions={[
        <Tooltip title="Find similar images">
          <SearchOutlined onClick={() => onFindSimilar(image.id)} />
        </Tooltip>,
      ]}
    >
      <Card.Meta
        title={
          <div style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
            {image.tags.map((tag) => (
              <Tag color="blue" key={tag}>
                {tag}
              </Tag>
            ))}
          </div>
        }
      />
    </Card>
  );
};

export default ImageCard;
