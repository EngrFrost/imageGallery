import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadImagesMutation } from "../../../api/imageApi";

interface ImageUploadProps {
  onUpload: () => void;
  children: React.ReactElement;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload, children }) => {
  const [uploadImages] = useUploadImagesMutation();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append("images", file);
      });

      try {
        await uploadImages(formData).unwrap();
        onUpload();
      } catch (error) {
        console.error("Failed to upload images", error);
      }
    },
    [onUpload, uploadImages]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true, // Prevents opening file dialog on click
  });

  // Attach the dropzone props to the single child element
  const childWithDropzone = React.cloneElement(children, {
    ...getRootProps(),
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {childWithDropzone}
    </div>
  );
};

export default ImageUpload;
