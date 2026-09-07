import { invoke } from '@tauri-apps/api/core';
import { open, save } from '@tauri-apps/plugin-dialog';

export class BackupService {
  async createBackup(): Promise<void> {
    try {
      const savePath = await save({
        title: 'Exporter la sauvegarde',
        defaultPath: `ecsas_backup_${this.nowTimestamp()}.zip`,
        filters: [
          {
            name: 'Backup',
            extensions: ['zip'],
          },
        ],
      });

      if (!savePath) return;

      await invoke<string>('create_backup', { backupPath: savePath });
    } catch (error) {
      console.error('Backup failed:', error);
      throw error;
    }
  }

  private nowTimestamp(): string {
    const now = new Date();
    const pad = (value: number) => value.toString().padStart(2, '0');
    return (
      `${pad(now.getDate())}_${pad(now.getMonth() + 1)}_${now.getFullYear()}` +
      `_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
    );
  }

  async restoreBackup(mergeMode = false): Promise<void> {
    try {
      // Let user select backup file
      const selected = await open({
        multiple: false,
        filters: [{
          name: 'Backup',
          extensions: ['zip']
        }]
      });

      if (!selected) return;

      await invoke<void>('restore_backup', {
        backupPath: selected,
        mergeMode
      });

      console.log('Restore completed successfully');
    } catch (error) {
      console.error('Restore failed:', error);
      throw error;
    }
  }
}
