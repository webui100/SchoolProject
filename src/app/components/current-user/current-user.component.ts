import { Component, OnInit, NgModule, OnDestroy, Inject } from '@angular/core';
import { CurrentUserService } from '../../services/current-user.service';
import { HttpClient } from '@angular/common/http';
import { select, Store } from '@ngrx/store';
import { selectId, selectRole } from '../../store/login/login.selectors';
import { selectCurrentUser } from '../../store/current/current-user.selector';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { TemporaryComponent } from '../temporary/temporary.component';



@Component({
  selector: 'webui-current-user',
  templateUrl: './current-user.component.html',
  styleUrls: ['./current-user.component.scss']
})
export class CurrentUserComponent implements OnInit, OnDestroy {

  currentUser$: any;
  user = {};
  role$: any;
  role: any;
  id$: any;
  id: any;
  private timerSubscription;
  public show: boolean = false;


  constructor(private http: HttpClient,
    private store: Store<{ user }>,
    private current: Store<{ currentUser }>,
    private _currentUser: CurrentUserService,
    private _authService: AuthService,
    private router: Router,
    public dialog: MatDialog) {

    this.currentUser$ = this.current.pipe(select(selectCurrentUser))
      .subscribe(
        (data) => {
          if (data !== null && (typeof data !== 'undefined')) { this.user = data; }
        },
        error => console.log(error),
        () => this.currentUser$.unsubscribe());

    this.role$ = this.store.pipe(select(selectRole)).subscribe((data) => this.role = data);
    this.id$ = this.store.pipe(select(selectId)).subscribe((data) => this.id = data);
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

  toggleEdit() {
    this.show = !this.show;
  }

  openDialog(): void {
    this.dialog.open(TemporaryComponent);
  }

}
