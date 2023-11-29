import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  if (window) {
    const loc = window.location.toString();
    if (loc.includes('/p/')) {
      window.console.error = () => { };
      window.console.error = function () { };
      console.error = function () { };
    }
    if (loc.includes('/product/')) {
      window.console.error = () => { };
      window.console.error = function () { };
      console.error = function () { };
    }
    if (loc.includes('/c/')) {
      window.console.error = () => { };
      window.console.error = function () { };
      console.error = function () { };
    }
    if (loc.includes('/search/')) {
      window.console.error = () => { };
      window.console.error = function () { };
      console.error = function () { };
    }


  }
}
if (environment.production == false) {
  if (window) {
    const loc = window.location.toString(); 
    if (loc.includes('/p/')) {
      window.console.error = () => { };
      window.console.error = function () { };
      console.error = function () { };
    }
    if (loc.includes('/product/')) {
      window.console.error = () => { };
      window.console.error = function () { };
      console.error = function () { };
    }
    if (loc.includes('/c/')) {
      window.console.error = () => { };
      window.console.error = function () { };
      console.error = function () { };
    }
    if (loc.includes('/search/')) {
      window.console.error = () => { };
      window.console.error = function () { };
      console.error = function () { };
    }
  }
}
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
