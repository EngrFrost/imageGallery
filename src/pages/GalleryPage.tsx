import React, { useState } from "react";
import { SearchOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { useGetImagesQuery } from "../api/services/images";
import {
  Row,
  Col,
  Input,
  Pagination,
  Spin,
  Button,
  ImageUpload,
  ImageCard,
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
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{ color?: string }>({});

  const { data, isLoading, refetch } = useGetImagesQuery({
    page,
    limit: 4,
    color: filters.color ?? "",
  });

  const images = data?.items ?? [];
  const totalImages = data?.meta?.total ?? 0;

  const handleColorFilter = (color: string) => {
    setPage(1);
    setFilters({ color });
  };

  const clearFilters = () => {
    setPage(1);
    setFilters({});
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
          <h1>Gallery</h1>
        </Col>
        <Col>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 250 }}
              prefix={<SearchOutlined />}
            />
            <Button
              startIcon={<CloudUploadOutlined />}
              onClick={() => setIsUploadModalOpen(true)}
            >
              Upload Image
            </Button>
          </div>
        </Col>
      </Row>
      <ImageUpload
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={() => {
          // Reset to page 1 to see new uploads
          if (page !== 1) {
            setPage(1);
          } else {
            refetch();
          }
        }}
      />
      <Row style={{ marginBottom: 24 }}>
        <Col>
          <div className="flex items-center gap-2">
            <span>Filter by color:</span>
            <Button onClick={() => handleColorFilter("blue")}>Blue</Button>
            <Button onClick={() => handleColorFilter("red")}>Red</Button>
            <Button onClick={() => handleColorFilter("green")}>Green</Button>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        </Col>
      </Row>
      <main>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <Spin size="large" />
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center text-gray-500">
            No images found. Try a different filter or upload something new!
          </div>
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {filteredImages.map((image: Image) => (
                <Col xs={24} sm={12} md={8} lg={6} key={image.id}>
                  <ImageCard image={image} onFindSimilar={() => {}} />
                </Col>
              ))}
            </Row>
            <Row justify="center" style={{ marginTop: 24 }}>
              <Pagination
                current={page}
                total={totalImages}
                pageSize={data?.meta.limit || 12}
                onChange={(newPage) => setPage(newPage)}
                showSizeChanger={false}
              />
            </Row>
          </>
        )}
      </main>
    </div>
  );
};

export default GalleryPage;
