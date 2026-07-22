import { Component, inject, signal } from '@angular/core';
import { BackupService } from '@org/api/products';
import { ButtonComponent, TabsComponent } from '@org/ecsas/shared-ui';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'lib-restore-backup-component',
  imports: [ButtonComponent, TabsComponent],
  templateUrl: './restore-backup.component.html',
  providers: [DialogService],
})
export class RestoreBackupComponent {
  private readonly _dialogRef = inject(DynamicDialogRef);
  private readonly _backupService = new BackupService();

  documentModel = signal({
    name: '',
    required: false,
  });
  tabs = ['Conserver les données', 'Ecraser les données'];
  activeTab = signal(this.tabs[0]);
  mergeMode = signal(true);
  isLoading = signal(false);
  initialErrorValue: {
    message: string;
    details: unknown;
  } = {
    message: '',
    details: '',
  };
  error = signal(this.initialErrorValue);

  onActiveTabChange(value: string) {
    this.activeTab.set(value);
    this.mergeMode.set(value === 'Conserver les données');
  }

  async restoreBackup() {
    try {
      this.error.set(this.initialErrorValue);
      this.isLoading.set(true);
      await this._backupService.restoreBackup(this.mergeMode());
      this._dialogRef.close();
    } catch (error) {
      console.error(error);
      this.error.set({
        message: 'Erreur lors du chargement des données',
        details: error,
      });
    } finally {
      this.isLoading.set(false);
    }
  }
}
