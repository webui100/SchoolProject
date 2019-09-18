import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store, select } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { currentUserAction } from '../store/current-user/current-user.action';
import { selectRole, selectId } from '../store/login/login.selectors';


@Injectable({
  providedIn: 'root'
})
export class UserProfileService implements OnDestroy {

  private role: string;
  private id: number;
  private BASE_URI = environment.APIEndpoint;
  public subject = new Subject<string | ArrayBuffer>();
  private destroyStream$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private store: Store<{ currentUser }>
  ) {
    this.store
      .pipe(
        select(selectRole),
        takeUntil(this.destroyStream$)
      )
      .subscribe(role => this.role = role);
    this.store
      .pipe(
        select(selectId),
        takeUntil(this.destroyStream$)
      )
      .subscribe(id => this.id = id);
  }

  editProfile(profile: object) {
    let userURI;
    if (this.role === 'ROLE_TEACHER') {
      userURI = 'teachers/';
    } else if (this.role === 'ROLE_USER') {
      userURI = 'students/';
    }
    return this.http
      .put(this.BASE_URI + userURI + this.id, profile, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: '*/*'
        }),
        observe: 'response'
      })
      .subscribe((response: any) => {
        this.store.dispatch(currentUserAction({ currentUserData: response.body.data }));
      });
  }

  readImage(inputValue: HTMLInputElement): void {
    const file: File = inputValue.files[0];
    if (file.type.includes('image') && file.size < 1000000) {
      const reader: FileReader = new FileReader();
      reader.onloadend = () => {
        this.subject.next(reader.result);
        // console.log('reader result --- ', `${reader.result}`.split(',')[1]);
      };
      reader.readAsDataURL(file);
    } else {
      this.subject.error('Incorrect file');
    }
  }

  ngOnDestroy(): void {
    this.destroyStream$.next();
  }
}
