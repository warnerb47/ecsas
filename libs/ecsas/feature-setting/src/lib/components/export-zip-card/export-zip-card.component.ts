import { Component, inject, OnDestroy } from '@angular/core';
import { BackupService } from '@org/api/products';
import { ButtonComponent } from '@org/ecsas/shared-ui';
import { DialogService } from 'primeng/dynamicdialog';
import { RestoreBackupComponent } from './restore-backup/restore-backup.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'lib-export-zip-card',
  imports: [ButtonComponent],
  providers: [DialogService],
  templateUrl: './export-zip-card.component.html',
})
export class ExportZipCardComponent implements OnDestroy {
  private readonly _backupService = new BackupService();
  private readonly _dialogService = inject(DialogService);
  private readonly unsubscribe = new Subject<void>();

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  restoreBackup() {
    this._dialogService
      .open(RestoreBackupComponent, {
        header: "Choisir le type d'import",
        width: '40vw',
        focusOnShow: false,
        closable: true,
        closeOnEscape: true,
      })
      ?.onClose.pipe(takeUntil(this.unsubscribe))
      .subscribe();
  }

  createBackup() {
    this._backupService.createBackup();
  }
}
