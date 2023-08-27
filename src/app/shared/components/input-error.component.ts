import { KeyValue, KeyValuePipe, NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { ErrorMessagePipe } from '../pipes/error-message.pipe';

@Component({
  selector: 'app-input-error',
  standalone: true,
  imports: [NgForOf, ErrorMessagePipe, KeyValuePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'absolute' },
  template: `
    <div *ngFor="let error of errors | keyvalue; trackBy:trackByFn" class="text-red-500 text-xs ml-2 animate-fade-in-down duration-300 d-flex gap-2 flex-col">
      <div> {{ error.key | errorMessage: error.value }} </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class InputErrorComponent {
  @Input()
  errors: ValidationErrors = {};

  public trackByFn(index: number, item: KeyValue<string, any>): string {
    return item.key;
  }
}
