import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import packageInfo from '../../../../../../package.json';

@Component({
  selector: 'lib-sidebar',
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  version = packageInfo.version;
}
