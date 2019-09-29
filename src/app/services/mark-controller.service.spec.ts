import { MaterialModule } from './../modules/material/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MarkControllerService } from './mark-controller.service';

describe('MarkControllerService', () => {
  const initialState = { marks: [] };
  let service: MarkControllerService;

  beforeEach( async () => TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
                MaterialModule],
      providers: [ provideMockStore({ initialState })]
  }).compileComponents()
  );

  beforeEach(() => {
      service = TestBed.get(MarkControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
