import { ThemeService } from './services/theme.service';
import { NotificationService } from './services/notification.service';
import { Component, OnInit, ViewContainerRef, ElementRef } from '@angular/core';

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
    private themeService: ThemeService) {

  }

  ngOnInit() {
    this.notificationService.setRootViewContainerRef(this.viewContainerRef);
    this.themeService.themeSubject.subscribe((theme) => {
      Object.keys(theme).forEach((prop) => {
        this.el.nativeElement.style.setProperty(`--${prop}`, theme[prop]);
      })
    })
  }

}
