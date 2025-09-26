import React, { useState } from "react";
import { Input, Button, Row, Col, Typography, Space, Spin, Empty } from "antd";
import { SearchOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { useGetImagesQuery } from "../api/imageApi";
import ImageCard from "../components/common/ImageCard/ImageCard";
import ImageUpload from "../components/common/ImageUpload/ImageUpload";

const { Title } = Typography;

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

const GalleryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [apiParams, setApiParams] = useState<{
    similarTo?: string;
    color?: string;
  }>({});

  const {
    data: images = [],
    isLoading,
    refetch,
  } = useGetImagesQuery(apiParams);

  const handleFindSimilar = (imageId: string) => {
    setApiParams({ similarTo: imageId });
  };

  const handleColorFilter = (color: string) => {
    setApiParams({ color });
  };

  const clearFilters = () => {
    setApiParams({});
    setSearchQuery("");
  };

  const filteredImages = images.filter((image: Image) =>
    image.metadata?.tags.some((tag: string) =>
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2}>Gallery</Title>
        </Col>
        <Col>
          <Space>
            <Input
              placeholder="Search by tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 250 }}
              prefix={<SearchOutlined />}
            />
            <Button
              icon={<CloudUploadOutlined />}
              type="primary"
              onClick={() => setIsUploadModalOpen(true)}
            >
              Upload Image
            </Button>
          </Space>
        </Col>
      </Row>
      <ImageUpload
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={refetch}
      />
      <Row style={{ marginBottom: 24 }}>
        <Col>
          <Space>
            <span>Filter by color:</span>
            <Button onClick={() => handleColorFilter("blue")}>Blue</Button>
            <Button onClick={() => handleColorFilter("red")}>Red</Button>
            <Button onClick={() => handleColorFilter("green")}>Green</Button>
            <Button onClick={clearFilters} type="dashed">
              Clear Filters
            </Button>
          </Space>
        </Col>
      </Row>
      <main>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <Spin size="large" />
          </div>
        ) : filteredImages.length === 0 ? (
          <Empty description="No images found. Try a different filter or upload something new!" />
        ) : (
          <Row gutter={[16, 16]}>
            {filteredImages.map((image: Image) => (
              <Col xs={24} sm={12} md={8} lg={6} key={image.id}>
                <ImageCard image={image} onFindSimilar={handleFindSimilar} />
              </Col>
            ))}
          </Row>
        )}
      </main>
    </div>
  );
};

export default GalleryPage;
