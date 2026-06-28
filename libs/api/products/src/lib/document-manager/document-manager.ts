import { exists, create, mkdir, BaseDirectory } from '@tauri-apps/plugin-fs';

export class DocumentManager {
  appDataConfig = {
    applicantFolder: { path: 'Documents/Demandeurs', exist: false },
    applicationFolder: { path: 'Documents/Demandes', exist: false },
    databaseFile: { path: 'ecsas.db', exist: false },
  };
  async initAppFolder() {
    this.appDataConfig.applicantFolder.exist = await this.checkExist(this.appDataConfig.applicantFolder.path);
    this.appDataConfig.applicationFolder.exist = await this.checkExist(this.appDataConfig.applicationFolder.path);
    this.appDataConfig.databaseFile.exist = await this.checkExist(this.appDataConfig.databaseFile.path);
    if (!this.appDataConfig.applicantFolder.exist) {
      this.createFolder('Documents/Demandeurs');
    }
    if (!this.appDataConfig.applicationFolder.exist) {
      this.createFolder('Documents/Demandes');
    }
    if (!this.appDataConfig.databaseFile.exist) {
      this.createFile('ecsas.db');
    }
  }

  async createFolder(folderName: string) {
    await mkdir(folderName, {
      baseDir: BaseDirectory.AppLocalData,
      recursive: true,
    });
  }

  async createFile(fileName: string) {
    const file = await create(fileName, {
      baseDir: BaseDirectory.AppLocalData,
    });
    await file.close();
  }

  async checkExist(path: string) {
    return await exists(path, {
      baseDir: BaseDirectory.AppLocalData,
    });
  }
}
