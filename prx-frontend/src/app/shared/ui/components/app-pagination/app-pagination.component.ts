import { Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';

import { PAGINATION_CONSTANTS } from '@shared/constants/pagination.constants';

export interface AppPaginationChange {
  first: number;
  rows: number;
  page: number;
}

interface AppPaginationOption {
  label: string;
  value: number;
}

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [FormsModule, SelectModule, PaginatorModule],
  templateUrl: './app-pagination.component.html',
  styleUrl: './app-pagination.component.scss',
})
export class AppPaginationComponent {
  readonly first = input<number>(0);
  readonly rows = input<number>(PAGINATION_CONSTANTS.DEFAULT_LIMIT);
  readonly totalRecords = input<number>(0);
  readonly rowsPerPageOptions = input<number[]>([
    PAGINATION_CONSTANTS.DEFAULT_LIMIT,
    20,
    50,
    PAGINATION_CONSTANTS.MAX_LIMIT,
  ]);
  readonly currentPageReportTemplate = input<string>('{first} - {last} de {totalRecords}');
  readonly itemsPerPageLabel = input<string>('Elementos por página:');
  readonly showCurrentPageReport = input<boolean>(true);
  readonly showPageLinks = input<boolean>(false);
  readonly showFirstLastIcon = input<boolean>(false);

  readonly pageChange = output<AppPaginationChange>();

  protected readonly selectOptions = computed<AppPaginationOption[]>(() =>
    Array.from(
      new Set(
        this.rowsPerPageOptions().filter(
          (value) =>
            Number.isInteger(value) && value > 0 && value <= PAGINATION_CONSTANTS.MAX_LIMIT,
        ),
      ),
    ).map((value) => ({
      label: String(value),
      value,
    })),
  );

  protected readonly hasRowsPerPageOptions = computed(() => this.selectOptions().length > 0);

  protected handleRowsChange(rows: number | null | undefined): void {
    const safeRows = this.getSafeRows(rows ?? this.rows());

    this.emitPageChange({
      first: 0,
      rows: safeRows,
      page: 0,
    });
  }

  protected handlePageChange(event: PaginatorState): void {
    const safeRows = this.getSafeRows(event.rows ?? this.rows());
    const safeFirst = this.getSafeFirst(event.first ?? 0, safeRows);

    this.emitPageChange({
      first: safeFirst,
      rows: safeRows,
      page: this.getPageFromFirst(safeFirst, safeRows),
    });
  }

  private emitPageChange(event: AppPaginationChange): void {
    this.pageChange.emit(event);
  }

  private getSafeRows(rows: number): number {
    return Math.min(Math.max(rows, 1), PAGINATION_CONSTANTS.MAX_LIMIT);
  }

  private getSafeFirst(first: number, rows: number): number {
    const safeTotalRecords = Math.max(this.totalRecords(), 0);

    if (safeTotalRecords === 0) {
      return 0;
    }

    const maxFirst = Math.max(0, Math.floor((safeTotalRecords - 1) / rows) * rows);

    return Math.min(Math.max(first, 0), maxFirst);
  }

  private getPageFromFirst(first: number, rows: number): number {
    return Math.floor(first / rows);
  }
}
