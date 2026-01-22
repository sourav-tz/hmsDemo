import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IoIosCloudUpload, IoMdRefresh } from 'react-icons/io';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AlertCircle } from 'lucide-react';

// File size limits in bytes
const MAX_FILE_SIZE = 1 * 100 * 1024; // 100KB
const MIN_FILE_SIZE = 1 * 1024; // 1KB

const FileUpload = ({
  onUploadSuccess,
  label,
  accept = "image/*,.pdf",
  fileUrl = null,
  fieldName = "document",
  disabled = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Format file size to human-readable format
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Get accepted file types as an array for display
  const getAcceptedFileTypes = () => {
    return accept.split(',').map(type => {
      if (type === 'image/*') return 'Images: JPEG, PNG, JPG, WEBP';
      if (type === '.pdf') return 'PDF';
      return type.replace('.', '').toUpperCase();
    }).join(', ');
  };

  const validateFile = (file) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File is too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}`);
      return false;
    }

    if (file.size < MIN_FILE_SIZE) {
      toast.error(`File is too small. Minimum size is ${formatFileSize(MIN_FILE_SIZE)}`);
      return false;
    }

    // Check file type
    const fileType = file.type;
    const fileExtension = file.name.split('.').pop().toLowerCase();

    // Handle image types
    if (accept.includes('image/*') && fileType.startsWith('image/')) {
      return true;
    }

    // Handle PDF
    if (accept.includes('.pdf') && (fileType === 'application/pdf' || fileExtension === 'pdf')) {
      return true;
    }

    // Handle other specific types
    const acceptedTypes = accept.split(',').map(t => t.trim());
    if (acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return `.${fileExtension}` === type;
      }
      return fileType === type;
    })) {
      return true;
    }

    toast.error(`Invalid file type. Accepted types: ${getAcceptedFileTypes()}`);
    return false;
  };

  const handleFileChange = (e) => {
    // Don't process if component is disabled
    if (disabled) {
      return;
    }

    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      if (validateFile(selectedFile)) {
        uploadFile(selectedFile);
      }
    }
  };

  const handleReplace = () => {
    // Don't process if component is disabled
    if (disabled) {
      return;
    }

    // Trigger file input click
    document.getElementById(`file-upload-${fieldName}`).click();
  };

  const uploadFile = async (selectedFile) => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await toast.promise(
        axios.post(
          `${import.meta.env.VITE_BASE_URL}/student/uploadDocument`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            },
          }
        ),
        {
          pending: 'Uploading document...',
          success: 'Document uploaded successfully!',
          error: {
            render({data}) {
              // When the promise reject, data will contains the error
              const errorMsg = data?.response?.data?.message || 'Failed to upload document';
              return errorMsg;
            }
          }
        }
      );

      if (response.data.success) {
        onUploadSuccess(response.data.data.url);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className={`w-full ${disabled ? 'opacity-70' : ''}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label || 'Upload Document'}
      </label>

      {/* File restrictions info */}
      <div className="text-xs text-gray-500 mb-2 flex items-start">
        <AlertCircle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
        <span>
          Accepted formats: {getAcceptedFileTypes()} |
          Max size: {formatFileSize(MAX_FILE_SIZE)}
        </span>
      </div>

      <div className="mt-1 flex items-center">
        {fileUrl ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex items-center text-blue-600 border-blue-300 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleReplace}
            disabled={disabled || isUploading}
          >
            <IoMdRefresh className="mr-1 h-4 w-4" />
            Replace File
          </Button>
        ) : (
          <label
            htmlFor={`file-upload-${fieldName}`}
            className={`${disabled ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer bg-white hover:bg-gray-50'} py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center`}
          >
            <IoIosCloudUpload className="mr-2 h-5 w-5 text-gray-400" />
            <span>{file ? file.name : 'Choose file'}</span>
            <input
              id={`file-upload-${fieldName}`}
              name={`file-upload-${fieldName}`}
              type="file"
              className="sr-only"
              onChange={handleFileChange}
              accept={accept}
              disabled={disabled || isUploading}
            />
          </label>
        )}

        {isUploading && (
          <div className="ml-3 flex flex-col w-32">
            <div className="text-sm text-gray-500">Uploading... {uploadProgress}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden input for replace functionality */}
      <input
        id={`file-upload-${fieldName}`}
        name={`file-upload-${fieldName}`}
        type="file"
        className="sr-only"
        onChange={handleFileChange}
        accept={accept}
        disabled={disabled || isUploading}
      />
    </div>
  );
};

export default FileUpload;
