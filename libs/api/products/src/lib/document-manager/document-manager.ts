import {
  exists,
  create,
  mkdir,
  BaseDirectory,
  writeFile,
  readFile,
  remove,
} from '@tauri-apps/plugin-fs';

export class DocumentManager {
  appDataConfig = {
    applicantFolder: { path: 'Documents/Demandeurs', exist: false },
    applicationFolder: { path: 'Documents/Demandes', exist: false },
    eventFolder: { path: 'Documents/Événements', exist: false },
  };

  sanitizeSegment(value: string): string {
    return value
      .replace(/[/\\:*?"<>|]/g, '-')
      .replace(/[\p{Cc}]/gu, '')
      .replace(/\s+/g, ' ')
      .replace(/[. ]+$/g, '')
      .trim();
  }

  formatDate(value?: string | null): string {
    if (value) {
      const datePart = value.split(' ')[0];
      if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
        return datePart;
      }
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) {
        return date.toISOString().slice(0, 10);
      }
    }
    return new Date().toISOString().slice(0, 10);
  }

  applicantFolder(params: { fullName: string; nin: string }): string {
    const { fullName, nin } = params;
    return `${this.appDataConfig.applicantFolder.path}/${this.sanitizeSegment(`${fullName}_${nin}`)}`;
  }

  applicationFolder(params: {
    procedureName: string;
    mailRef: string;
    createdAt?: string | null;
  }): string {
    const { procedureName, mailRef, createdAt } = params;
    const segments = [
      this.sanitizeSegment(procedureName),
      this.sanitizeSegment(mailRef),
      this.formatDate(createdAt),
    ].filter(Boolean);
    return `${this.appDataConfig.applicationFolder.path}/${segments.join('_')}`;
  }

  eventFolder(params: {
    eventName: string;
    createdAt?: string | null;
  }): string {
    const { eventName, createdAt } = params;
    const segments = [
      this.sanitizeSegment(eventName),
      this.formatDate(createdAt),
    ].filter(Boolean);
    return `${this.appDataConfig.eventFolder.path}/${segments.join('_')}`;
  }

  async initAppFolder() {
    for (const folder of [
      this.appDataConfig.applicantFolder,
      this.appDataConfig.applicationFolder,
      this.appDataConfig.eventFolder,
    ]) {
      folder.exist = await this.checkExist(folder.path);
      if (!folder.exist) {
        await this.createFolder(folder.path);
      }
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

  async uploadFile(params: { file: File; fullPath: string }) {
    try {
      const { file, fullPath } = params;
      const folderPath = fullPath.substring(0, fullPath.lastIndexOf('/'));
      if (folderPath) {
        const folderExists = await this.checkExist(folderPath);
        if (!folderExists) {
          await this.createFolder(folderPath);
        }
      }
      const arrayBuffer = await file.arrayBuffer();
      const fileData = new Uint8Array(arrayBuffer);
      await writeFile(fullPath, fileData, {
        baseDir: BaseDirectory.AppLocalData,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async fetchFile(params: {
    fullPath: string;
    mimeType: string;
  }): Promise<File> {
    const { fullPath, mimeType } = params;
    try {
      const uint8Array = await readFile(fullPath, {
        baseDir: BaseDirectory.AppLocalData,
      });

      const blob = new Blob([uint8Array], { type: mimeType });

      const fileName =
        fullPath.split('/').pop() ||
        fullPath.split('\\').pop() ||
        'unknown_file';

      const file = new File([blob], fileName, {
        type: mimeType,
        lastModified: Date.now(),
      });

      return file;
    } catch (error) {
      console.error(`Failed to fetch file ${fullPath}:`, error);
      throw error;
    }
  }

  async removeFile(fullPath: string): Promise<void> {
    try {
      await remove(fullPath, {
        baseDir: BaseDirectory.AppLocalData,
      });
      console.log(`File removed successfully: ${fullPath}`);
    } catch (error) {
      console.error(`Failed to remove file ${fullPath}:`, error);
      throw error;
    }
  }

  // exemple of file upload from component form
  async uploadExempleFromComponent(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!(input.files && input.files.length > 0)) {
      console.log('No file selected');
      return;
    }
    const selectedFile = input.files[0];
    const fullPath = `${this.appDataConfig.applicantFolder.path}/${selectedFile.name}`;
    const uploaded = await this.uploadFile({
      file: selectedFile,
      fullPath,
    });
    if (uploaded) {
      console.log('File uploaded');
      return;
    }
    console.log('File upload failed');
  }
}
