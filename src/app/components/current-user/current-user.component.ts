import { Component, OnInit, NgModule } from '@angular/core';
import {CurrentUserService} from "../../services/current-user.service";
import {HttpClient} from "@angular/common/http";
import {select, Store} from "@ngrx/store";
import {selectId, selectRole} from "../../store/login/login.selectors";
import {selectAll} from "../../store/current/current-user.selector";


@Component({
  selector: 'webui-current-user',
  templateUrl: './current-user.component.html',
  styleUrls: ['./current-user.component.scss']
})
export class CurrentUserComponent implements OnInit {
  currentUser$: any;
  user = {};
  role$: any;
  role: any;
  id$: any;
  id: any;

  constructor(private http: HttpClient,
              private store: Store<{ user }>,
              private current: Store<{ currentUser }>,
              private _currentUser: CurrentUserService) {

    this.currentUser$ = this.current.pipe(select(selectAll)).subscribe((data)=>this.user = data);
    this.role$ = this.store.pipe(select(selectRole)).subscribe((data) => this.role = data);
    this.id$ = this.store.pipe(select(selectId)).subscribe((data) => this.id = data);
}

  ngOnInit() {
    return this._currentUser.getCurrentUser();
  }

}
