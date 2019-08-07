import { TestBed } from '@angular/core/testing';

import { StudentsService } from './students.service';

describe('StudentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StudentsService = TestBed.get(StudentsService);
    expect(service).toBeTruthy();
  });
});
