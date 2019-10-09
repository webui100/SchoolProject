import { DisabledMarksComponent } from './disabled-marks/disabled-marks.component';
import { EditMarkComponent } from './edit-mark/edit-mark.component';
import { LocaleHeaderPipe } from './../../pipes/locale-header.pipe';
import { AddMarkComponent } from './add-mark/add-mark.component';
import { MarkComponentComponent } from './mark-component.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialModule } from 'src/app/modules/material/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IMarkType } from 'src/app/models/mark-type.model';

describe('EditMarkComponent', () => {
  let component: MarkComponentComponent;
  let fixture: ComponentFixture<MarkComponentComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  const mockMarksData: IMarkType[] = [{
      active: true,
      description: '',
      markType: 'Оцінка',
      id: 15
  }];
  const mockMarksDisbled: IMarkType[] = [{
    active: false,
    description: '',
    markType: 'Самостійна',
    id: 17
  }]

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkComponentComponent,
                      AddMarkComponent,
                      LocaleHeaderPipe,
                      EditMarkComponent,
                      DisabledMarksComponent ],
      imports: [MaterialModule,
                HttpClientTestingModule,
                BrowserAnimationsModule,
                FormsModule,
                ReactiveFormsModule],
      providers: [ provideMockStore({})]
    })
    .compileComponents().then(() => {
        fixture = TestBed.createComponent(MarkComponentComponent);
        component = fixture.componentInstance;

        de = fixture.debugElement.query(By.css('form'));
        el = de.nativeElement;
    });
  }));

  beforeEach( async () => {
    component.marksData = mockMarksData;
    component.marksDisabled = mockMarksDisbled;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
