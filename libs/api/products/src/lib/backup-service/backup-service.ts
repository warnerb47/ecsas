import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';

export class BackupService {
  async createBackup(): Promise<string> {
    try {
      const backupPath = await invoke<string>('create_backup');
      console.log('Backup created at:', backupPath);
      return backupPath;
    } catch (error) {
      console.error('Backup failed:', error);
      throw error;
    }
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
