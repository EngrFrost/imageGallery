import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import * as imageService from "../api/services/images";
import ImageUpload from "../components/common/ImageUpload";
import ImageCard from "../components/common/ImageCard";
import type { Image } from "../types/image";

const GalleryPage: React.FC = () => {
  const { logout } = useAuth();
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const fetchImages = async (similarTo?: string, color?: string) => {
    try {
      setLoading(true);
      let data;
      if (similarTo) {
        data = await imageService.findSimilarImages(similarTo);
      } else if (color) {
        data = await imageService.getImagesByColor(color);
      } else {
        data = await imageService.getImages();
      }
      setImages(data);
    } catch (error) {
      console.error("Failed to fetch images", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(undefined, selectedColor || undefined);
  }, [selectedColor]);

  const handleFindSimilar = (imageId: string) => {
    fetchImages(imageId);
  };

  const handleColorFilter = (color: string) => {
    setSelectedColor(color);
  };

  const clearFilters = () => {
    setSelectedColor(null);
    setSearchQuery("");
    fetchImages();
  };

  const filteredImages = images.filter((image) =>
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
      <ImageUpload onUpload={() => fetchImages()} />
      <main>
        {loading ? (
          <p>Loading images...</p>
        ) : filteredImages.length === 0 ? (
          <p>No images found.</p>
        ) : (
          <div className="gallery">
            {filteredImages.map((image) => (
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
