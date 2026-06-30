import { ProcedureRepository } from './procedure-repository';

describe('ProcedureRepository', () => {
  let service: ProcedureRepository;

  beforeEach(() => {
    service = new ProcedureRepository();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
