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
  };
  async initAppFolder() {
    this.appDataConfig.applicantFolder.exist = await this.checkExist(
      this.appDataConfig.applicantFolder.path,
    );
    this.appDataConfig.applicationFolder.exist = await this.checkExist(
      this.appDataConfig.applicationFolder.path,
    );
    if (!this.appDataConfig.applicantFolder.exist) {
      this.createFolder(this.appDataConfig.applicantFolder.path);
    }
    if (!this.appDataConfig.applicationFolder.exist) {
      this.createFolder(this.appDataConfig.applicationFolder.path);
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
