import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-autocomplete-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, AutoCompleteModule],
  templateUrl: './app-autocomplete-field.component.html',
  styleUrl: './app-autocomplete-field.component.scss',
})
export class AppAutocompleteFieldComponent extends FieldType<FieldTypeConfig> implements OnInit {
  private normalizingItems = false;
  private lastValidInputValue = '';

  ngOnInit(): void {
    if (!this.props['multiple']) {
      return;
    }

    this.formControl.valueChanges.subscribe(() => {
      this.handleItemsTransform();
    });
  }

  protected get inputId(): string {
    return this.id;
  }

  protected get suggestions(): unknown[] {
    return (this.props['suggestions'] as unknown[]) ?? [];
  }

  protected get emptyMessage(): string {
    return this.props['emptyMessage'] ?? 'No se encontraron resultados';
  }

  protected get showEmptyMessage(): boolean {
    return this.props['showEmptyMessage'] ?? true;
  }

  protected handleInputTransform(event: Event): void {
    const input = event.target as HTMLInputElement | null;

    if (!input || typeof input.value !== 'string') {
      return;
    }

    if (this.props['multiple'] && this.hasReachedMaxItems()) {
      input.value = '';
      this.lastValidInputValue = '';
      return;
    }

    const transformedValue = this.transformTextValue(input.value);

    if (!this.isValidByKeyFilter(transformedValue)) {
      input.value = this.lastValidInputValue;
      return;
    }

    this.lastValidInputValue = transformedValue;

    if (transformedValue === input.value) {
      return;
    }

    input.value = transformedValue;

    if (this.props['multiple']) {
      return;
    }

    this.formControl.setValue(transformedValue, {
      emitEvent: false,
    });
  }

