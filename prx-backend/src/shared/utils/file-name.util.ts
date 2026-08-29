import { extname } from 'path';

export class FileNameUtil {
  static getExtension(originalName: string): string {
    return extname(originalName).replace('.', '').toLowerCase();
  }

  static removeMatchingExtension(name: string, extension: string): string {
    if (!extension) {
      return name;
    }

    const extensionSuffix = `.${extension}`;

    if (name.toLowerCase().endsWith(extensionSuffix)) {
      return name.slice(0, -extensionSuffix.length);
    }

    return name;
  }

  static toSafeStorageName(name: string, extension: string): string {
    const safeName =
      name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'file';

    if (!extension) {
      return safeName;
    }

    return `${safeName}.${extension}`;
  }
}
