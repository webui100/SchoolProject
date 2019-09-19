import { ThemeService } from './services/theme.service';
import { NotificationService } from './services/notification.service';
import { Component, OnInit, ViewContainerRef, ElementRef, Inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as themeSelector from "./store/theme/theme.selector";
import * as themeList from "./utilities/themesList";
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'webui-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'webui100';

  constructor(private notificationService: NotificationService,
    private viewContainerRef: ViewContainerRef,
    private store: Store<{ theme }>,
    @Inject(DOCUMENT) private document: Document) {

  }

  public themeClass: string;

  ngOnInit() {
    this.notificationService.setRootViewContainerRef(this.viewContainerRef);
    this.store.pipe(select(themeSelector.selectThemeName))
      .subscribe((themeName: string) => {
        this.setBodyClass(themeName);
        Object.keys(themeList[themeName]).forEach((prop) => {
          this.document.body.style.setProperty(`--${prop}`, themeList[themeName][prop]);
        })
      })
  }

  setBodyClass(className: string) {
    this.document.body.classList.remove("dayTheme");
    this.document.body.classList.remove("nightTheme");
    this.document.body.classList.remove("morningTheme");
    this.document.body.classList.add(className);
  }

}
