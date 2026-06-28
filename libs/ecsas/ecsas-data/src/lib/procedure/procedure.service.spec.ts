import { TestBed } from '@angular/core/testing';

import { ProcedureGateway } from './procedure-gateway.service';

describe('ProcedureGateway', () => {
  let service: ProcedureGateway;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProcedureGateway],
    });
    service = TestBed.inject(ProcedureGateway);
  });
  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
