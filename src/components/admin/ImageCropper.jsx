import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { motion } from 'framer-motion';
import { X, Crop, CheckCircle } from '@phosphor-icons/react';

// Helper to get cropped image blob
async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  // set canvas size to match the bounding box
  canvas.width = image.width;
  canvas.height = image.height;

  // draw image
  ctx.translate(image.width / 2, image.height / 2);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  // extract cropped area
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  // set canvas width to final desired crop size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated image
  ctx.putImageData(data, 0, 0);

  // Return blob
  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(file);
    }, 'image/jpeg');
  });
}

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });
}

export default function ImageCropper({ file, onCropComplete, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  React.useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
  }, [file]);

  const onCropChange = (crop) => setCrop(crop);
  const onZoomChange = (zoom) => setZoom(zoom);
  const onCropCompleteFn = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleApply = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      // Give it the same name/type conceptually, though it's a blob
      const croppedFile = new File([croppedImageBlob], file.name, {
        type: 'image/jpeg',
      });
      onCropComplete(croppedFile);
    } catch (e) {
      console.error(e);
      alert('Failed to crop image.');
    }
  };

  if (!imageSrc) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl h-[80vh] flex flex-col bg-bgMain border border-glassBorder rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-glassBorder bg-glassBg/50">
          <div className="flex items-center gap-3">
            <Crop size={24} className="text-accent" />
            <h2 className="text-xl font-display font-bold text-textMain">Crop Hero Image</h2>
          </div>
          <button onClick={onCancel} className="text-textMuted hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="relative flex-1 bg-black/50 w-full h-full">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={4 / 5} // Using a consistent 4:5 vertical ratio for hero stack cards
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteFn}
            onZoomChange={onZoomChange}
          />
        </div>

        <div className="p-6 bg-glassBg border-t border-glassBorder flex items-center justify-between">
          <div className="flex-1 max-w-sm flex items-center gap-4">
            <span className="text-sm font-semibold text-textMuted uppercase">Zoom</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(e.target.value)}
              className="flex-1 accent-accent"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="px-6 py-3 rounded-xl border border-glassBorder text-textMuted hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="flex items-center gap-2 px-8 py-3 bg-accent text-white font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(var(--accent-rgb),0.3)] transition-all"
            >
              <CheckCircle size={20} weight="bold" />
              Apply & Upload
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
