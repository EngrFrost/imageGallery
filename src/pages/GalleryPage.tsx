import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useGetImagesQuery } from "../api/imageApi";
import ImageUpload from "../components/common/ImageUpload";
import ImageCard from "../components/common/ImageCard";
import type { Image } from "../types/image";

const GalleryPage: React.FC = () => {
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
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
    image.tags.some((tag) =>
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div>
      <header>
        <h1>Image Gallery</h1>
        <input
          type="text"
          placeholder="Search by tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={logout}>Logout</button>
      </header>
      <div className="filters">
        <button onClick={() => handleColorFilter("blue")}>Blue</button>
        <button onClick={() => handleColorFilter("red")}>Red</button>
        <button onClick={() => handleColorFilter("green")}>Green</button>
        <button onClick={clearFilters}>Clear Filters</button>
      </div>
      <ImageUpload onUpload={refetch} />
      <main>
        {isLoading ? (
          <p>Loading images...</p>
        ) : filteredImages.length === 0 ? (
          <p>No images found.</p>
        ) : (
          <div className="gallery">
            {filteredImages.map((image: Image) => (
              <ImageCard
                key={image.id}
                image={image}
                onFindSimilar={handleFindSimilar}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default GalleryPage;
