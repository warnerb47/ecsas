import { Component } from '@angular/core';
import { ExportZipCardComponent } from '../components/export-zip-card/export-zip-card.component';

@Component({
  selector: 'lib-setting',
  imports: [ ExportZipCardComponent],
  templateUrl: './setting.component.html',
})
export class SettingComponent {}
