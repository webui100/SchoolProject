import { TestBed } from '@angular/core/testing';

import { AdminPanelService } from './admin-panel.service';

describe('AdminPanelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminPanelService = TestBed.get(AdminPanelService);
    expect(service).toBeTruthy();
  });
});
