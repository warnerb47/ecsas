import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-document-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-card.component.html'
})
export class DocumentCardComponent {
  documentName = input.required<string>();
  icon = input<string>('pi pi-file');
  required = input<boolean>(false);
  removed = output<void>();
}
