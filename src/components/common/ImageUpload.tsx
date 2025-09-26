import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadImagesMutation } from "../../api/imageApi";

const ImageUpload: React.FC<{ onUpload: () => void }> = ({ onUpload }) => {
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? "active" : ""}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
};

export default ImageUpload;
