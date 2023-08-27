import { Directive, inject, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[validatorMessageContainer]',
  standalone: true,
  exportAs: 'validatorMessageContainer'
})
export class ValidatorMessageContainer {
  public readonly container = inject(ViewContainerRef);
}
