export const createImageUrl = (imageData: Uint8Array): string => {
  const blob = new Blob([imageData], { type: 'image/jpeg' });

  return URL.createObjectURL(blob);
}
