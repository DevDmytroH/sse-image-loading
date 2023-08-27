import { InjectionToken } from '@angular/core';
import { TChatMessages } from './messages.type';

const DEFAULT_MESSAGES: TChatMessages = {
  greeting: '👋, World! \n I\'m Dmytro 🫠, \n Try to put some number 👇 and 👀 what happens! \n Hope you enjoy this demo!',
  startLoading: 'Good choice! \n Let me load your image 👇'
};

export const MESSAGES: InjectionToken<TChatMessages> = new InjectionToken<TChatMessages>('Messages', {
  providedIn: 'root',
  factory: () => DEFAULT_MESSAGES
});
