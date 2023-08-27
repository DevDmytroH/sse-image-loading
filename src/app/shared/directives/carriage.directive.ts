import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[carriage]',
  standalone: true
})
export class CarriageDirective {
  readonly #active = `before:animate-pulse before:text-sky-400`;

  @HostBinding('class')
  class = `relative before:content-['>'] before:absolute before:top-0 before:left-0`;

  @Input({
    alias: 'carriage',
    transform: (value: string) => !!value ? value : 'top'
  }) set position(value: 'top' | 'center' | '') {
    if (value === 'top') {
      this.#setTopPosition();
    }
    else if (value === 'center') {
      this.#setCenterPosition();
    }
  }

  @Input('active') set color(value: boolean) {
    if (value) {
      this.class += ` ${this.#active}`;
    }
    else this.class = this.class.replace(this.#active, '')
  }

  #setTopPosition(): void {
    this.class += ' before:top-0 before:left-0';
  }

  #setCenterPosition(): void {
    this.class += ' before:top-1/2 before:-translate-y-1/2';
  }
}
