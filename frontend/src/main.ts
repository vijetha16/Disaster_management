import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';  // ← NOTE: app, not app.component

bootstrapApplication(AppComponent, appConfig)
  .catch((err: any) => console.error(err));