// Media utilities: compress images, validate videos, safe localStorage
// Goal: keep payloads small enough to persist in localStorage without quota errors.

const MAX_IMAGE_DIMENSION = 1024; // px (longest side)
const IMAGE_QUALITY = 0.7; // JPEG quality 0-1
const MAX_VIDEO_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * Compress an image File to a base64 JPEG data URL.
 * Resizes so longest side <= MAX_IMAGE_DIMENSION, quality 0.7.
 */
export const compressImage = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Falha ao ler arquivo'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Falha ao carregar imagem'));
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > MAX_IMAGE_DIMENSION) {
          height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
          width = MAX_IMAGE_DIMENSION;
        } else if (height > MAX_IMAGE_DIMENSION) {
          width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
          height = MAX_IMAGE_DIMENSION;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', IMAGE_QUALITY);
        resolve(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

/**
 * Convert a video File to base64 data URL if within size limit.
 * Throws if file is too large.
 */
export const videoToBase64 = (file) =>
  new Promise((resolve, reject) => {
    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      reject(new Error(`Vídeo muito grande. Máximo ${MAX_VIDEO_SIZE_BYTES / 1024 / 1024}MB.`));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Falha ao ler vídeo'));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });

/**
 * Process any media file (image or video).
 * Returns { type: 'image' | 'video', dataUrl, mimeType }
 */
export const processMediaFile = async (file) => {
  if (file.type.startsWith('image/')) {
    const dataUrl = await compressImage(file);
    return { type: 'image', dataUrl, mimeType: 'image/jpeg' };
  }
  if (file.type.startsWith('video/')) {
    const dataUrl = await videoToBase64(file);
    return { type: 'video', dataUrl, mimeType: file.type };
  }
  throw new Error('Tipo de arquivo não suportado');
};

/**
 * Save to localStorage with try/catch. Returns true on success.
 */
export const safeSetLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return { success: true };
  } catch (err) {
    const isQuota =
      err && (err.name === 'QuotaExceededError' || err.code === 22 || err.code === 1014);
    return {
      success: false,
      error: isQuota
        ? 'Espaço de armazenamento cheio. Remova posts antigos ou reduza fotos/vídeos.'
        : 'Falha ao salvar localmente. Tente novamente.',
    };
  }
};

export const MEDIA_LIMITS = {
  MAX_IMAGE_DIMENSION,
  IMAGE_QUALITY,
  MAX_VIDEO_SIZE_BYTES,
};
