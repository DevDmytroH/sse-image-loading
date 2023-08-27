import { bufferCount, map, Observable, OperatorFunction, scan, throttleTime } from 'rxjs';
import { TFrameData } from '../../core/types/frame-data.type';
import { TViewImage } from '../../core/types/view-image.type';
import { createImageUrl } from '../utils/create-image-url.util';
import { getImageDimensions } from '../utils/get-image-dimension.util';

export const composeImage = (bufferSize = 10, throttleMs = 200): OperatorFunction<TFrameData, TViewImage> => {
  return (source: Observable<TFrameData>) => source.pipe(
    bufferCount(bufferSize),
    scan<TFrameData[], Uint8Array>((imageData: Uint8Array, frameDataArray: TFrameData[]) => {

      for (const frameData of frameDataArray) {
        if (!imageData.length) {
          imageData = new Uint8Array(frameData.pictureSize);
        }

        const frameBytes = convertBase64ToUint8Array(frameData.frameData);
        imageData.set(frameBytes, frameData.frameOffset);
      }

      return imageData;
    }, new Uint8Array()),
    throttleTime(throttleMs),
    map((imageData: Uint8Array) => ({
      url: createImageUrl(imageData),
      dimension: getImageDimensions(imageData)
    })),
  )
}

const convertBase64ToUint8Array = (base64: string): Uint8Array => {
  return new Uint8Array(atob(base64).split('').map(char => char.charCodeAt(0)));
}
