import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as imageService from '../../api/services/images';

const ImageUpload: React.FC<{ onUpload: () => void }> = ({ onUpload }) => {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append('images', file);
      });

      try {
        await imageService.uploadImages(formData);
        onUpload();
      } catch (error) {
        console.error('Failed to upload images', error);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
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
