import { TestBed } from '@angular/core/testing';

import { StudentDiaryService } from './student-diary.service';

describe('StudentDiaryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StudentDiaryService = TestBed.get(StudentDiaryService);
    expect(service).toBeTruthy();
  });
});
