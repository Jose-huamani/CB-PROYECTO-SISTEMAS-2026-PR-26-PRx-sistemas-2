import { filterImagePixels, validImageDimensions } from './image-editor.utils';

describe('Filtros del editor de imágenes', () => {
  it('convierte a grises conservando la transparencia', () => {
    const pixels = new Uint8ClampedArray([255, 0, 0, 80]);
    filterImagePixels(pixels, 'grayscale');
    expect([...pixels]).toEqual([54, 54, 54, 80]);
  });
  it('aplica sepia sin reutilizar canales ya modificados', () => {
    const pixels = new Uint8ClampedArray([100, 150, 200, 255]);
    filterImagePixels(pixels, 'sepia');
    expect([...pixels]).toEqual([192, 171, 134, 255]);
  });
  it('invierte colores y permite recuperar el original', () => {
    const pixels = new Uint8ClampedArray([10, 100, 230, 255]);
    filterImagePixels(pixels, 'invert');
    expect([...pixels]).toEqual([245, 155, 25, 255]);
    filterImagePixels(pixels, 'invert');
    expect([...pixels]).toEqual([10, 100, 230, 255]);
  });
  it('aumenta brillo y limita los canales a 255', () => {
    const pixels = new Uint8ClampedArray([100, 220, 255, 40]);
    filterImagePixels(pixels, 'brightness');
    expect([...pixels]).toEqual([120, 255, 255, 40]);
  });
  it('aumenta el contraste sin modificar el alfa', () => {
    const pixels = new Uint8ClampedArray([0, 128, 255, 190]);
    filterImagePixels(pixels, 'contrast');
    expect([...pixels]).toEqual([0, 128, 255, 190]);
  });
  it('procesa todos los píxeles', () => {
    const pixels = new Uint8ClampedArray([0, 0, 0, 0, 255, 255, 255, 255]);
    filterImagePixels(pixels, 'invert');
    expect([...pixels]).toEqual([255, 255, 255, 0, 0, 0, 0, 255]);
  });
});

describe('Dimensiones de exportación', () => {
  it('admite los límites permitidos', () => {
    expect(validImageDimensions(1, 4096)).toBe(true);
    expect(validImageDimensions(1920, 1080)).toBe(true);
  });
  it.each([[0, 100], [100, -1], [4097, 100], [100, 4097], [1.5, 20], [NaN, 10], [Infinity, 10]])('rechaza %s por %s', (width, height) => {
    expect(validImageDimensions(width, height)).toBe(false);
  });
});
