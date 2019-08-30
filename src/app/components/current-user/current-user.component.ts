import { Component, OnInit, NgModule, OnDestroy, Inject } from '@angular/core';
import { CurrentUserService } from '../../services/current-user.service';
import { HttpClient } from '@angular/common/http';
import { select, Store } from '@ngrx/store';
import { selectId, selectRole } from '../../store/login/login.selectors';
import { selectCurrentUser } from '../../store/current/current-user.selector';
import { tap, take, first } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material';
import { TemporaryComponent } from '../temporary/temporary.component';
import { Observable, Subject } from 'rxjs';



@Component({
  selector: 'webui-current-user',
  templateUrl: './current-user.component.html',
  styleUrls: ['./current-user.component.scss']
})
export class CurrentUserComponent implements OnInit, OnDestroy {

  currentUser$: Observable<any>;
  user = {};
  role$: any;
  role: any;
  id$: any;
  id: any;
  private timerSubscription;
  public show: boolean = false;
  public img: string;
  private imgSubscription: any;


  constructor(private store: Store<{ user }>,
              private current: Store<{ currentUser }>,
              private _currentUser: CurrentUserService,
              private _authService: AuthService,
              public dialog: MatDialog) {

    this.currentUser$ = this.current.pipe(select(selectCurrentUser));
    // ,tap((res) => console.log(res)));

    this.imgSubscription = this.currentUser$
      .subscribe(data => { if (data !== null ) {return this.img = data.avatar; } },
                    error => console.log(error));

    this.role$ = this.store.select(selectRole).subscribe((data) => this.role = data);
    this.id$ = this.store.select(selectId).subscribe((data) => this.id = data);
  }

  ngOnInit() {
    this.timerSubscription = this._authService.refreshTokenTimer().subscribe(() => {
      return this._authService.refreshToken();
    });
    this._currentUser.getCurrentUser();
  }

  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();
    this.imgSubscription.unsubscribe();
  }

  openDialog(): void {
    this.dialog.open(TemporaryComponent);
  }

}
