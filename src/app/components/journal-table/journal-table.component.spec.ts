// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { MaterialModule } from 'src/app/modules/material/material.module';
// import { JournalTableComponent } from './journal-table.component';
// import { JournalDateFormatPipe } from 'src/app/pipes/journal-date-format.pipe';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { provideMockStore } from '@ngrx/store/testing';

// describe('JournalTableComponent', () => {
//     const initialState = { 
//         journal: {},
//         marksList: [],
//         homeworkListArray: [],
//         journalArray: []
//      };
//     let component: JournalTableComponent;
//     let fixture: ComponentFixture<JournalTableComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             imports: [HttpClientTestingModule, MaterialModule],
//             declarations: [JournalTableComponent, JournalDateFormatPipe],
//             schemas: [NO_ERRORS_SCHEMA],
//             providers: [ provideMockStore({ initialState })]
//         })
//             .compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(JournalTableComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });
// });
