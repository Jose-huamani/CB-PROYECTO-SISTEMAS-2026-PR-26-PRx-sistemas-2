export type ImageFilter = 'grayscale' | 'sepia' | 'invert' | 'brightness' | 'contrast';
export const MAX_IMAGE_DIMENSION = 4096;

export function validImageDimensions(width: number, height: number): boolean {
  return Number.isInteger(width) && Number.isInteger(height) &&
    width >= 1 && height >= 1 && width <= MAX_IMAGE_DIMENSION && height <= MAX_IMAGE_DIMENSION;
}

export function filterImagePixels(pixels: Uint8ClampedArray, filter: ImageFilter): void {
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
    switch (filter) {
      case 'grayscale': {
        const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        pixels[i] = pixels[i + 1] = pixels[i + 2] = gray;
        break;
      }
      case 'sepia':
        pixels[i] = 0.393 * r + 0.769 * g + 0.189 * b;
        pixels[i + 1] = 0.349 * r + 0.686 * g + 0.168 * b;
        pixels[i + 2] = 0.272 * r + 0.534 * g + 0.131 * b;
        break;
      case 'invert':
        pixels[i] = 255 - r; pixels[i + 1] = 255 - g; pixels[i + 2] = 255 - b;
        break;
      case 'brightness':
        pixels[i] = r * 1.2; pixels[i + 1] = g * 1.2; pixels[i + 2] = b * 1.2;
        break;
      case 'contrast':
        pixels[i] = (r - 128) * 1.2 + 128;
        pixels[i + 1] = (g - 128) * 1.2 + 128;
        pixels[i + 2] = (b - 128) * 1.2 + 128;
        break;
    }
  }
}
