import { NotificationService } from './services/notification.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'webui-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'webui100';

  constructor(private notificationService: NotificationService,
    private viewContainerRef: ViewContainerRef) {

  }

  ngOnInit() {
    this.notificationService.setRootViewContainerRef(this.viewContainerRef);
  }
}
