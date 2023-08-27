import { ComponentRef, DestroyRef, Directive, inject, Input, OnInit, ViewContainerRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgControl } from '@angular/forms';
import { startWith } from 'rxjs';
import { InputErrorComponent } from '../components/input-error.component';

@Directive({
  selector: `
    [formControl]:not([withoutValidationErrors]),
    [formControlName]:not([withoutValidationErrors]),
  `,
  standalone: true
})
export class DynamicValidatorMessage implements OnInit {
  @Input()
  public container = inject(ViewContainerRef);
  public ngControl = inject(NgControl, { self: true });
  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  #componentRef: ComponentRef<InputErrorComponent> | null = null;

  public ngOnInit(): void {
    this.ngControl.control?.statusChanges.pipe(
        startWith(this.ngControl.control?.status),
        takeUntilDestroyed(this.#destroyRef),
      ).subscribe(() => {
        const control = this.ngControl.control;

        if (control && control.invalid && control.dirty) {
          if (!this.#componentRef) {
            this.#componentRef = this.container.createComponent(InputErrorComponent);
            this.#componentRef.changeDetectorRef.markForCheck();
          }
          this.#componentRef.setInput('errors', this.ngControl.errors);
        } else {
          this.#componentRef?.destroy();
          this.#componentRef = null;
        }
    })
  }
}
