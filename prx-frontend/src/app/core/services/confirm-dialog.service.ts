import { Injectable, inject } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

interface ConfirmOptions {
  header: string;
  message: string;
  icon?: string;

  acceptLabel?: string;
  rejectLabel?: string;

  acceptButtonStyleClass?: string;
  rejectButtonStyleClass?: string;

  accept?: () => void;
  reject?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class AppConfirmService {
  private readonly confirmationService = inject(ConfirmationService);

  private open(options: ConfirmOptions): void {
    this.confirmationService.confirm({
      header: options.header,
      message: options.message,
      icon: options.icon ?? 'pi pi-exclamation-triangle',

      acceptLabel: options.acceptLabel ?? 'Aceptar',
      rejectLabel: options.rejectLabel ?? 'Cancelar',

      acceptButtonStyleClass: options.acceptButtonStyleClass ?? 'p-button-primary',

      rejectButtonStyleClass: options.rejectButtonStyleClass ?? 'p-button-text',

      accept: options.accept,
      reject: options.reject,
    });
  }

  confirm(options: ConfirmOptions): void {
    this.open(options);
  }

  confirmLogout(accept: () => void): void {
    this.open({
      header: 'Cerrar sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      icon: 'pi pi-sign-out',

      acceptLabel: 'Cerrar sesión',
      rejectLabel: 'Cancelar',

      acceptButtonStyleClass: 'p-button-primary',
      rejectButtonStyleClass: 'p-button-text',

      accept,
    });
  }

  confirmDelete(message: string, accept: () => void): void {
    this.open({
      header: 'Eliminar',
      message,
      icon: 'pi pi-trash',

      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',

      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',

      accept,
    });
  }

  confirmWarning(message: string, accept: () => void): void {
    this.open({
      header: 'Confirmación',
      message,
      icon: 'pi pi-exclamation-triangle',

      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',

      acceptButtonStyleClass: 'p-button-warning',
      rejectButtonStyleClass: 'p-button-text',

      accept,
    });
  }
}
