import { Component, HostListener, effect, inject, signal, untracked } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { TokenService } from '@core/services/token.service';
import { AuthFacade } from '@features/auth/application/facades/auth.facade';

type ToastPosition = 'top-right' | 'top-center';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, ConfirmDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly authFacade = inject(AuthFacade);
  private readonly tokenService = inject(TokenService);

  private readonly sessionInitializationAttempted = signal(false);

  protected readonly toastPosition = signal<ToastPosition>(this.getToastPosition());

  constructor() {
    this.initSessionSyncEffect();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.toastPosition.set(this.getToastPosition());
  }

  private getToastPosition(): ToastPosition {
    return window.innerWidth < 768 ? 'top-center' : 'top-right';
  }

  private initSessionSyncEffect(): void {
    effect(() => {
      const accessToken = this.tokenService.accessToken();
      const currentUser = this.authFacade.currentUser();
      const loading = this.authFacade.loading();
      const initializationAttempted = this.sessionInitializationAttempted();

      if (!accessToken && currentUser) {
        untracked(() => {
          this.authFacade.clearSession();
          this.sessionInitializationAttempted.set(false);
        });

        return;
      }

      if (!accessToken) {
        untracked(() => {
          this.sessionInitializationAttempted.set(false);
        });

        return;
      }

      if (accessToken && !loading && !initializationAttempted) {
        untracked(() => {
          this.sessionInitializationAttempted.set(true);

          this.authFacade.restoreSession().subscribe({
            error: () => {},
          });
        });
      }
    });
  }
}
