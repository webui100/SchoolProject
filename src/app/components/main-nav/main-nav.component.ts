import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { map, share } from 'rxjs/operators';
import links from './links';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'webui-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit, OnDestroy {

  public isOpened = true;
  public linksSet = links;
  public handsetSubject$: BehaviorSubject<boolean> = new BehaviorSubject(
    this.breakpointObserver.isMatched(Breakpoints.Handset));
  public buttonOpened$: BehaviorSubject<boolean> = new BehaviorSubject(
    this.breakpointObserver.isMatched(Breakpoints.Handset));
  private sidenavPosition = 'end';

  isHandset$: Observable<boolean>;
  isHandsetRef: Subscription;

  ngOnInit() {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        share()
      );

    this.isHandsetRef = this.isHandset$.subscribe(isHandset => {
      this.isOpened = !isHandset;
      this.buttonOpened$.next(!this.isOpened);
      this.handsetSubject$.next(isHandset);
    });

  }

  ngOnDestroy(): void {
    this.buttonOpened$.unsubscribe();
    this.isHandsetRef.unsubscribe();
    this.buttonOpened$.unsubscribe();
  }

  closeOnLink() {
    if (this.handsetSubject$.getValue()) {
      this.isOpened = false;
    }
  }

  constructor(public breakpointObserver: BreakpointObserver,
    private router: Router,
    private http: AuthService) { }

}
