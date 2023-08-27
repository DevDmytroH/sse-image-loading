export const getImageDimensions = (imageData: Uint8Array): { width: number, height: number } | undefined => {
  let offset = 2;

  while (offset < imageData.length) {
    if (imageData[offset] === 0xFF) {
      const marker = imageData[offset + 1];
      const markerLength = (imageData[offset + 2] << 8) + imageData[offset + 3];

      if (marker >= 0xC0 && marker <= 0xCF) {
        const height = (imageData[offset + 5] << 8) + imageData[offset + 6];
        const width = (imageData[offset + 7] << 8) + imageData[offset + 8];
        return { width, height };
      }

      offset += markerLength + 2;
    } else {
      break;
    }
  }

  return undefined;
}
