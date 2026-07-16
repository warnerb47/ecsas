import { ExcelExportService } from './excel-export';

describe('ExcelExportService', () => {
  let service: ExcelExportService;

  beforeEach(() => {
    service = new ExcelExportService();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
