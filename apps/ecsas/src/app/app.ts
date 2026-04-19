import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '@ord/ecsas/shared-ui';

@Component({
  imports: [RouterModule, SidebarComponent],
  selector: 'ecsas-root',
  templateUrl: './app.html',
})
export class App {
  protected title = 'ecsas';
}
