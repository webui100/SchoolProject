import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Store, select} from "@ngrx/store";
import {selectId, selectRole} from "../store/login/login.selectors";
import {environment} from "../../environments/environment";
import {every, flatMap, map, switchMap, tap} from "rxjs/operators";
import {currentUserAction} from "../store/current/current-user.action";
import {DomSanitizer} from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  role$: any;
  role: any;
  id$: any;
  id: any;
  private BASE_URI = environment.APIEndpoint;

  constructor(private http: HttpClient,
              private store: Store<{ user }>,
              private sanitizer: DomSanitizer) {
    this.role$ = this.store.pipe(select(selectRole)).subscribe((data) => this.role = data);
    this.id$ = this.store.pipe(select(selectId)).subscribe((data) => this.id = data);
  }

  getCurrentUser() {
    if (this.role === 'ROLE_ADMIN') {
      this.store.dispatch(currentUserAction({ currentUserData: {
          firstname: 'Адмін',
          lastname: 'Адмінський',
          avatar: ' data:image/jpeg;base64,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'
        } }));
    } else {
    let userUri: string = '';
    if (this.role === 'ROLE_TEACHER') {
      userUri = 'teachers/';
    } else if (this.role === 'ROLE_USER') {
      userUri = 'students/';
    }
    return this.http.get(this.BASE_URI + userUri + this.id,{observe: 'response'})
      .pipe(
        // @ts-ignore
        // tap(resp => console.log(resp.body.data)),
        // @ts-ignore
        map(response => response.body.data))
      .subscribe(res => this.store.dispatch(currentUserAction({ currentUserData: res })))
    }
  }

  userRole(): string{
    if (this.role === 'ROLE_ADMIN') {
      return 'Адміністратор'
    } else if (this.role === 'ROLE_USER'){
      return 'Учень'
    } else {
      return 'Вчитель'
    }
  }

  imageTransform(string){
    return this.sanitizer.bypassSecurityTrustResourceUrl(string);
  }

}
