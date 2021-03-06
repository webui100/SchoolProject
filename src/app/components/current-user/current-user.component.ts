import { Component, OnInit, NgModule, OnDestroy, Inject, EventEmitter, Output } from '@angular/core';
import { CurrentUserService } from '../../services/current-user.service';
import { select, Store } from '@ngrx/store';
import { selectId, selectRole } from '../../store/login/login.selectors';
import { selectCurrentUser } from '../../store/current-user/current-user.selector';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material';
import { UserProfileComponent } from '../../containers/user-profile/user-profile.component';
import { Observable } from 'rxjs';



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
  @Output() close: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  constructor(private store: Store<{ user }>,
              private current: Store<{ currentUser }>,
              private _currentUser: CurrentUserService,
              private _authService: AuthService,
              public dialog: MatDialog) {

    this.currentUser$ = this.current.pipe(select(selectCurrentUser));

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
  }

  openDialog($event): void {
    this.close.emit($event);
    this.dialog.open(UserProfileComponent);
  }


}
