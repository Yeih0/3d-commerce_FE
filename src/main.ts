import 'zone.js';

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig, AppComponent } from './app/app.config';


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
