import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import {
  AuthLayoutImages,
  AUTH_LAYOUT_IMAGES,
} from '@core/layouts/auth-layout/auth-layout-images.constants';
import { filter } from 'rxjs';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})
export class AuthLayoutComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly images = signal<AuthLayoutImages>(AUTH_LAYOUT_IMAGES.AUTH_ENTRY);

  constructor() {
    this.updateImagesFromRoute();

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.updateImagesFromRoute();
      });
  }

  private updateImagesFromRoute(): void {
    this.images.set(this.getImagesFromCurrentRoute());
  }

  private getImagesFromCurrentRoute(): AuthLayoutImages {
    let routeSnapshot = this.router.routerState.snapshot.root;

    while (routeSnapshot.firstChild) {
      routeSnapshot = routeSnapshot.firstChild;
    }

    return (
      (routeSnapshot.data['authLayoutImages'] as AuthLayoutImages | undefined) ??
      AUTH_LAYOUT_IMAGES.AUTH_ENTRY
    );
  }
}
