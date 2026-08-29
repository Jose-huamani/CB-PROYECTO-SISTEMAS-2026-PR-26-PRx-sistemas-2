import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { APP_CONFIG } from '@core/config/app.config';

@Injectable({
  providedIn: 'root',
})
export class AppTitleStrategy extends TitleStrategy {
  private readonly titleService = inject(Title);

  override updateTitle(routerState: RouterStateSnapshot): void {
    const routeTitle = this.buildTitle(routerState);
    const pageTitle = this.buildPageTitle(routeTitle);

    this.titleService.setTitle(pageTitle);
  }

  private buildPageTitle(routeTitle?: string): string {
    if (!routeTitle) {
      return APP_CONFIG.name;
    }

    return `${APP_CONFIG.name} | ${routeTitle}`;
  }
}
