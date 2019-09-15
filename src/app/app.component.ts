import { ThemeService } from './services/theme.service';
import { NotificationService } from './services/notification.service';
import { Component, OnInit, ViewContainerRef, ElementRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as themeSelector from "./store/theme/theme.selector";
import * as themeList from "./utilities/themesList";

@Component({
  selector: 'webui-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'webui100';

  constructor(private notificationService: NotificationService,
    private viewContainerRef: ViewContainerRef,
    private el: ElementRef,
    private store: Store<{ theme }>) {

  }

  public themeClass: string;

  ngOnInit() {
    this.notificationService.setRootViewContainerRef(this.viewContainerRef);
    this.store.pipe(select(themeSelector.selectThemeName))
      .subscribe((themeName: string) => {
        this.themeClass = themeName;
        Object.keys(themeList[themeName]).forEach((prop) => {
          this.el.nativeElement.style.setProperty(`--${prop}`, themeList[themeName][prop]);
        })
      })
  }

}
