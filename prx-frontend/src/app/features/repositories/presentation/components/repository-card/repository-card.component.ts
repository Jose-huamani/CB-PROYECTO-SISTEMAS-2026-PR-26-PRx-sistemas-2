import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

import { RepositoryModel } from '@features/repositories/domain/models/repository.model';
import { RepositoryVisibility } from '@shared/enums/repository-visibility.enum';

@Component({
  selector: 'app-repository-card',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, TagModule],
  templateUrl: './repository-card.component.html',
  styleUrl: './repository-card.component.scss',
})
export class RepositoryCardComponent {
  readonly repository = input.required<RepositoryModel>();
  readonly actionLabel = input('Ver repositorio');
  readonly actionIcon = input('pi pi-folder-open');
  readonly showOwner = input(true);
  readonly showVisibility = input(true);

  readonly actionClick = output<RepositoryModel>();
  readonly ownerClick = output<RepositoryModel>();

  private readonly descriptionMaxLength = 115;

  protected handleActionClick(): void {
    this.actionClick.emit(this.repository());
  }

  protected handleOwnerClick(): void {
    this.ownerClick.emit(this.repository());
  }

  protected getRepositoryColor(): string {
    return `#${this.repository().color.replace('#', '')}`;
  }

  protected getRepositoryPath(): string {
    const repository = this.repository();

    return `${repository.owner.username}/${repository.name}`;
  }

  protected getRepositoryDescription(): string {
    const description = this.repository().description?.trim();

    if (!description) {
      return 'Este repositorio no tiene descripción.';
    }

    if (description.length <= this.descriptionMaxLength) {
      return description;
    }

    return `${description.slice(0, this.descriptionMaxLength).trim()}...`;
  }

  protected getVisibilityLabel(): string {
    const visibilityLabels: Record<RepositoryVisibility, string> = {
      [RepositoryVisibility.publico]: 'Público',
      [RepositoryVisibility.privado]: 'Privado',
      [RepositoryVisibility.intimo]: 'Íntimo',
    };

    return visibilityLabels[this.repository().visibility];
  }

  protected getVisibleTags() {
    return this.repository().tags.slice(0, 5);
  }

  protected getRemainingTags(): number {
    return Math.max(this.repository().tags.length - this.getVisibleTags().length, 0);
  }
}
