import { Injectable } from '@angular/core';
import { TMessage } from '../types/message.type';

@Injectable()
export abstract class Message {
  abstract getMessage (text: string): TMessage;
}

@Injectable()
export class DefaultMessage implements Message {
  public getMessage (text: string): TMessage {
    return {
      text,
      styles: ''
    };
  }
}


@Injectable()
export class ErrorMessage implements Message {
  public getMessage (text: string): TMessage {
    return {
      text,
      styles: 'text-red-500'
    };
  }
}
