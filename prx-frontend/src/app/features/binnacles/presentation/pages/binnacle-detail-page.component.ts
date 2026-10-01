import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { NotificationService } from '@core/services/notification.service';
import { BinnacleFacade } from '@features/binnacles/application/facades/binnacle.facade';
import {
  BinnacleLinkModel,
  BinnacleModel,
  BinnacleTaskModel,
} from '@features/binnacles/domain/models/binnacle.model';
import { getApiErrorNotificationMessage } from '@shared/utils/api-notification.util';

@Component({
  selector: 'app-binnacle-detail-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './binnacle-detail-page.component.html',
  styleUrl: './binnacle-detail-page.component.scss',
})
export class BinnacleDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly binnacleFacade = inject(BinnacleFacade);
  private readonly notifications = inject(NotificationService);

  protected readonly binnacle = signal<BinnacleModel | null>(null);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly editing = signal(false);
  protected readonly tasks = signal<BinnacleTaskModel[]>([]);
  protected readonly links = signal<BinnacleLinkModel[]>([]);
  protected readonly completedTaskCount = computed(
    () => this.tasks().filter((task) => task.completed).length,
  );

  protected newTaskTitle = '';
  protected newLinkUrl = '';

  protected readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(15)],
    }),
    content: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(2000)],
    }),
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      this.back();
      return;
    }

    this.binnacleFacade
      .findById(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          if (!response.data) {
            this.back();
            return;
          }
          this.setBinnacle(response.data);
        },
        error: (error: HttpErrorResponse) => {
          this.notifications.error(
            'Bitácora',
            getApiErrorNotificationMessage(error, 'No se pudo cargar la bitácora'),
          );
          this.back();
        },
      });
  }

  protected startEditing(): void {
    this.editing.set(true);
  }

  protected cancelEditing(): void {
    const binnacle = this.binnacle();
    if (binnacle) {
      this.setBinnacle(binnacle);
    }
    this.newTaskTitle = '';
    this.newLinkUrl = '';
    this.editing.set(false);
  }

  protected save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.addTask() || !this.addLink()) {
      return;
    }

    this.persist(true);
  }

  private persist(closeEditor: boolean): void {
    const binnacle = this.binnacle();
    if (!binnacle) {
      return;
    }

    this.saving.set(true);
    this.binnacleFacade
      .update(binnacle.id, {
        name: this.form.controls.name.value.trim(),
        content: this.form.controls.content.value.trim(),
        tasks: this.tasks(),
        links: this.links(),
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (response) => {
          if (response.data) {
            this.setBinnacle(response.data);
          }
          if (closeEditor) {
            this.editing.set(false);
            this.notifications.success('Bitácora', 'Bitácora actualizada correctamente');
          }
        },
        error: (error: HttpErrorResponse) => {
          this.setBinnacle(binnacle);
          this.notifications.error(
            'Bitácora',
            getApiErrorNotificationMessage(error, 'No se pudo actualizar la bitácora'),
          );
        },
      });
  }

  protected addTask(): boolean {
    const title = this.newTaskTitle.trim();
    if (!title) {
      return true;
    }
    if (title.length > 250) {
      this.notifications.warn('Bitácora', 'La tarea no puede superar los 250 caracteres.');
      return false;
    }

    this.tasks.update((tasks) => [...tasks, { id: crypto.randomUUID(), title, completed: false }]);
    this.newTaskTitle = '';
    return true;
  }

  protected toggleTask(id: string): void {
    if (this.saving()) {
      return;
    }
    this.tasks.update((tasks) =>
      tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    );
    if (!this.editing()) {
      this.persist(false);
    }
  }

  protected removeTask(id: string): void {
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== id));
  }

  protected addLink(): boolean {
    const url = this.normalizeUrl(this.newLinkUrl);
    if (!url) {
      return true;
    }
    if (!this.isValidUrl(url)) {
      this.notifications.warn('Bitácora', 'Ingresa una URL válida.');
      return false;
    }

    this.links.update((links) => [...links, { id: crypto.randomUUID(), url }]);
    this.newLinkUrl = '';
    return true;
  }

  protected removeLink(id: string): void {
    this.links.update((links) => links.filter((link) => link.id !== id));
  }

  protected back(): void {
    void this.router.navigateByUrl('/binnacles/me');
  }

  private setBinnacle(binnacle: BinnacleModel): void {
    const normalized = {
      ...binnacle,
      tasks: binnacle.tasks ?? [],
      links: binnacle.links ?? [],
    };
    this.binnacle.set(normalized);
    this.form.setValue({ name: normalized.name, content: normalized.content });
    this.tasks.set(normalized.tasks);
    this.links.set(normalized.links);
  }

  private normalizeUrl(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) {
      return '';
    }
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  }

  private isValidUrl(value: string): boolean {
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }
}
