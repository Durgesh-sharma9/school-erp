import ImageKit from 'imagekit';

const isConfigured = 
  process.env.IMAGEKIT_PUBLIC_KEY && 
  process.env.IMAGEKIT_PUBLIC_KEY !== 'your_imagekit_public_key' &&
  process.env.IMAGEKIT_PRIVATE_KEY && 
  process.env.IMAGEKIT_PRIVATE_KEY !== 'your_imagekit_private_key' &&
  process.env.IMAGEKIT_URL_ENDPOINT && 
  process.env.IMAGEKIT_URL_ENDPOINT !== 'https://ik.imagekit.io/your_imagekit_id';

const imagekit = isConfigured ? new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
}) : null;

/**
 * Upload buffer or base64 file to ImageKit
 * @param {Buffer|string} file - File buffer or base64 string
 * @param {string} fileName - Destination file name
 * @param {string} folder - Destination folder (e.g. 'students', 'logos', 'staff')
 * @returns {Promise<{ url: string, fileId: string }>}
 */
export const uploadToImageKit = async (file, fileName, folder = 'school_erp') => {
  if (!isConfigured || !imagekit) {
    console.warn('[ImageKit Service] Credentials not configured. Returning fallback mock URL.');
    return {
      url: `/uploads/${folder}/${fileName}`,
      fileId: `mock_${Date.now()}`
    };
  }

  try {
    const response = await imagekit.upload({
      file: file,
      fileName: fileName,
      folder: folder,
      useUniqueFileName: true
    });

    return {
      url: response.url,
      fileId: response.fileId
    };
  } catch (error) {
    console.error('[ImageKit Upload Error]:', error.message);
    throw error;
  }
};

/**
 * Delete a file from ImageKit by fileId
 * @param {string} fileId
 */
export const deleteFromImageKit = async (fileId) => {
  if (!isConfigured || !imagekit || !fileId || fileId.startsWith('mock_')) return;
  try {
    await imagekit.deleteFile(fileId);
  } catch (error) {
    console.error('[ImageKit Delete Error]:', error.message);
  }
};
