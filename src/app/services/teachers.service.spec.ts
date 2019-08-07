import { TestBed } from '@angular/core/testing';

import { TeachersService } from './teachers.service';

describe('TeachersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TeachersService = TestBed.get(TeachersService);
    expect(service).toBeTruthy();
  });
});
