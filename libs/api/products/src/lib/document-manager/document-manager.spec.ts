import { DocumentManager } from './document-manager';

describe('DocumentManager', () => {
  let service: DocumentManager;

  beforeEach(() => {
    service = new DocumentManager();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