  protected handleKeyDown(event: KeyboardEvent): void {
    if (this.props['multiple'] && event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (!this.shouldValidateKey(event)) {
      return;
    }

    if (this.props['multiple'] && this.hasReachedMaxItems()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (this.isSeparatorKey(event)) {
      return;
    }

    const input = event.target as HTMLInputElement | null;

    if (!input) {
      return;
    }

    const nextValue = this.buildNextInputValue(input, event.key);

    if (this.isValidByKeyFilter(this.transformTextValue(nextValue))) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  }

  protected handleComplete(event: AutoCompleteCompleteEvent): void {
    const completeMethod = this.props['completeMethod'];

    if (typeof completeMethod !== 'function') {
      return;
    }

    const transformedQuery = this.transformTextValue(event.query);

    completeMethod({
      ...event,
      query: transformedQuery,
    });
  }

  protected handleBlurTransform(): void {
    if (this.props['multiple']) {
      this.handleItemsTransform();
      this.lastValidInputValue = '';
      return;
    }

    const value = this.formControl.value;

    if (typeof value !== 'string') {
      return;
    }

    const transformedValue = this.transformTextValue(value);

    if (transformedValue === value) {
      return;
    }

    this.formControl.setValue(transformedValue, {
      emitEvent: false,
    });

    this.formControl.markAsTouched();
  }

  protected handleItemsTransform(): void {
    if (!this.props['multiple'] || this.normalizingItems) {
      return;
    }

    queueMicrotask(() => {
      this.normalizeItems();
    });
  }

  private normalizeItems(): void {
    const value = this.formControl.value;

    if (!Array.isArray(value)) {
      return;
    }

    let items = value
      .map((item) => this.transformItem(item))
      .filter((item) => this.hasItemValue(item));

    if (this.props['unique']) {
      items = this.getUniqueItems(items);
    }

    const maxItems = this.getMaxItems();

    if (maxItems && items.length > maxItems) {
      items = items.slice(0, maxItems);
    }

    if (this.areItemsEqual(value, items)) {
      return;
    }

    this.normalizingItems = true;

    this.formControl.setValue(items, {
      emitEvent: false,
    });

    this.normalizingItems = false;

    this.formControl.markAsDirty();
    this.formControl.markAsTouched();
    this.formControl.updateValueAndValidity();
  }

  private transformItem(item: unknown): unknown {
    if (typeof item === 'string') {
      return this.transformTextValue(item);
    }

    if (!item || typeof item !== 'object') {
      return item;
    }

    const optionLabel = this.props['optionLabel'];

    if (typeof optionLabel !== 'string') {
      return item;
    }

    const itemRecord = item as Record<string, unknown>;
    const labelValue = itemRecord[optionLabel];

    if (typeof labelValue !== 'string') {
      return item;
    }

    return {
      ...itemRecord,
      [optionLabel]: this.transformTextValue(labelValue),
    };
  }

  private transformTextValue(value: string): string {
    let transformedValue = value;

    if (this.props['normalizeSpaces']) {
      transformedValue = transformedValue.replace(/\s+/g, ' ');
    }

    if (this.props['trim']) {
      transformedValue = transformedValue.trim();
    }

    if (this.props['forceLowercase']) {
      transformedValue = transformedValue.toLowerCase();
    }

    if (this.props['forceUppercase']) {
      transformedValue = transformedValue.toUpperCase();
    }

    const itemMaxLength = this.props['itemMaxLength'] as number | undefined;

    if (itemMaxLength && transformedValue.length > itemMaxLength) {
      transformedValue = transformedValue.slice(0, itemMaxLength);
    }

    return transformedValue;
  }

  private hasItemValue(item: unknown): boolean {
    if (typeof item === 'string') {
      const itemMinLength = this.props['itemMinLength'] as number | undefined;

      if (itemMinLength && item.length < itemMinLength) {
        return false;
      }

      return item.length > 0;
    }

    if (!item || typeof item !== 'object') {
      return false;
    }

    const optionLabel = this.props['optionLabel'];

    if (typeof optionLabel !== 'string') {
      return true;
    }

    const itemRecord = item as Record<string, unknown>;
    const value = itemRecord[optionLabel];

    if (typeof value !== 'string') {
      return true;
    }

    const itemMinLength = this.props['itemMinLength'] as number | undefined;

    if (itemMinLength && value.length < itemMinLength) {
      return false;
    }

    return value.length > 0;
  }

  private getUniqueItems(items: unknown[]): unknown[] {
    const optionLabel = this.props['optionLabel'];
    const usedValues = new Set<string>();

    return items.filter((item) => {
      const value = this.getComparableValue(item, optionLabel);

      if (usedValues.has(value)) {
        return false;
      }

      usedValues.add(value);
      return true;
    });
  }

  private getComparableValue(item: unknown, optionLabel: unknown): string {
    if (typeof item === 'string') {
      return item.toLowerCase();
    }

    if (!item || typeof item !== 'object' || typeof optionLabel !== 'string') {
      return JSON.stringify(item).toLowerCase();
    }

    const itemRecord = item as Record<string, unknown>;
    const value = itemRecord[optionLabel];

    if (typeof value !== 'string') {
      return JSON.stringify(item).toLowerCase();
    }

    return value.toLowerCase();
  }

  private getMaxItems(): number | null {
    const maxItems = this.props['maxItems'];

    if (typeof maxItems !== 'number') {
      return null;
    }

    if (maxItems <= 0) {
      return null;
    }

    return maxItems;
  }

  private hasReachedMaxItems(): boolean {
    const maxItems = this.getMaxItems();

    if (!maxItems) {
      return false;
    }

    const value = this.formControl.value;

    if (!Array.isArray(value)) {
      return false;
    }

    return value.length >= maxItems;
  }

  private shouldValidateKey(event: KeyboardEvent): boolean {
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return false;
    }

    if (this.isAllowedControlKey(event)) {
      return false;
    }

    return event.key.length === 1;
  }

  private isAllowedControlKey(event: KeyboardEvent): boolean {
    return [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
    ].includes(event.key);
  }

  private isSeparatorKey(event: KeyboardEvent): boolean {
    const separator = this.props['separator'];

    if (typeof separator !== 'string') {
      return false;
    }

    return event.key === separator;
  }

  private isValidByKeyFilter(value: string): boolean {
    if (!value) {
      return true;
    }

    const keyFilter = this.props['pKeyFilter'];

    if (!(keyFilter instanceof RegExp)) {
      return true;
    }

    return keyFilter.test(value);
  }

  private buildNextInputValue(input: HTMLInputElement, key: string): string {
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;

    return `${input.value.slice(0, start)}${key}${input.value.slice(end)}`;
  }

  private areItemsEqual(currentItems: unknown[], normalizedItems: unknown[]): boolean {
    return JSON.stringify(currentItems) === JSON.stringify(normalizedItems);
  }
}
