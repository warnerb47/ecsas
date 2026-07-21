import { Component } from '@angular/core';
import { BackupService } from '@org/api/products';
import { ButtonComponent } from '@org/ecsas/shared-ui';

@Component({
  selector: 'lib-export-zip-card',
  imports: [ButtonComponent],
  templateUrl: './export-zip-card.component.html',
})
export class ExportZipCardComponent {
  private readonly _backupService = new BackupService();

  restoreBackup() {
    this._backupService.restoreBackup();
  }

  createBackup() {
    this._backupService.createBackup();
  }
}
