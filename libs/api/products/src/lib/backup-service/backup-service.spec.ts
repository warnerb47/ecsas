import { BackupService } from './backup-service';

describe('BackupService', () => {
  let service: BackupService;

  beforeEach(() => {
    service = new BackupService();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
