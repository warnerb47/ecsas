import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcome } from './nx-welcome';

@Component({
  imports: [NxWelcome, RouterModule],
  selector: 'ecsas-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'ecsas';
}
