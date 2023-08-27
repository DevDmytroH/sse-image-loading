import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[isSelected]',
  standalone: true,
  exportAs: 'isSelected'
})
export class IsSelectedDirective {

  public isFocused: boolean = false;
  @HostListener('focus', ['$event']) onFocus() {
    this.isFocused = true;
  }

  @HostListener('blur', ['$event']) onBlur() {
    this.isFocused = false;
  }
}
