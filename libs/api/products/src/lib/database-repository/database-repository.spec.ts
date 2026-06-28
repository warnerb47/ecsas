import { DatabaseRepository } from './database-repository';

describe('DatabaseRepository', () => {
  let service: DatabaseRepository;

  beforeEach(() => {
    service = new DatabaseRepository();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
