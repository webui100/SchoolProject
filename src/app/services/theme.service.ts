import { ThemePickerComponent } from './../components/theme-picker/theme-picker.component';
import { BehaviorSubject } from 'rxjs';
import { Injectable, ViewContainerRef, ComponentFactoryResolver, ComponentFactory, ComponentRef } from '@angular/core';
import * as themesList from "../utilities/themesList";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public rootViewContainer: ViewContainerRef;

  constructor(private factoryResolver: ComponentFactoryResolver) { }

  public themeSubject = new BehaviorSubject(themesList.dayTheme);
  private themePickerFactory: ComponentFactory<ThemePickerComponent>;
  private themePickerComponent: ComponentRef<ThemePickerComponent>;
  public currentTheme = "dayTheme";

  setRootViewContainerRef(viewContainerRef: ViewContainerRef) {
    this.rootViewContainer = viewContainerRef;
  }

  generateThemePicker(): void {
    this.themePickerFactory = this.factoryResolver.resolveComponentFactory(ThemePickerComponent);
    this.themePickerComponent = this.themePickerFactory.create(this.rootViewContainer.injector);

    this.themePickerComponent.instance.componentRef = this.themePickerComponent;
    this.themePickerComponent.instance.currentTheme = this.currentTheme;

    const themeChangerRef = this.themePickerComponent.instance.themeChanger
      .subscribe((themeName: string) => {
        this.currentTheme = themeName;
        this.themeSubject.next(themesList[themeName]);
        themeChangerRef.unsubscribe();
      });

    this.rootViewContainer.insert(this.themePickerComponent.hostView);
    this.themePickerComponent.changeDetectorRef.detectChanges();

  }
}
