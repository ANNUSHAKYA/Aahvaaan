/**
 * Client-side WebP image compression utility for Aahvaaan.
 * Resizes large photos to optimal dimensions and converts to modern WebP format
 * before sending to Supabase Storage, dramatically speeding up mobile page loads.
 */

export async function compressImageToWebP(
  file,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.82
) {
  return new Promise((resolve, reject) => {
    // If SVG, return as is (vectors don't need raster compression)
    if (file.type === 'image/svg+xml') {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = (err) => reject(new Error('Failed to read image file'));

    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image data'));

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions keeping aspect ratio
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            maxHeight = maxHeight;
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file); // Fallback to raw file if canvas fails
          return;
        }

        // Apply smooth downsampling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file); // Fallback if WebP conversion fails
              return;
            }

            const cleanBaseName = file.name
              ? file.name.substring(0, file.name.lastIndexOf('.')) || 'image'
              : 'image';
            const safeName = `${cleanBaseName.replace(/[^a-zA-Z0-9_-]/g, '_')}_${Date.now()}.webp`;

            const compressedFile = new File([blob], safeName, {
              type: 'image/webp',
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          'image/webp',
          quality
        );
      };

      img.src = readerEvent.target.result;
    };

    reader.readAsDataURL(file);
  });
}
