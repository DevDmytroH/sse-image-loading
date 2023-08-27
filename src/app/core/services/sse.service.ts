import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable, NgZone } from '@angular/core';
import { filter, map, NotFoundError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SseService<T> {
  readonly #zone: NgZone = inject(NgZone);

  public getServerSentEvent<T> (url: string, prefetchResource: boolean = false): Observable<T> {
    return new Observable((subscriber) => {
      const eventSource = this.#getEventSource(url);

      if (!eventSource) return;

      eventSource.onmessage = ({ data }: MessageEvent<{ data: string }>) => {
        this.#zone.run(() => subscriber.next(data));
      };

      eventSource.onerror = (error: Event) => {
        const isClosed = eventSource.readyState === EventSource.CLOSED;
        const preparedError = isClosed ? new HttpErrorResponse({
          error: new NotFoundError('Resource not found'),
          status: HttpStatusCode.NotFound
        }) : error;

        this.#zone.run(() => subscriber.error(preparedError));
      };
      return () => {
        eventSource.close();
      };

    }).pipe(
      filter((data): data is string => typeof data === 'string'),
      map((data) => JSON.parse(data) as T)
    );
  }

  #getEventSource (url: string): EventSource {
    return new EventSource(url);
  }
}
