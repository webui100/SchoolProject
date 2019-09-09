import { BehaviorSubject } from 'rxjs';
import { Component, OnInit, Input, ComponentRef, OnDestroy } from '@angular/core';

@Component({
  selector: 'webui-custom-error',
  templateUrl: './custom-error.component.html',
  styleUrls: ['./custom-error.component.scss']
})
export class CustomErrorComponent implements OnInit, OnDestroy {

  @Input() public error: Error;
  @Input() public message: string;
  @Input() public componentRef: ComponentRef<CustomErrorComponent>;

  public isInfoShown = false;
  public buttonSwitcher = 'details';

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      if (this.buttonSwitcher === 'details') {
        this.componentRef.destroy();
        try {
          this.componentRef.changeDetectorRef.detectChanges();
        } catch (e) { };
      }
    }, 4000);
  }

  ngOnDestroy() {

  }

  showDetails() {
    this.isInfoShown = true;
    this.buttonSwitcher = 'close';
    this.componentRef.changeDetectorRef.detectChanges();
    setTimeout(() => {
      if (this.buttonSwitcher === 'details') {
        this.componentRef.destroy();
        try {
          this.componentRef.changeDetectorRef.detectChanges();
        } catch (e) { };
      }
    }, 4000);
  }

  closeNotification() {
    this.componentRef.destroy();
    try {
      this.componentRef.changeDetectorRef.detectChanges();
    } catch (e) { };
  }
}
