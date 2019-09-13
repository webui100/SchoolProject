import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ThemeService } from './../../services/theme.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'webui-theme-button',
  templateUrl: './theme-button.component.html',
  styleUrls: ['./theme-button.component.scss']
})
export class ThemeButtonComponent implements OnInit {

  constructor(public themeService: ThemeService,
    private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    this.themeService.setRootViewContainerRef(this.viewContainerRef);
  }

  showThemePicker() {
    this.themeService.generateThemePicker();
  }

}
