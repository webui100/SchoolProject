import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { map, share, takeUntil } from 'rxjs/operators';
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
  public sidenavPosition = 'end';
  private destroy$: ReplaySubject<boolean> = new ReplaySubject(1);


  isHandset$: Observable<boolean>;

  ngOnInit() {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        share(),
        takeUntil(this.destroy$)
      );

    this.isHandset$.subscribe(isHandset => {
      this.isOpened = !isHandset;
      this.buttonOpened$.next(!this.isOpened);
      this.handsetSubject$.next(isHandset);
    });

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);

    this.destroy$.unsubscribe();
  }

  closeOnLink() {
    if (this.handsetSubject$.getValue()) {
      this.isOpened = false;
    }
  }

  constructor(public breakpointObserver: BreakpointObserver,
    public router: Router,
    public http: AuthService) { }

}
