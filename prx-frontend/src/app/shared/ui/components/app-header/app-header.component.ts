import { Component, computed, inject, signal, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';

import { AppConfirmService } from '@core/services/confirm-dialog.service';
import { NotificationService } from '@core/services/notification.service';
import { TokenService } from '@core/services/token.service';
import { AuthFacade } from '@features/auth/application/facades/auth.facade';
import { AUTH_MESSAGES } from '@features/auth/constants/auth-messages.constants';
import { NotificationsFacade } from '@features/notifications/application/facades/notifications.facade';
import { NotificationMessage } from '@shared/types/notification-message.type';
import { getApiNotificationMessage } from '@shared/utils/api-notification.util';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, ButtonModule, MenubarModule, MenuModule, AvatarModule],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
})
export class AppHeaderComponent {
  private readonly authFacade = inject(AuthFacade);
  private readonly tokenService = inject(TokenService);
  private readonly confirmService = inject(AppConfirmService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly notificationsFacade = inject(NotificationsFacade);
  protected readonly mobileMenuOpen = signal(false);
  protected readonly mobileRepositoriesOpen = signal(false);
  protected readonly loggingOut = signal(false);

  protected readonly currentUser = this.authFacade.currentUser;
  protected readonly isAuthenticated = this.authFacade.isAuthenticated;

  protected readonly username = computed(() => this.currentUser()?.username ?? '');
  protected readonly avatarUrl = computed(
    () => this.currentUser()?.avatarUrl || 'logo/prx-logo.png',
  );

  protected readonly unreadCount = computed(() => {
    return this.notificationsFacade.notifications().filter((notification) => !notification.isRead)
      .length;
  });

  private initialLoadDone = false;

  constructor() {
    effect(() => {
      if (this.isAuthenticated() && !this.initialLoadDone) {
        this.initialLoadDone = true;

        this.notificationsFacade.loadUnreadCount().subscribe();
      }
    });
  }

  protected readonly menuItems = computed<MenuItem[]>(() => [
    {
      label: 'Explorar',
      icon: 'pi pi-compass',
      routerLink: '/repositories/explore',
      command: () => this.closeMobileMenu(),
    },
    {
      label: 'Mis repositorios',
      icon: 'pi pi-folder',
      items: [
        {
          label: 'Mis repositorios',
          icon: 'pi pi-folder-open',
          routerLink: '/repositories/me',
          command: () => this.closeMobileMenu(),
        },
        {
          label: 'Repositorio íntimo',
          icon: 'pi pi-lock',
          routerLink: '/repositories/me/intimate',
          command: () => this.closeMobileMenu(),
        },
      ],
    },
    {
      label: 'Bitácora',
      icon: 'pi pi-book',
      routerLink: '/binnacles/me',
      command: () => this.closeMobileMenu(),
    },
  ]);

  protected readonly userMenuItems = computed<MenuItem[]>(() => [
    {
      label: 'Ver perfil',
      icon: 'pi pi-user',
      command: () => this.openMyProfile(),
    },
    {
      separator: true,
    },
    {
      label: this.loggingOut() ? 'Cerrando sesión...' : 'Cerrar sesión',
      icon: 'pi pi-sign-out',
      disabled: this.loggingOut(),
      command: () => this.logout(),
    },
  ]);

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((value) => !value);

    if (!this.mobileMenuOpen()) {
      this.mobileRepositoriesOpen.set(false);
    }
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
    this.mobileRepositoriesOpen.set(false);
  }

  protected toggleMobileRepositories(): void {
    this.mobileRepositoriesOpen.update((value) => !value);
  }

  protected navigateAndClose(url: string): void {
    this.closeMobileMenu();
    void this.router.navigateByUrl(url);
  }

  protected openMyProfile(): void {
    const userId = this.currentUser()?.id;

    if (!userId) {
      return;
    }

    this.navigateAndClose(`/profiles/view/${userId}`);
  }

  protected logout(): void {
    if (this.loggingOut()) {
      return;
    }

    this.confirmService.confirmLogout(() => {
      this.executeLogout();
    });
  }

  private executeLogout(): void {
    const refreshToken = this.tokenService.refreshToken();

    if (!refreshToken) {
      this.handleLogoutError();
      return;
    }

    this.loggingOut.set(true);

    this.authFacade.logout({ refreshToken }).subscribe({
      next: (response) => {
        this.handleLogoutSuccess(getApiNotificationMessage(response, AUTH_MESSAGES.LOGOUT.SUCCESS));
      },
      error: () => {
        this.handleLogoutError();
      },
    });
  }

  private handleLogoutSuccess(message: NotificationMessage): void {
    this.loggingOut.set(false);
    this.closeMobileMenu();
    this.notificationsFacade.clearState();
    this.initialLoadDone = false;

    this.notificationService.success('Sesión', message);

    void this.router.navigateByUrl('/');
  }

  private handleLogoutError(): void {
    this.loggingOut.set(false);
    this.authFacade.clearSession();
    this.closeMobileMenu();
    this.notificationsFacade.clearState();
    this.initialLoadDone = false;

    void this.router.navigateByUrl('/');
  }
}
