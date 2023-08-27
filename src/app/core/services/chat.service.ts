import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MESSAGES } from '../constants/messages/messages.constant';
import { TChatMessages } from '../constants/messages/messages.type';
import { DefaultMessage, ErrorMessage, Message } from '../models/message.models';
import { TMessage } from '../types/message.type';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  readonly #chat: BehaviorSubject<TMessage[]> = new BehaviorSubject<TMessage[]>([]);
  readonly #messages: TChatMessages = inject(MESSAGES);

  public readonly chat$ = this.#chat.asObservable();

  constructor() {
    this.addMessage(this.#messages.greeting);
  }

  public addMessage(text: string, type: 'error'| 'default' = 'default'): void {
      const currentValue = this.#chat.getValue();

      const normalizedText = '\t' + text;

      const message = this.#getInstanceOfMessage(type).getMessage(normalizedText);
      this.#chat.next([...currentValue, message]);
  }

  #getInstanceOfMessage(type: 'error'| 'default'): Message {
    const types = {
      error: ErrorMessage,
      default: DefaultMessage
    }

    return new types[type]();
  }
}
