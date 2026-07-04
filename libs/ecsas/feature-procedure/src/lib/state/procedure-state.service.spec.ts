import { TestBed } from '@angular/core/testing';

import { ProcedureStateService } from './procedure-state.service';

describe('ProcedureStateService', () => {
  let service: ProcedureStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcedureStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
