import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ButtonComponent } from '../atoms';

@Component({
  selector: 'lib-topbar',
  imports: [RouterLink, ButtonComponent],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {}
