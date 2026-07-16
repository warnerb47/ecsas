import { Workbook } from 'exceljs';
import { writeFile } from '@tauri-apps/plugin-fs';
import { save } from '@tauri-apps/plugin-dialog';

export class ExcelExportService {
  async exportToExcel(data: any[], fileName: string): Promise<void> {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Data Export');

    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      worksheet.addRow(headers);

      // Style Header
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };

      // Add Data
      data.forEach((item) => {
        worksheet.addRow(headers.map((h) => item[h]));
      });
    }

    // Generate Buffer
    const buffer = await workbook.xlsx.writeBuffer();
    // Ensure it is a Uint8Array
    const uint8Array = new Uint8Array(buffer as ArrayBuffer);

    try {
      // Tauri v2 Dialog: Returns the path selected by the user
      const filePath = await save({
        title: 'Save Excel File',
        defaultPath: `${fileName}.xlsx`,
        filters: [
          {
            name: 'Excel File',
            extensions: ['xlsx'],
          },
        ],
      });

      if (filePath) {
        // Tauri v2 FS: Write the binary data to the selected path
        // The dialog automatically scopes this path for writing
        await writeFile(filePath, uint8Array);
        console.log('File saved to:', filePath);
      }
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  }
}
