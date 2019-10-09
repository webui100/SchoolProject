import { EditMarkComponent } from './edit-mark.component';
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
  let component: EditMarkComponent;
  let fixture: ComponentFixture<EditMarkComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  const mockMarkType: IMarkType = {
      active: true,
      description: '',
      markType: 'Оцінка',
      id: 15
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMarkComponent ],
      imports: [MaterialModule,
                HttpClientTestingModule,
                BrowserAnimationsModule,
                FormsModule,
                ReactiveFormsModule],
      providers: [ provideMockStore({})]
    })
    .compileComponents().then(() => {
        fixture = TestBed.createComponent(EditMarkComponent);
        component = fixture.componentInstance;

        de = fixture.debugElement.query(By.css('form'));
        el = de.nativeElement;
    });
  }));

  beforeEach( async () => {
    component.markType = mockMarkType;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the submitEdit method', async () => {
      spyOn(component, 'submitEdit');
      el = fixture.debugElement.query(By.css('button')).nativeElement;
      el.click();
      expect(component.submitEdit).toHaveBeenCalledTimes(1);
  });
});
