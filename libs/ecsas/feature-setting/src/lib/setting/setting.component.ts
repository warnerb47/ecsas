import { Component } from '@angular/core';
import { ExportZipCardComponent } from '../components/export-zip-card/export-zip-card.component';
import { ProfileCardComponent } from '../components/profile-card/profile-card.component';

@Component({
  selector: 'lib-setting',
  imports: [ProfileCardComponent, ExportZipCardComponent],
  templateUrl: './setting.component.html',
})
export class SettingComponent {}
