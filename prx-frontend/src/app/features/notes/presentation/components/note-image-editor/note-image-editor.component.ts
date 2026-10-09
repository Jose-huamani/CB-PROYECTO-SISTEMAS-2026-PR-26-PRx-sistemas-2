import {
  AfterViewInit,
  Component,
  ChangeDetectorRef,
  ElementRef,
  EventEmitter,
  Input,
  inject,
  OnDestroy,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Canvas,
  Circle,
  FabricImage,
  Group,
  IText,
  Line,
  PencilBrush,
  Rect,
  Triangle,
} from 'fabric';
import { filterImagePixels, ImageFilter, MAX_IMAGE_DIMENSION, validImageDimensions } from './image-editor.utils';

interface EditorSnapshot {
  json: Record<string, unknown>;
  width: number;
  height: number;
}

type EditorMode = 'select' | 'pencil' | 'marker' | 'crop';

@Component({
  selector: 'app-note-image-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './note-image-editor.component.html',
  styleUrl: './note-image-editor.component.scss',
})
export class NoteImageEditorComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) file!: File;
  @Output() readonly saved = new EventEmitter<File>();
  @Output() readonly cancelled = new EventEmitter<void>();

  @ViewChild('canvasElement', { static: true })
  private readonly canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('stageElement', { static: true })
  private readonly stageElement!: ElementRef<HTMLElement>;
  @ViewChild('editorDialog', { static: true })
  private readonly editorDialog!: ElementRef<HTMLDialogElement>;

  protected mode: EditorMode = 'select';
  protected color = '#ef4444';
  protected brushWidth = 5;
  protected filter: ImageFilter = 'grayscale';
  protected imageWidth = 1;
  protected imageHeight = 1;
  protected keepAspectRatio = true;
  protected readonly hasText = signal(false);
  protected textValue = '';
  protected textSize = 36;
  protected textFont = 'Arial';
  protected textBold = false;
  protected textItalic = false;
  protected textAlignment = 'left';
  protected readonly error = signal('');
  protected readonly working = signal(false);
  protected readonly loadFailed = signal(false);
  protected readonly notice = signal('');
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly canUndo = signal(false);
  protected readonly canRedo = signal(false);
  protected readonly zoomPercent = signal(100);
  protected readonly toolHelp = {
    select: 'Selecciona una anotación para moverla o cambiar su tamaño.',
    pencil: 'Dibuja sobre la imagen con el color y grosor elegidos.',
    marker: 'Resalta una zona de la imagen.',
    crop: 'Ajusta el marco y pulsa Aplicar recorte.',
  };

  private canvas?: Canvas;
  private readonly changeDetector = inject(ChangeDetectorRef);
  private cropArea?: Rect;
  private history: EditorSnapshot[] = [];
  private historyIndex = -1;
  private restoringHistory = false;
  private resizeObserver?: ResizeObserver;
  private baseImage?: FabricImage;
  private displayScale = 1;
  private fitToWindow = true;

  async ngAfterViewInit(): Promise<void> {
    this.editorDialog.nativeElement.showModal();
    this.canvas = new Canvas(this.canvasElement.nativeElement, {
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      selection: true,
    });

    this.registerHistoryEvents();
    this.resizeObserver = new ResizeObserver(() => this.fitCanvasToStage());
    this.resizeObserver.observe(this.stageElement.nativeElement);
    try {
      await this.loadFile(this.file);
    } catch {
      this.loadFailed.set(true);
      this.error.set('No se pudo abrir la imagen. Vuelve y selecciona un archivo válido.');
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.editorDialog.nativeElement.close();
    this.canvas?.dispose();
  }

  protected setMode(mode: EditorMode): void {
    if (!this.canvas) {
      return;
    }

    this.removeCropArea();
    this.mode = mode;
    this.canvas.isDrawingMode = mode === 'pencil' || mode === 'marker';
    this.canvas.selection = mode === 'select';

    this.canvas.getObjects().forEach((object) => {
      object.selectable = object !== this.baseImage && mode === 'select';
      object.evented = object !== this.baseImage && mode === 'select';
    });

    if (this.canvas.isDrawingMode) {
      const brush = new PencilBrush(this.canvas);
      brush.color = mode === 'marker' ? 'rgba(250, 204, 21, 0.42)' : this.color;
      brush.width = mode === 'marker' ? Math.max(this.brushWidth * 3, 14) : this.brushWidth;
      this.canvas.freeDrawingBrush = brush;
    }

    this.canvas.discardActiveObject();
    if (mode === 'crop') {
      this.addCropArea();
    }
    this.canvas.requestRenderAll();
  }

  protected updateBrush(): void {
    if (this.mode === 'pencil' || this.mode === 'marker') {
      this.setMode(this.mode);
    }
    const text = this.selectedText();
    if (text) {
      text.set({ fill: this.color });
      this.canvas?.requestRenderAll();
      this.pushHistory();
    }
  }

  private selectedText(): IText | undefined {
    const object = this.canvas?.getActiveObject();
    return object instanceof IText ? object : undefined;
  }

  private syncTextPanel(): void {
    const text = this.selectedText();
    this.hasText.set(!!text);
    this.changeDetector.markForCheck();
    if (!text) return;
    this.textValue = text.text;
    this.textSize = text.fontSize;
    this.textFont = text.fontFamily;
    this.textBold = text.fontWeight === 'bold' || Number(text.fontWeight) >= 700;
    this.textItalic = text.fontStyle === 'italic';
    this.textAlignment = text.textAlign;
    if (typeof text.fill === 'string' && /^#[a-f\d]{6}$/i.test(text.fill)) this.color = text.fill;
  }

  protected updateText(): void {
    const text = this.selectedText();
    if (!text) return;
    text.exitEditing();
    text.set({
      text: this.textValue,
      fontSize: Math.max(8, Math.min(200, Number(this.textSize) || 36)),
      fontFamily: this.textFont,
      fontWeight: this.textBold ? 'bold' : 'normal',
      fontStyle: this.textItalic ? 'italic' : 'normal',
      textAlign: this.textAlignment,
      fill: this.color,
    });
    text.setCoords();
    this.canvas?.requestRenderAll();
  }

  protected commitText(): void {
    this.updateText();
    this.pushHistory();
  }

  protected toggleTextStyle(style: 'bold' | 'italic'): void {
    if (style === 'bold') this.textBold = !this.textBold;
    else this.textItalic = !this.textItalic;
    this.commitText();
  }

  protected addRectangle(): void {
    if (!this.canvas) {
      return;
    }

    this.setMode('select');
    const rectangle = new Rect({
      originX: 'left', originY: 'top',
      left: this.canvas.width / 2 - 80,
      top: this.canvas.height / 2 - 50,
      width: 160,
      height: 100,
      fill: 'transparent',
      stroke: this.color,
      strokeWidth: 5,
    });
    this.canvas.add(rectangle);
    this.canvas.setActiveObject(rectangle);
  }

  protected addCircle(): void {
    if (!this.canvas) {
      return;
    }

    this.setMode('select');
    const circle = new Circle({
      originX: 'left', originY: 'top',
      left: this.canvas.width / 2 - 60,
      top: this.canvas.height / 2 - 60,
      radius: 60,
      fill: 'transparent',
      stroke: this.color,
      strokeWidth: 5,
    });
    this.canvas.add(circle);
    this.canvas.setActiveObject(circle);
  }

  protected addArrow(): void {
    if (!this.canvas) {
      return;
    }

    this.setMode('select');
    const arrow = new Group([
      new Line([0, 0, 110, 0], { stroke: this.color, strokeWidth: this.brushWidth }),
      new Triangle({ left: 116, top: 0, width: 24, height: 28, fill: this.color, angle: 90 }),
    ], {
      left: this.canvas.width / 2,
      top: this.canvas.height / 2,
    });
    this.canvas.add(arrow);
    this.canvas.setActiveObject(arrow);
  }

  protected addText(): void {
    if (!this.canvas) {
      return;
    }

    this.setMode('select');
    const text = new IText('Escribe aquí', {
      originX: 'left', originY: 'top',
      left: Math.max(20, this.canvas.width / 2 - 90),
      top: Math.max(20, this.canvas.height / 2 - 20),
      fill: this.color,
      fontFamily: 'Arial',
      fontSize: 36,
      fontWeight: '500',
      hiddenTextareaContainer: this.editorDialog.nativeElement,
    });
    this.canvas.add(text);
    this.canvas.setActiveObject(text);
    text.enterEditing();
    text.selectAll();
    text.hiddenTextarea?.focus();
    this.syncTextPanel();
  }

  protected async flip(axis: 'horizontal' | 'vertical'): Promise<void> {
    await this.transformImage((source, context) => {
      context.translate(axis === 'horizontal' ? source.width : 0, axis === 'vertical' ? source.height : 0);
      context.scale(axis === 'horizontal' ? -1 : 1, axis === 'vertical' ? -1 : 1);
      context.drawImage(source, 0, 0);
    });
  }

  protected deleteSelection(): void {
    if (!this.canvas) {
      return;
    }

    const selected = this.canvas.getActiveObjects();
    if (selected.length === 0) {
      return;
    }

    this.canvas.discardActiveObject();
    selected.filter((object) => object !== this.baseImage).forEach((object) => this.canvas?.remove(object));
    this.canvas.requestRenderAll();
  }

  protected async applyCrop(): Promise<void> {
    if (!this.canvas || !this.cropArea) {
      return;
    }

    const bounds = this.cropArea.getBoundingRect();
    const left = Math.max(0, Math.round(bounds.left));
    const top = Math.max(0, Math.round(bounds.top));
    if (left >= this.canvas.width || top >= this.canvas.height) {
      this.error.set('El área de recorte debe estar dentro de la imagen.');
      return;
    }
    const width = Math.max(1, Math.min(Math.round(bounds.width), this.canvas.width - left));
    const height = Math.max(1, Math.min(Math.round(bounds.height), this.canvas.height - top));
    this.removeCropArea();
    await this.transformImage((source, context) => {
      context.canvas.width = width;
      context.canvas.height = height;
      context.drawImage(source, left, top, width, height, 0, 0, width, height);
    });
  }

  protected async rotate(): Promise<void> {
    await this.transformImage((source, context) => {
      context.canvas.width = source.height;
      context.canvas.height = source.width;
      context.translate(context.canvas.width / 2, context.canvas.height / 2);
      context.rotate(Math.PI / 2);
      context.drawImage(source, -source.width / 2, -source.height / 2);
    });
  }

  protected async undo(): Promise<void> {
    this.selectedText()?.exitEditing();
    this.pushHistory();
    if (this.historyIndex <= 0 || this.working()) {
      return;
    }

    this.historyIndex -= 1;
    await this.restoreSnapshot(this.history[this.historyIndex]);
  }

  protected async redo(): Promise<void> {
    if (this.historyIndex >= this.history.length - 1 || this.working()) {
      return;
    }

    this.historyIndex += 1;
    await this.restoreSnapshot(this.history[this.historyIndex]);
  }

  protected async save(): Promise<void> {
    if (!this.canvas || this.saving() || this.working() || this.loadFailed()) {
      return;
    }

    this.saving.set(true);
    this.removeCropArea();
    this.canvas.discardActiveObject();
    this.canvas.requestRenderAll();

    try {
    const blob = await this.canvas.toBlob({ format: 'png', multiplier: 1 });
    if (!blob) {
      this.error.set('No se pudo exportar la imagen. Intenta nuevamente.');
      return;
    }
    if (blob.size > 50 * 1024 * 1024) {
      this.error.set('La imagen editada supera 50 MB. Reduce sus dimensiones antes de guardarla.');
      return;
    }

    const baseName = this.file.name.replace(/\.[^/.]+$/, '');
    this.saved.emit(
      new File([blob], `${baseName}-editada.png`, {
        type: 'image/png',
        lastModified: Date.now(),
      }),
    );
    } catch {
      this.error.set('No se pudo guardar la imagen. Intenta nuevamente.');
    } finally {
      this.saving.set(false);
    }
  }

  protected updateDimensions(axis: 'width' | 'height'): void {
    if (!this.canvas || !this.keepAspectRatio) return;
    const ratio = this.canvas.width / this.canvas.height;
    if (axis === 'width') this.imageHeight = Math.max(1, Math.round(this.imageWidth / ratio));
    else this.imageWidth = Math.max(1, Math.round(this.imageHeight * ratio));
  }

  protected async resizeImage(): Promise<void> {
    if (!validImageDimensions(this.imageWidth, this.imageHeight)) {
      this.error.set('Ingresa un ancho y alto enteros entre 1 y 4096 píxeles.');
      return;
    }
    const width = this.imageWidth, height = this.imageHeight;
    await this.transformImage((source, context) => {
      context.canvas.width = width;
      context.canvas.height = height;
      context.imageSmoothingQuality = 'high';
      context.drawImage(source, 0, 0, width, height);
    });
  }

  protected async applyFilter(): Promise<void> {
    await this.transformImage((source, context) => {
      context.drawImage(source, 0, 0);
      const image = context.getImageData(0, 0, source.width, source.height);
      filterImagePixels(image.data, this.filter);
      context.putImageData(image, 0, 0);
    });
  }

  private async transformImage(transform: (source: HTMLImageElement, context: CanvasRenderingContext2D) => void): Promise<void> {
    if (!this.canvas || this.working()) return;
    this.working.set(true);
    this.error.set('');
    try {
      this.setMode('select');
      const source = await this.loadHtmlImage(this.canvas.toDataURL({ format: 'png', multiplier: 1 }));
      const output = document.createElement('canvas');
      output.width = source.width;
      output.height = source.height;
      const context = output.getContext('2d');
      if (!context) throw new Error('CANVAS_UNAVAILABLE');
      transform(source, context);
      await this.replaceCanvasWithImage(output.toDataURL('image/png'));
    } catch {
      this.error.set('No se pudo modificar la imagen. Intenta nuevamente.');
    } finally {
      this.working.set(false);
    }
  }

  private async loadFile(file: File): Promise<void> {
    try {
      const dataUrl = await this.readFileAsDataUrl(file);
      const htmlImage = await this.loadHtmlImage(dataUrl);
      const image = new FabricImage(htmlImage, { originX: 'left', originY: 'top' });
      this.baseImage = image;
      const sourceWidth = image.width || 1;
      const sourceHeight = image.height || 1;
      const scale = Math.min(1, MAX_IMAGE_DIMENSION / sourceWidth, MAX_IMAGE_DIMENSION / sourceHeight);
      if (scale < 1) this.notice.set('La imagen se ajustó al límite de 4096 píxeles por lado.');
      const width = Math.max(1, Math.round(sourceWidth * scale));
      const height = Math.max(1, Math.round(sourceHeight * scale));

      image.set({
        left: 0,
        top: 0,
        scaleX: scale,
        scaleY: scale,
        selectable: false,
        evented: false,
      });

      this.restoringHistory = true;
      this.canvas?.setDimensions({ width, height });
      this.canvas?.clear();
      this.canvas?.set({ backgroundColor: '#ffffff' });
      this.canvas?.add(image);
      this.canvas?.requestRenderAll();
      this.restoringHistory = false;
      this.fitToWindow = true;
      this.fitCanvasToStage();
      this.resetHistory();
    } finally {
      this.loading.set(false);
    }
  }

  private async replaceCanvasWithImage(dataUrl: string): Promise<void> {
    if (!this.canvas) {
      return;
    }

    const htmlImage = await this.loadHtmlImage(dataUrl);
    const image = new FabricImage(htmlImage, { originX: 'left', originY: 'top' });
    this.baseImage = image;
    const width = Math.max(1, Math.round(image.width || 1));
    const height = Math.max(1, Math.round(image.height || 1));

    this.restoringHistory = true;
    this.canvas.clear();
    this.canvas.setDimensions({ width, height });
    this.canvas.set({ backgroundColor: '#ffffff' });
    image.set({ left: 0, top: 0, selectable: false, evented: false });
    this.canvas.add(image);
    this.canvas.requestRenderAll();
    this.restoringHistory = false;
    this.fitToWindow = true;
    this.fitCanvasToStage();
    this.pushHistory();
  }

  private addCropArea(): void {
    if (!this.canvas) {
      return;
    }

    const width = this.canvas.width * 0.8;
    const height = this.canvas.height * 0.8;
    this.cropArea = new Rect({
      originX: 'left', originY: 'top',
      left: this.canvas.width * 0.1,
      top: this.canvas.height * 0.1,
      width,
      height,
      fill: 'rgba(13, 148, 136, 0.08)',
      stroke: '#0d9488',
      strokeWidth: 2,
      strokeDashArray: [8, 6],
      transparentCorners: false,
      cornerColor: '#0d9488',
      cornerStyle: 'circle',
      excludeFromExport: true,
    });
    this.canvas.add(this.cropArea);
    this.canvas.setActiveObject(this.cropArea);
    this.canvas.requestRenderAll();
  }

  private removeCropArea(): void {
    if (this.canvas && this.cropArea) {
      this.canvas.remove(this.cropArea);
      this.cropArea = undefined;
      this.canvas.requestRenderAll();
    }
  }

  private registerHistoryEvents(): void {
    const save = (): void => {
      if (!this.restoringHistory && !this.cropArea) {
        this.pushHistory();
      }
    };

    this.canvas?.on('object:added', save);
    this.canvas?.on('object:modified', save);
    this.canvas?.on('object:removed', save);
    this.canvas?.on('path:created', save);
    this.canvas?.on('text:editing:exited', save);
    this.canvas?.on('text:changed', () => this.syncTextPanel());
    this.canvas?.on('selection:created', () => this.syncTextPanel());
    this.canvas?.on('selection:updated', () => this.syncTextPanel());
    this.canvas?.on('selection:cleared', () => this.syncTextPanel());
  }

  private resetHistory(): void {
    this.history = [];
    this.historyIndex = -1;
    this.pushHistory();
  }

  private pushHistory(): void {
    if (!this.canvas || this.restoringHistory) {
      return;
    }

    const snapshot: EditorSnapshot = {
      json: this.canvas.toJSON() as Record<string, unknown>,
      width: this.canvas.width,
      height: this.canvas.height,
    };
    if (JSON.stringify(snapshot) === JSON.stringify(this.history[this.historyIndex])) return;
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(snapshot);

    if (this.history.length > 30) {
      this.history.shift();
    }

    this.historyIndex = this.history.length - 1;
    this.updateHistoryState();
  }

  private async restoreSnapshot(snapshot: EditorSnapshot): Promise<void> {
    if (!this.canvas) {
      return;
    }

    this.working.set(true);
    this.restoringHistory = true;
    try {
    this.removeCropArea();
    this.canvas.setDimensions({ width: snapshot.width, height: snapshot.height });
    await this.canvas.loadFromJSON(snapshot.json);
    this.canvas.getObjects().forEach((object) => {
      if (object instanceof IText) object.hiddenTextareaContainer = this.editorDialog.nativeElement;
    });
    this.baseImage = this.canvas.getObjects().find((object) => object instanceof FabricImage) as FabricImage | undefined;
    this.canvas.requestRenderAll();
    this.fitCanvasToStage();
    this.restoringHistory = false;
    this.setMode('select');
    this.updateHistoryState();
    } catch {
      this.error.set('No se pudo recuperar el cambio de la imagen.');
    } finally {
      this.restoringHistory = false;
      this.working.set(false);
    }
  }

  private updateHistoryState(): void {
    if (this.canvas) {
      this.imageWidth = this.canvas.width;
      this.imageHeight = this.canvas.height;
    }
    this.canUndo.set(this.historyIndex > 0);
    this.canRedo.set(this.historyIndex >= 0 && this.historyIndex < this.history.length - 1);
  }

  private loadHtmlImage(source: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('No se pudo cargar la imagen.'));
      image.src = source;
    });
  }

  private readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
      reader.readAsDataURL(file);
    });
  }

  private fitCanvasToStage(): void {
    if (!this.canvas) {
      return;
    }

    const stage = this.stageElement.nativeElement;
    const availableWidth = Math.max(1, stage.clientWidth - 48);
    const availableHeight = Math.max(1, stage.clientHeight - 48);
    if (this.fitToWindow) {
      this.displayScale = Math.min(6, availableWidth / this.canvas.width, availableHeight / this.canvas.height);
    }
    this.zoomPercent.set(Math.round(this.displayScale * 100));
    this.canvas.setDimensions(
      {
        width: `${Math.max(1, Math.round(this.canvas.width * this.displayScale))}px`,
        height: `${Math.max(1, Math.round(this.canvas.height * this.displayScale))}px`,
      },
      { cssOnly: true },
    );
  }

  protected zoomBy(factor: number): void {
    this.fitToWindow = false;
    this.displayScale = Math.max(0.1, Math.min(6, this.displayScale * factor));
    this.fitCanvasToStage();
  }

  protected fitImage(): void {
    this.fitToWindow = true;
    this.fitCanvasToStage();
    this.stageElement.nativeElement.scrollTo({ left: 0, top: 0 });
  }

  protected actualSize(): void {
    this.fitToWindow = false;
    this.displayScale = 1;
    this.fitCanvasToStage();
  }
}
