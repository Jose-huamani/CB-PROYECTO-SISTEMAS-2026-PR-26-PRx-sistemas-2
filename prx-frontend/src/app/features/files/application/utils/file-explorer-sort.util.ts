import { FileExplorerItemModel } from '@features/files/domain/models/file-explorer-item.model';

export function sortFileExplorerItems(
  items: FileExplorerItemModel[],
  sortField: string | null,
  sortOrder: number,
): FileExplorerItemModel[] {
  return [...items].sort((firstItem, secondItem) => {
    const typeComparison = compareItemTypes(firstItem, secondItem);

    if (typeComparison !== 0) {
      return typeComparison;
    }

    if (!sortField) {
      return compareByName(firstItem, secondItem);
    }

    const fieldComparison = compareByField(firstItem, secondItem, sortField);

    return fieldComparison * sortOrder;
  });
}

function compareItemTypes(
  firstItem: FileExplorerItemModel,
  secondItem: FileExplorerItemModel,
): number {
  if (firstItem.type === secondItem.type) {
    return 0;
  }

  if (firstItem.type === 'folder') {
    return -1;
  }

  return 1;
}

function compareByName(
  firstItem: FileExplorerItemModel,
  secondItem: FileExplorerItemModel,
): number {
  return normalizeSortValue(firstItem.data.name).localeCompare(
    normalizeSortValue(secondItem.data.name),
  );
}

function compareByField(
  firstItem: FileExplorerItemModel,
  secondItem: FileExplorerItemModel,
  field: string,
): number {
  const firstValue = getSortValue(firstItem, field);
  const secondValue = getSortValue(secondItem, field);

  return firstValue.localeCompare(secondValue);
}

function getSortValue(item: FileExplorerItemModel, field: string): string {
  if (field === 'data.name') {
    return normalizeSortValue(item.data.name);
  }

  if (field === 'type') {
    if (item.type === 'folder') {
      return 'carpeta';
    }

    return normalizeSortValue(item.data.extension);
  }

  if (field === 'data.creator.username') {
    return normalizeSortValue(item.data.creator.username);
  }

  if (field === 'data.createdAt') {
    return item.data.createdAt;
  }

  return '';
}

function normalizeSortValue(value: string): string {
  return value.toLowerCase().trim();
}
