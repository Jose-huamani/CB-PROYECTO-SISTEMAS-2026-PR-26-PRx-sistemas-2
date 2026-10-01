import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
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
  IText,
  PencilBrush,
  Rect,
  Triangle,
} from 'fabric';

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

  protected mode: EditorMode = 'select';
  protected color = '#ef4444';
  protected brushWidth = 5;
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly canUndo = signal(false);
  protected readonly canRedo = signal(false);

  private canvas?: Canvas;
  private cropArea?: Rect;
  private history: EditorSnapshot[] = [];
  private historyIndex = -1;
  private restoringHistory = false;
  private resizeObserver?: ResizeObserver;

  async ngAfterViewInit(): Promise<void> {
    this.canvas = new Canvas(this.canvasElement.nativeElement, {
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      selection: true,
    });

    this.registerHistoryEvents();
    this.resizeObserver = new ResizeObserver(() => this.fitCanvasToStage());
    this.resizeObserver.observe(this.stageElement.nativeElement);
    await this.loadFile(this.file);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
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
      object.selectable = mode === 'select';
      object.evented = mode === 'select';
    });

    if (this.canvas.isDrawingMode) {
      const brush = new PencilBrush(this.canvas);
      brush.color = mode === 'marker' ? 'rgba(250, 204, 21, 0.42)' : this.color;
      brush.width = mode === 'marker' ? Math.max(this.brushWidth * 3, 14) : this.brushWidth;
      this.canvas.freeDrawingBrush = brush;
    }

    if (mode === 'crop') {
      this.addCropArea();
    }

    this.canvas.discardActiveObject();
    this.canvas.requestRenderAll();
  }

  protected updateBrush(): void {
    if (this.mode === 'pencil' || this.mode === 'marker') {
      this.setMode(this.mode);
    }
  }

  protected addRectangle(): void {
    if (!this.canvas) {
      return;
    }

    this.setMode('select');
    const rectangle = new Rect({
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
    const arrow = new Triangle({
      left: this.canvas.width / 2,
      top: this.canvas.height / 2,
      width: 54,
      height: 86,
      fill: this.color,
      angle: 90,
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
      left: Math.max(20, this.canvas.width / 2 - 90),
      top: Math.max(20, this.canvas.height / 2 - 20),
      fill: this.color,
      fontFamily: 'Arial',
      fontSize: 36,
      fontWeight: '500',
    });
    this.canvas.add(text);
    this.canvas.setActiveObject(text);
    text.enterEditing();
    text.selectAll();
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
    selected.forEach((object) => this.canvas?.remove(object));
    this.canvas.requestRenderAll();
  }

  protected async applyCrop(): Promise<void> {
    if (!this.canvas || !this.cropArea) {
      return;
    }

    const bounds = this.cropArea.getBoundingRect();
    const left = Math.max(0, Math.round(bounds.left));
    const top = Math.max(0, Math.round(bounds.top));
    const width = Math.max(1, Math.min(Math.round(bounds.width), this.canvas.width - left));
    const height = Math.max(1, Math.min(Math.round(bounds.height), this.canvas.height - top));
    const dataUrl = this.canvas.toDataURL({ format: 'png', left, top, width, height, multiplier: 1 });

    this.removeCropArea();
    await this.replaceCanvasWithImage(dataUrl);
    this.mode = 'select';
  }

  protected async rotate(): Promise<void> {
    if (!this.canvas) {
      return;
    }

    this.removeCropArea();
    const source = this.canvas.toDataURL({ format: 'png', multiplier: 1 });
    const image = await this.loadHtmlImage(source);
    const rotatedCanvas = document.createElement('canvas');
    rotatedCanvas.width = image.height;
    rotatedCanvas.height = image.width;

    const context = rotatedCanvas.getContext('2d');
    if (!context) {
      return;
    }

    context.translate(rotatedCanvas.width / 2, rotatedCanvas.height / 2);
    context.rotate(Math.PI / 2);
    context.drawImage(image, -image.width / 2, -image.height / 2);
    await this.replaceCanvasWithImage(rotatedCanvas.toDataURL('image/png'));
    this.mode = 'select';
  }

  protected async undo(): Promise<void> {
    if (this.historyIndex <= 0) {
      return;
    }

    this.historyIndex -= 1;
    await this.restoreSnapshot(this.history[this.historyIndex]);
  }

  protected async redo(): Promise<void> {
    if (this.historyIndex >= this.history.length - 1) {
      return;
    }

    this.historyIndex += 1;
    await this.restoreSnapshot(this.history[this.historyIndex]);
  }

  protected async save(): Promise<void> {
    if (!this.canvas || this.saving()) {
      return;
    }

    this.saving.set(true);
    this.removeCropArea();
    this.canvas.discardActiveObject();
    this.canvas.requestRenderAll();

    const blob = await this.canvas.toBlob({ format: 'png', multiplier: 1 });
    if (!blob) {
      this.saving.set(false);
      return;
    }

    const baseName = this.file.name.replace(/\.[^/.]+$/, '');
    this.saved.emit(
      new File([blob], `${baseName}-editada.png`, {
        type: 'image/png',
        lastModified: Date.now(),
      }),
    );
    this.saving.set(false);
  }

  private async loadFile(file: File): Promise<void> {
    try {
      const dataUrl = await this.readFileAsDataUrl(file);
      const htmlImage = await this.loadHtmlImage(dataUrl);
      const image = new FabricImage(htmlImage);
      const sourceWidth = image.width || 1;
      const sourceHeight = image.height || 1;
      const scale = Math.min(1, 1200 / sourceWidth, 760 / sourceHeight);
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
    const image = new FabricImage(htmlImage);
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

    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push({
      json: this.canvas.toJSON() as Record<string, unknown>,
      width: this.canvas.width,
      height: this.canvas.height,
    });

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

    this.restoringHistory = true;
    this.removeCropArea();
    this.canvas.setDimensions({ width: snapshot.width, height: snapshot.height });
    await this.canvas.loadFromJSON(snapshot.json);
    this.canvas.requestRenderAll();
    this.fitCanvasToStage();
    this.restoringHistory = false;
    this.mode = 'select';
    this.canvas.isDrawingMode = false;
    this.updateHistoryState();
  }

  private updateHistoryState(): void {
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
    const availableWidth = Math.max(1, stage.clientWidth - 32);
    const availableHeight = Math.max(1, stage.clientHeight - 32);
    const scale = Math.min(1, availableWidth / this.canvas.width, availableHeight / this.canvas.height);

    this.canvas.setDimensions(
      {
        width: `${Math.round(this.canvas.width * scale)}px`,
        height: `${Math.round(this.canvas.height * scale)}px`,
      },
      { cssOnly: true },
    );
  }
}
