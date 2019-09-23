import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ThemeService } from './../../services/theme.service';
import * as themesList from '../../utilities/themesList';
import * as themeActions from '../../store/theme/theme.action';
import { Store, select } from '@ngrx/store';
import { selectThemeName } from 'src/app/store/theme/theme.selector';
import { first } from 'rxjs/operators';

@Component({
  selector: 'webui-theme-button',
  templateUrl: './theme-button.component.html',
  styleUrls: ['./theme-button.component.scss']
})
export class ThemeButtonComponent implements OnInit {

  constructor(private store: Store<{ theme }>) { }

  public themeNameChecked: boolean;

  ngOnInit() {
    this.store.pipe(
      select(selectThemeName),
      first()
    ).subscribe((themeName) => {
      if (themeName === 'nightTheme') {
        this.themeNameChecked = true;
      } else {
        this.themeNameChecked = false;
      }
    });
  }

  changeTheme(isChecked: boolean) {
    if (isChecked) {
      this.store.dispatch(themeActions.setTheme({ themeName: 'nightTheme' }));
    } else {
      this.store.dispatch(themeActions.setTheme({ themeName: 'dayTheme' }));
    }

  }

}
