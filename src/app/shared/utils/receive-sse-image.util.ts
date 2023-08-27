import { assertInInjectionContext, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SseService } from '../../core/services/sse.service';
import { TFrameData } from '../../core/types/frame-data.type';
import { TViewImage } from '../../core/types/view-image.type';
import { composeImage } from '../operators/compose-image.operator';

export const receiveImageViaSse = (url: string, sseService?: SseService<TFrameData>): Observable<TViewImage> => {
  if (!sseService) {
    assertInInjectionContext(receiveImageViaSse);
    sseService = inject(SseService);
  }

  return sseService.getServerSentEvent<TFrameData>(url)
    .pipe(composeImage());
};
