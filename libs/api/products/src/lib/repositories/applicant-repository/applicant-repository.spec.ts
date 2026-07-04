import { ApplicantRepository } from './applicant-repository';

describe('ApplicantRepository', () => {
  let service: ApplicantRepository;

  beforeEach(() => {
    service = new ApplicantRepository();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
