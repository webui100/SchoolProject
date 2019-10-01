import { EditMarkComponent } from './../edit-mark/edit-mark.component';
import { LocaleHeaderPipe } from './../../../pipes/locale-header.pipe';
import { AddMarkComponent } from './../add-mark/add-mark.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialModule } from 'src/app/modules/material/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IMarkType } from 'src/app/models/mark-type.model';
import { DisabledMarksComponent } from './disabled-marks.component';

describe('DisabledMarksComponent', () => {
  let component: DisabledMarksComponent;
  let fixture: ComponentFixture<DisabledMarksComponent>;
  const mockMarksData: IMarkType[] = [{
      active: false,
      description: '',
      markType: 'Самостійна',
      id: 17
  }];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisabledMarksComponent,
                      AddMarkComponent,
                      LocaleHeaderPipe,
                      EditMarkComponent,
                    ],
      imports: [MaterialModule,
                HttpClientTestingModule,
                BrowserAnimationsModule,
                FormsModule,
                ReactiveFormsModule],
      providers: [ provideMockStore({})]
    })
    .compileComponents().then(() => {
        fixture = TestBed.createComponent(DisabledMarksComponent);
        component = fixture.componentInstance;
    });
  }));

  beforeEach( async () => {
    component.disabledMarksList = mockMarksData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
