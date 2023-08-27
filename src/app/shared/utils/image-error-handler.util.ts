import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { assertInInjectionContext, inject } from '@angular/core';
import { ChatService } from '../../core/services/chat.service';

export const handleChatImageLoadingError = (error: unknown, chatService?: ChatService ) => {
  if (!chatService) {
    assertInInjectionContext(handleNotFoundError);
    chatService = inject(ChatService);
  }

  if (!(error instanceof HttpErrorResponse)) {
    handleStreamClosing(chatService!);
    return;
  }

  const handler = {
    [HttpStatusCode.NotFound]: handleNotFoundError,
  }[error.status] || handleNotRecognizedError;

  handler(error, chatService);
}

const handleNotRecognizedError = (error: HttpErrorResponse, chatService: ChatService ) => {
  chatService.addMessage('Something unexpected happened. Please try again later.', 'error');
}

const handleNotFoundError = (error: HttpErrorResponse, chatService: ChatService ) => {
  chatService.addMessage('We really tried ☹️ \n but we could not find image you are 👀 for.', 'error');
}

const handleStreamClosing = (chatService: ChatService) => {
  chatService.addMessage(`The image has loaded successfully!🫡`);
}
