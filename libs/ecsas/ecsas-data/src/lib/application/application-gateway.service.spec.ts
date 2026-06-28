import { TestBed } from '@angular/core/testing';

import { ApplicationGateway } from './application-gateway.service';

describe('ApplicationGateway', () => {
  let service: ApplicationGateway;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApplicationGateway],
    });
    service = TestBed.inject(ApplicationGateway);
  });
  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
