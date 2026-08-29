import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

type NotificationSeverity = 'success' | 'error' | 'info' | 'warn';
type NotificationDetail = string | string[];

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly messageService = inject(MessageService);

  success(summary: string, detail: NotificationDetail): void {
    this.show('success', summary, detail);
  }

  error(summary: string, detail: NotificationDetail): void {
    this.show('error', summary, detail);
  }

  info(summary: string, detail: NotificationDetail): void {
    this.show('info', summary, detail);
  }

  warn(summary: string, detail: NotificationDetail): void {
    this.show('warn', summary, detail);
  }

  private show(severity: NotificationSeverity, summary: string, detail: NotificationDetail): void {
    const details = Array.isArray(detail) ? detail : [detail];

    for (const item of details) {
      const normalizedDetail = item.trim();

      if (!normalizedDetail) {
        continue;
      }

      this.messageService.add({
        severity,
        summary,
        detail: normalizedDetail,
      });
    }
  }
}
