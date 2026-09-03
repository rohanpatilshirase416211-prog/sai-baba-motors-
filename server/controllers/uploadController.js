const path = require('path');
const fs = require('fs');

// Modular cloud storage adapter (Cloudinary)
let cloudinary = null;
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  try {
    cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log('[Storage] Cloudinary configured successfully.');
  } catch (err) {
    console.warn('[Storage] Could not initialize Cloudinary:', err.message);
  }
}

// @desc    Upload vehicle images (multiple supported)
// @route   POST /api/upload
// @access  Public (or Admin protected for vehicle admin)
const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      // Check for single file fallback
      if (req.file) {
        req.files = [req.file];
      } else {
        return res.status(400).json({
          success: false,
          message: 'Please upload at least one image file',
        });
      }
    }

    const uploadedUrls = [];

    for (const file of req.files) {
      if (cloudinary) {
        // Cloudinary upload
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'saibaba_motors/vehicles',
            transformation: [{ quality: 'auto:good', fetch_format: 'auto' }],
          });
          uploadedUrls.push(result.secure_url);
          // Delete temp local file after cloud upload
          fs.unlink(file.path, () => {});
        } catch (cloudErr) {
          console.error('[Cloudinary Upload Error]', cloudErr);
          // Fallback to local url if cloud upload fails
          uploadedUrls.push(`/uploads/${file.filename}`);
        }
      } else {
        // Local server static path
        uploadedUrls.push(`/uploads/${file.filename}`);

        // Also copy to client/public/uploads so static builds include newly uploaded files
        try {
          const clientPublicUploads = path.join(__dirname, '..', '..', 'client', 'public', 'uploads');
          if (!fs.existsSync(clientPublicUploads)) {
            fs.mkdirSync(clientPublicUploads, { recursive: true });
          }
          fs.copyFileSync(file.path, path.join(clientPublicUploads, file.filename));
        } catch (copyErr) {
          // Non-critical, continue
        }
      }
    }

    res.status(200).json({
      success: true,
      message: `${uploadedUrls.length} image(s) uploaded successfully`,
      urls: uploadedUrls,
      primaryUrl: uploadedUrls[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImages };
