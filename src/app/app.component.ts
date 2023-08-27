import { AsyncPipe, JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, combineLatest, finalize, map, Subject } from 'rxjs';
import { environment } from '../environments/environment';
import { MESSAGES } from './core/constants/messages/messages.constant';
import { TChatMessages } from './core/constants/messages/messages.type';
import { ChatService } from './core/services/chat.service';
import { SseService } from './core/services/sse.service';
import { TFrameData } from './core/types/frame-data.type';
import { TMessage } from './core/types/message.type';
import { TViewImage } from './core/types/view-image.type';
import { ButtonDirective } from './shared/directives/button.directive';
import { CarriageDirective } from './shared/directives/carriage.directive';
import { DynamicValidatorMessage } from './shared/directives/dynamic-message.directive';
import { IsSelectedDirective } from './shared/directives/is-selected.directive';
import { ValidatorMessageContainer } from './shared/directives/validator-message-container.directive';
import { handleChatImageLoadingError } from './shared/utils/image-error-handler.util';
import { receiveImageViaSse } from './shared/utils/receive-sse-image.util';
import { isIntegerValidator } from './shared/validators/is-integer.validator';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CarriageDirective,
    ButtonDirective,
    NgIf,
    NgForOf,
    IsSelectedDirective,
    NgClass,
    AsyncPipe,
    ReactiveFormsModule,
    DynamicValidatorMessage,
    ValidatorMessageContainer,
    JsonPipe
  ],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  readonly #chatService: ChatService = inject(ChatService);
  readonly #sseService: SseService<TFrameData> = inject(SseService);
  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #messages: TChatMessages = inject(MESSAGES);

  readonly #inProgress: WritableSignal<boolean> = signal(false);
  readonly #imageData$: Subject<TViewImage> = new Subject<TViewImage>();

  public readonly viewModel: Signal<{
    image: TViewImage,
    isLoading: boolean
  }> = toSignal(combineLatest([
    this.#imageData$,
    toObservable(this.#inProgress)
  ])
    .pipe(
      map(([image, isLoading]) => ({ image, isLoading }))
    ), {
    initialValue: {
      image: {
        url: '',
      },
      isLoading: false
    }
  });

  public readonly chat = toSignal(this.#chatService.chat$, {
    initialValue: [] as TMessage[]
  });

  readonly #url = new URL(`${environment.sseUrl}pictures/download/stream/sse/test`);

  public numberControl: FormControl<number> = new FormControl<number>(1, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(1), isIntegerValidator()]
  });

  public onSubmit(): void {
    if (this.numberControl.invalid || this.#inProgress()) return;

    this.#inProgress.set(true);

    this.#startLoading();

    receiveImageViaSse(this.#prepareLoadingUrl(this.numberControl.value), this.#sseService)
      .pipe(
        catchError((error) => {
          handleChatImageLoadingError(error, this.#chatService);
          return [];
        }),
        finalize(() => this.#inProgress.set(false)),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe((image) => this.#imageData$.next(image));
  }


  #startLoading(): void {
    this.#chatService.addMessage(this.#messages.startLoading);
  }

  #prepareLoadingUrl(imageNumber: number): string {
    const url = new URL(this.#url.toString());
    url.searchParams.set('testNumber', imageNumber.toString());

    return url.toString();
  }
}
