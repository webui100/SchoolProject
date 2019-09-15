import { Store, select } from '@ngrx/store';
import { ThemePickerComponent } from './../components/theme-picker/theme-picker.component';
import { BehaviorSubject } from 'rxjs';
import { Injectable, ViewContainerRef, ComponentFactoryResolver, ComponentFactory, ComponentRef } from '@angular/core';
import * as themesList from "../utilities/themesList";
import * as themeSelector from "../store/theme/theme.selector";
import * as themeActions from "../store/theme/theme.action";


@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public rootViewContainer: ViewContainerRef;

  constructor(private factoryResolver: ComponentFactoryResolver, private store: Store<{ theme }>) { }

  private themePickerFactory: ComponentFactory<ThemePickerComponent>;
  private themePickerComponent: ComponentRef<ThemePickerComponent>;

  setRootViewContainerRef(viewContainerRef: ViewContainerRef) {
    this.rootViewContainer = viewContainerRef;
  }

  generateThemePicker(): void {
    this.themePickerFactory = this.factoryResolver.resolveComponentFactory(ThemePickerComponent);
    this.themePickerComponent = this.themePickerFactory.create(this.rootViewContainer.injector);

    this.themePickerComponent.instance.componentRef = this.themePickerComponent;
    const themeSelectionRef = this.store.pipe(select(themeSelector.selectThemeName))
      .subscribe((themeName) => {
        this.themePickerComponent.instance.currentTheme = themeName;
      })

    const themeChangerRef = this.themePickerComponent.instance.themeChanger
      .subscribe((themeName: string) => {
        this.store.dispatch(themeActions.setTheme({ themeName }));
        themeChangerRef.unsubscribe();
        themeSelectionRef.unsubscribe();
      });


    this.rootViewContainer.insert(this.themePickerComponent.hostView);
    this.themePickerComponent.changeDetectorRef.detectChanges();

  }
}
