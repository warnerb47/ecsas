import { exists, create, mkdir, BaseDirectory } from '@tauri-apps/plugin-fs';

export class DocumentManager {
  async initAppFolder() {
    const hasApplicantFolder = await exists('Demandeurs', {
      baseDir: BaseDirectory.AppLocalData,
    });
    const hasApplicationFolder = await exists('Demandes', {
      baseDir: BaseDirectory.AppLocalData,
    });
    const hasDatabaseFile = await exists('ecsas.db', {
      baseDir: BaseDirectory.AppLocalData,
    });
    if (!hasApplicantFolder) {
      this.createFolder('Demandeurs');
    }
    if (!hasApplicationFolder) {
      this.createFolder('Demandes');
    }
    if (!hasDatabaseFile) {
      this.createFile('ecsas.db');
    }
  }

  async createFolder(folderName: string) {
    await mkdir(folderName, {
      baseDir: BaseDirectory.AppLocalData,
    });
  }

  async createFile(fileName: string) {
    const file = await create(fileName, {
      baseDir: BaseDirectory.AppLocalData,
    });
    await file.close();
  }
}
