import { TestBed } from '@angular/core/testing';

import { UserGateway } from './user-gateway.service';

describe('UserGateway', () => {
  let service: UserGateway;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserGateway],
    });
    service = TestBed.inject(UserGateway);
  });
  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
