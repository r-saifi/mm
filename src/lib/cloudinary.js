/**
 * Upload a single File to Cloudinary using an unsigned upload preset.
 * Returns the secure HTTPS URL of the uploaded image.
 *
 * Set in .env:
 *   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
 *   VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
 */
export async function uploadToCloudinary(file, onProgress) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || cloudName.startsWith('YOUR_') || !uploadPreset || uploadPreset.startsWith('YOUR_')) {
    throw new Error(
      'Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and ' +
      'VITE_CLOUDINARY_UPLOAD_PRESET to your .env file.'
    );
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  // Use XMLHttpRequest so we can track upload progress
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve(data.secure_url);
      } else {
        reject(new Error(`Cloudinary upload failed: ${xhr.status} ${xhr.responseText}`));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
    xhr.open('POST', url);
    xhr.send(formData);
  });
}

/**
 * Upload multiple files concurrently, reporting per-file progress.
 * @param {Array<{file: File, id: string}>} fileObjs
 * @param {(id: string, pct: number) => void} onProgress
 * @returns {Promise<string[]>} Array of secure URLs in the same order
 */
export async function uploadMultipleToCloudinary(fileObjs, onProgress) {
  return Promise.all(
    fileObjs.map(({ file, id }) =>
      uploadToCloudinary(file, (pct) => onProgress?.(id, pct))
    )
  );
}
