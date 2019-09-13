import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  getAllDataFromLocalForage,
  default as localForage,
} from 'ngrx-store-persist';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import 'hammerjs';

if (environment.production) {
  enableProdMode();
}

getAllDataFromLocalForage({
  driver: localForage.INDEXEDDB,
  keys: [
    'user',
    'errors',
    'schedule',
    'teachers',
    'chart',
    'currentUser',
    'router',
    'subjects',
    'teacherSubjects',
    'teacherJournals',
    'diary',
    'profile',
    'students',
    'classes',
    'newYear',
    'avatar',
    'marks'
  ],
}).then(() => {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.log(err));
});
