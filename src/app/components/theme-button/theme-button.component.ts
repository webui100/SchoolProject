import { Component, OnInit, ViewContainerRef } from '@angular/core';
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
  constructor(private store: Store<{ theme }>) {}

  public themeNameChecked: boolean;

  ngOnInit() {
    this.store
      .pipe(
        select(selectThemeName),
        first()
      )
      .subscribe(themeName => {
        if (themeName === 'nightTheme') {
          this.themeNameChecked = true;
        } else {
          this.themeNameChecked = false;
        }
      });
  }

  changeTheme(event) {
    const isChecked = event.target.checked;
    event.target.disabled = true;
    setTimeout(() => {
      if (isChecked) {
        this.store.dispatch(themeActions.setTheme({ themeName: 'nightTheme' }));
      } else {
        this.store.dispatch(themeActions.setTheme({ themeName: 'dayTheme' }));
      }
    }, 400);
    setTimeout(() => {
      event.target.disabled = false;
    }, 700);
  }
}
