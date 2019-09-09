import { TestBed } from '@angular/core/testing';

import { TeacherJournalsService } from './teacher-journals.service';

describe('TeacherJournalsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TeacherJournalsService = TestBed.get(TeacherJournalsService);
    expect(service).toBeTruthy();
  });
});
