const cloudinary = require('cloudinary');
const getDataUri = require('./datauri');

/**
 * Upload a file to Cloudinary
 * @param {Object} file - The file object from multer
 * @param {String} folder - The folder to upload to in Cloudinary
 * @returns {Promise} - The Cloudinary upload result
 */
const uploadToCloudinary = async (file, folder = 'student_documents') => {
  try {
    // Convert file buffer to data URI
    const fileUri = getDataUri(file);
    
    // Upload to Cloudinary
    const result = await cloudinary.v2.uploader.upload(fileUri.content, {
      folder: folder,
      resource_type: 'auto', // Automatically detect file type
    });
    
    return {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('File upload failed');
  }
};

module.exports = { uploadToCloudinary };
