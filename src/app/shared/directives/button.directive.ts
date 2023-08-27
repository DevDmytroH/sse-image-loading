import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: 'button:not([customButton])',
  standalone: true
})
export class ButtonDirective {
  readonly #focusClasses = 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 focus:ring-opacity-50';
  readonly #baseClasses = `capitalize hover:text-sky-400 transition duration-300 ease-in-out ${this.#focusClasses} before:content-['['] after:content-[']']`;
  readonly #disabledClasses = 'opacity-50 pointer-events-none';

  @HostBinding('class') class = this.#baseClasses;

  @Input('disabled') set disabled(value: boolean) {
    if (value) {
      this.class += ` ${this.#disabledClasses}`;
    }
    else this.class = this.class.replace(this.#disabledClasses, '')
  }
}
