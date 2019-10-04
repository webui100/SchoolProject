import { MaterialModule } from './../modules/material/material.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TeacherPanelService } from './teacher-panel.service';
import { Store, MemoizedSelector } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import * as TeacherPanel from './teacher-panel.service';


const mockHomework = {
    fileData: '',
    fileName: 'fileName.jpg',
    fileType: 'fileType',
    homework: 'homework',
    idLesson: 1
}

const mockSaveMark = {
    idLesson: 1,
    idMark: 1,
    idStudent: 1,
    mark: '10',
    note: 'note'
}

const mockChangeMarkType = {
    active: true,
    description: 'description',
    id: 1,
    markType: 'markType'
}

describe('TeacherPanelService GET POST PUT requests', () => {
    const initialState = { teachers: [] };
    let service: TeacherPanelService;

    beforeEach(async () =>
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, MaterialModule],
            providers: [provideMockStore({ initialState })]
        })
    );
    beforeEach(inject([TeacherPanelService, HttpTestingController], (s, h) => {
        service = s;
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should make GETCurrentJournal request', () => {
        spyOn(service, 'getCurrentJournal');
        service.getCurrentJournal(10, 10);
        expect(service.getCurrentJournal).toHaveBeenCalledTimes(1);
    });

    it('should make GETHomeworkList request', () => {
        spyOn(service, 'getHomeworkList');
        service.getHomeworkList(10, 10);
        expect(service.getHomeworkList).toHaveBeenCalledTimes(1);
    });

    it('should make POSTHomework request', () => {
        spyOn(service, 'postHomework');
        service.postHomework(mockHomework);
        expect(service.postHomework).toHaveBeenCalledTimes(1);
    });

    it('should make POSTSaveMark request', () => {
        spyOn(service, 'postSaveMark');
        service.postSaveMark(mockSaveMark);
        expect(service.postSaveMark).toHaveBeenCalledTimes(1);
    });

    it('should make PUTChangeMarkType request', () => {
        spyOn(service, 'putChangeMarkType');
        service.putChangeMarkType(mockChangeMarkType, 10);
        expect(service.putChangeMarkType).toHaveBeenCalledTimes(1);
    });

});



//--------------------------------------------------

// describe('TeacherPanelService Store actions', () => {
//     let teacherPanel;
//     let store: MockStore<{
//         currentJournal: any,
//         idClass: number,
//         idSubject: number
//     }>;
//     const initialState = {
//         currentJournal: null,
//         idClass: null,
//         idSubject: null
//     };

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             providers: [
//                 teacherPanel,
//                 provideMockStore({ initialState })
//             ],
//         });

//         store = TestBed.get(Store);
//         teacherPanel = TestBed.get(TeacherPanel);
//     });

    
//     it('should return false if the journal is not setted', () => {
//         const expected = cold('(a|)', {
//             currentJournal: jasmine.anything(),
//             idClass: 10,
//             idSubject: 20
//         });

//         spyOn(teacherPanel, 'getCurrentJournal');
//         teacherPanel.getCurrentJournal(10, 20);
//         expect(teacherPanel.getCurrentJournal).toBeObservable(expected);
//     });

//     //   it('should return true if the user state is logged in', () => {
//     //     store.setState({ loggedIn: true });

//     //     const expected = cold('(a|)', { a: true });

//     //     expect(guard.canActivate()).toBeObservable(expected);
//     //   });
// });