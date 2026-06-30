import { Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormValueControl} from '@angular/forms/signals';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'lib-toggle-input',
  standalone: true,
  imports: [CommonModule, ToggleSwitchModule, FormsModule],
  templateUrl: './toggle-input.component.html'
})
export class ToggleInputComponent implements FormValueControl<boolean>{
  label = input('');
  value = model(false);

  setValue(checked: boolean) {
    this.value.set(checked);
  }
}
