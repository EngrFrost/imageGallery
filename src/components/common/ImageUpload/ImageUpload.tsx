import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Modal, Spin, notification } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useUploadImagesMutation } from "../../../api/services/images";

interface ImageUploadProps {
  onUpload: () => void;
  open: boolean;
  onClose: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  open,
  onClose,
}) => {
  const [uploadImages, { isLoading }] = useUploadImagesMutation();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append("images", file);
      });

      try {
        await uploadImages(formData).unwrap();
        notification.success({
          message: "Upload Successful",
          description: "Your images have been uploaded.",
        });
        onUpload();
        onClose();
      } catch (error) {
        console.error("Failed to upload images", error);
        notification.error({
          message: "Upload Failed",
          description: "There was an error uploading your images.",
        });
      }
    },
    [onUpload, uploadImages, onClose]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  return (
    <Modal
      title="Upload Images"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Spin spinning={isLoading}>
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? "active" : ""}`}
          style={{
            border: `2px dashed ${isDragActive ? "#1890ff" : "#d9d9d9"}`,
            borderRadius: "4px",
            padding: "40px",
            textAlign: "center",
            cursor: "pointer",
            transition: "border-color 0.3s",
          }}
        >
          <input {...getInputProps()} />
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ fontSize: "48px", color: "#1890ff" }} />
          </p>
          <p style={{ fontSize: "16px", color: "#555" }}>
            Click or drag files to this area to upload
          </p>
          <p style={{ color: "#999" }}>
            Support for a single or bulk upload.
          </p>
        </div>
      </Spin>
    </Modal>
  );
};

export default ImageUpload;
