import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

platformBrowserDynamic()
    .bootstrapModule({
        declarations: [AppComponent],
        imports: [BrowserModule, FormsModule],
        providers: [provideHttpClient()]
    })
    .catch(err => console.error(err));