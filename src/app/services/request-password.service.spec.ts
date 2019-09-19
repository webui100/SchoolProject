import { TestBed } from '@angular/core/testing';

import { RequestPasswordService } from './request-password.service';

describe('RequestPasswordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RequestPasswordService = TestBed.get(RequestPasswordService);
    expect(service).toBeTruthy();
  });
});
