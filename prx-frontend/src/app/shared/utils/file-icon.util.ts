export function getFileIconByExtension(extension: string): string {
  const normalizedExtension = extension.toLowerCase().trim();

  if (
    ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff'].includes(normalizedExtension)
  ) {
    return 'pi pi-image';
  }

  if (['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv'].includes(normalizedExtension)) {
    return 'pi pi-video';
  }

  if (['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'].includes(normalizedExtension)) {
    return 'pi pi-volume-up';
  }

  if (normalizedExtension === 'pdf') {
    return 'pi pi-file-pdf';
  }

  if (['csv', 'xls', 'xlsx'].includes(normalizedExtension)) {
    return 'pi pi-file-excel';
  }

  if (['doc', 'docx'].includes(normalizedExtension)) {
    return 'pi pi-file-word';
  }

  if (['ppt', 'pptx'].includes(normalizedExtension)) {
    return 'pi pi-desktop';
  }

  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(normalizedExtension)) {
    return 'pi pi-box';
  }

  if (
    [
      'html',
      'css',
      'scss',
      'sass',
      'less',
      'js',
      'jsx',
      'ts',
      'tsx',
      'json',
      'xml',
      'yml',
      'yaml',
    ].includes(normalizedExtension)
  ) {
    return 'pi pi-code';
  }

  if (
    ['java', 'cs', 'cpp', 'c', 'py', 'php', 'rb', 'go', 'rs', 'kt', 'swift', 'dart'].includes(
      normalizedExtension,
    )
  ) {
    return 'pi pi-code';
  }

  if (['sql', 'db', 'sqlite'].includes(normalizedExtension)) {
    return 'pi pi-database';
  }

  if (['env', 'ini', 'conf', 'config', 'properties'].includes(normalizedExtension)) {
    return 'pi pi-cog';
  }

  if (['md', 'txt', 'rtf'].includes(normalizedExtension)) {
    return 'pi pi-file-edit';
  }

  return 'pi pi-file';
}
