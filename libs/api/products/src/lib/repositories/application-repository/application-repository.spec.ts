import { ApplicationRepository } from './application-repository';

describe('ApplicationRepository', () => {
  let service: ApplicationRepository;

  beforeEach(() => {
    service = new ApplicationRepository();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
