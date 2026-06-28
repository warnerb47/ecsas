import { TestBed } from '@angular/core/testing';

import { ApplicantGateway } from './applicant-gateway.service';

describe('ApplicantGateway', () => {
  let service: ApplicantGateway;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApplicantGateway],
    });
    service = TestBed.inject(ApplicantGateway);
  });
  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
