import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Modal, Progress, notification, Button } from "antd";
import { InboxOutlined, DeleteOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useUploadImagesMutation } from "../../../api/services/images";

interface ImageUploadProps {
  onUpload: () => void;
  open: boolean;
  onClose: () => void;
}

interface FileWithPreview {
  file: File;
  preview: string;
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  open,
  onClose,
}) => {
  const [uploadImages, { isLoading }] = useUploadImagesMutation();
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: { file: File }[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const rejectedFileNames = rejectedFiles.map(f => f.file.name).join(', ');
        notification.warning({
          message: "Some files were rejected",
          description: `Only image files (JPEG, PNG, WebP, GIF) are allowed. Rejected: ${rejectedFileNames}`,
        });
      }

      if (acceptedFiles.length === 0) return;

      // Create file objects with preview and status
      const newFiles: FileWithPreview[] = acceptedFiles.map((file) => ({
        file: file,
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        preview: URL.createObjectURL(file),
        status: 'pending' as const,
        progress: 0,
      }));

      setFiles(prev => [...prev, ...newFiles]);
    },
    []
  );

  // Upload functionality
  const handleUpload = useCallback(async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    // Set all pending files to uploading
    setFiles(prev => prev.map(f => 
      f.status === 'pending' ? { ...f, status: 'uploading' as const } : f
    ));

    let progressInterval: ReturnType<typeof setInterval> | null = null;

    try {
      const formData = new FormData();
      pendingFiles.forEach((fileWrapper) => {
        formData.append("images", fileWrapper.file);
      });
      

      // Simulate progress for individual files
      progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.status === 'uploading' && f.progress < 90) {
            return { ...f, progress: Math.min(f.progress + Math.random() * 15, 90) };
          }
          return f;
        }));
      }, 200);

      await uploadImages(formData).unwrap();
      
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
      
      // Mark all uploading files as success
      setFiles(prev => prev.map(f => 
        f.status === 'uploading' ? { ...f, status: 'success' as const, progress: 100 } : f
      ));

      notification.success({
        message: "Upload Successful",
        description: `${pendingFiles.length} image(s) have been uploaded successfully.`,
      });

      setTimeout(() => {
        onUpload();
        onClose();
        setFiles([]);
      }, 1500);

    } catch (error) {
      console.error("Failed to upload images", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        response: error && typeof error === 'object' && 'response' in error ? (error as { response: { data: unknown } }).response?.data : undefined,
        status: error && typeof error === 'object' && 'response' in error ? (error as { response: { status: number } }).response?.status : undefined,
      });
      
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
      
      // Mark all uploading files as error
      setFiles(prev => prev.map(f => 
        f.status === 'uploading' ? { 
          ...f, 
          status: 'error' as const, 
          error: error instanceof Error ? error.message : 'Upload failed' 
        } : f
      ));

      notification.error({
        message: "Upload Failed",
        description: error instanceof Error ? error.message : "There was an error uploading your images. Please try again.",
      });
    }
  }, [files, uploadImages, onUpload, onClose]);

  // Remove file
  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      // Clean up preview URL
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updated;
    });
  }, []);

  // Clear all files
  const clearAllFiles = useCallback(() => {
    files.forEach(f => URL.revokeObjectURL(f.preview));
    setFiles([]);
  }, [files]);

  // Close modal handler
  const handleClose = useCallback(() => {
    if (isLoading || files.some(f => f.status === 'uploading')) {
      notification.warning({
        message: "Upload in Progress",
        description: "Please wait for the upload to complete before closing.",
      });
      return;
    }
    clearAllFiles();
    onClose();
  }, [isLoading, files, clearAllFiles, onClose]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/gif': ['.gif']
    },
    maxSize: 10 * 1024 * 1024, // 10MB max file size
    multiple: true,
  });

  const pendingFiles = files.filter(f => f.status === 'pending');
  const uploadingFiles = files.filter(f => f.status === 'uploading');
  const completedFiles = files.filter(f => f.status === 'success');


  return (
    <Modal
      title={
        <div className="flex items-center justify-between">
          <span>Upload Images</span>
          {files.length > 0 && (
            <span className="text-sm text-gray-500">
              {completedFiles.length}/{files.length} completed
            </span>
          )}
        </div>
      }
      open={open}
      onCancel={handleClose}
      footer={
        files.length > 0 ? (
          <div className="flex justify-between items-center">
            <Button 
              onClick={clearAllFiles}
              disabled={isLoading}
              className="text-gray-600"
            >
              Clear All
            </Button>
            <div className="flex gap-2">
              <Button onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleUpload}
                disabled={pendingFiles.length === 0 || isLoading}
                loading={isLoading}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Upload {pendingFiles.length > 0 ? `${pendingFiles.length} File${pendingFiles.length > 1 ? 's' : ''}` : ''}
              </Button>
            </div>
          </div>
        ) : null
      }
      destroyOnClose
      width={600}
      className="upload-modal"
    >
      <div className="space-y-4">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`transition-all duration-300 rounded-lg border-2 border-dashed p-8 text-center cursor-pointer ${
            isDragActive 
              ? "border-blue-400 bg-blue-50" 
              : files.length > 0 
                ? "border-gray-200 bg-gray-50" 
                : "border-gray-300 hover:border-blue-300 hover:bg-blue-50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <InboxOutlined 
              className={`text-4xl ${
                isDragActive ? "text-blue-500" : "text-gray-400"
              }`} 
            />
            <div>
              <p className="text-lg font-medium text-gray-700">
                {isDragActive 
                  ? "Drop the images here..." 
                  : files.length > 0 
                    ? "Drop more images or click to select"
                    : "Click or drag images to upload"
                }
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Supports JPEG, PNG, WebP, GIF • Max 10MB per file
              </p>
            </div>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">
                Selected Files ({files.length})
              </h4>
            </div>
            
              {files.map((fileWrapper) => (
                <div
                  key={fileWrapper.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border"
                >
                  {/* Preview */}
                  <div className="relative">
                    <img
                      src={fileWrapper.preview}
                      alt={fileWrapper.file.name}
                      className="w-12 h-12 object-cover rounded border"
                    />
                    {/* Status overlay */}
                    <div className="absolute -top-1 -right-1">
                      {fileWrapper.status === 'success' && (
                        <CheckCircleOutlined className="text-green-500 bg-white rounded-full" />
                      )}
                      {fileWrapper.status === 'error' && (
                        <ExclamationCircleOutlined className="text-red-500 bg-white rounded-full" />
                      )}
                    </div>
                  </div>

                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fileWrapper.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(fileWrapper.file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    
                    {/* Progress bar */}
                    {fileWrapper.status === 'uploading' && (
                      <Progress 
                        percent={fileWrapper.progress} 
                        size="small" 
                        className="mt-1"
                        strokeColor="#3b82f6"
                      />
                    )}
                    
                    {/* Error message */}
                    {fileWrapper.status === 'error' && fileWrapper.error && (
                      <p className="text-xs text-red-500 mt-1">{fileWrapper.error}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {fileWrapper.status === 'pending' && (
                      <Button
                        type="text"
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => removeFile(fileWrapper.id)}
                        className="text-gray-400 hover:text-red-500"
                      />
                    )}
                    {fileWrapper.status === 'success' && (
                      <CheckCircleOutlined className="text-green-500" />
                    )}
                    {fileWrapper.status === 'error' && (
                      <Button
                        type="text"
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => removeFile(fileWrapper.id)}
                        className="text-red-400 hover:text-red-600"
                      />
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Overall progress */}
        {uploadingFiles.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Uploading {uploadingFiles.length} file{uploadingFiles.length > 1 ? 's' : ''}...
              </span>
              <span className="text-sm text-gray-500">
                {completedFiles.length} of {files.length} completed
              </span>
            </div>
            <Progress
              percent={(completedFiles.length / files.length) * 100}
              strokeColor="#3b82f6"
              className="mb-0"
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export { ImageUpload };
