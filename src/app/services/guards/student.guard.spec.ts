import { TestBed, async, inject } from '@angular/core/testing';

import { StudentGuard } from './student.guard';

describe('StudentGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StudentGuard]
    });
  });

  it('should ...', inject([StudentGuard], (guard: StudentGuard) => {
    expect(guard).toBeTruthy();
  }));
});
