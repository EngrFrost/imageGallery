import type { Image } from "../../types/image";

interface ImageCardProps {
  image: Image;
  onFindSimilar: (imageId: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onFindSimilar }) => {
  return (
    <div className="gallery-item">
      <img src={image.url} alt="" />
      <div className="tags">
        {image.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
      <button onClick={() => onFindSimilar(image.id)}>Find Similar</button>
    </div>
  );
};

export default ImageCard;
