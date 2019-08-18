import { TestBed } from '@angular/core/testing';

import { TransitionService } from './transition.service';

describe('TransitionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransitionService = TestBed.get(TransitionService);
    expect(service).toBeTruthy();
  });
});
