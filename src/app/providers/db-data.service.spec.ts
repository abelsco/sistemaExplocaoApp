import { TestBed } from '@angular/core/testing';

import { DbDataService } from './db-data.service';

describe('DbDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DbDataService = TestBed.get(DbDataService);
    expect(service).toBeTruthy();
  });
});
