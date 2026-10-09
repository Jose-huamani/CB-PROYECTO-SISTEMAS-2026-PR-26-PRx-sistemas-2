import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NoteDetailPageComponent } from './note-detail-page.component';
import { NoteFacade } from '@features/notes/application/facades/note.facade';
import { RepositoryFacade } from '@features/repositories/application/facades/repository.facade';
import { AuthFacade } from '@features/auth/application/facades/auth.facade';
import { NotificationService } from '@core/services/notification.service';
import { AppConfirmService } from '@core/services/confirm-dialog.service';

describe('Vista multimedia de una nota', () => {
  let page: any;
  let facade: any;
  let notifications: any;
  beforeEach(() => {
    facade = { downloadFile: vi.fn(), update: vi.fn() };
    notifications = { warn: vi.fn(), error: vi.fn(), success: vi.fn() };
    TestBed.configureTestingModule({
      imports: [NoteDetailPageComponent],
      providers: [
        { provide: NoteFacade, useValue: facade },
        { provide: RepositoryFacade, useValue: {} },
        { provide: AuthFacade, useValue: { currentUser: () => ({ id: 2 }) } },
        { provide: NotificationService, useValue: notifications },
        { provide: AppConfirmService, useValue: {} },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '10' } } } },
        { provide: Router, useValue: { navigateByUrl: vi.fn(), navigate: vi.fn() } },
      ],
    }).overrideComponent(NoteDetailPageComponent, { set: { template: '' } });
    page = TestBed.createComponent(NoteDetailPageComponent).componentInstance;
  });
  it('muestra las URL disponibles aunque falle otro archivo', () => {
    page.existingFiles.set([{ id: 1 }, { id: 2 }]);
    facade.downloadFile.mockImplementation((id: number) => id === 1
      ? of({ data: { url: 'https://example.test/ok.png' } }) : throwError(() => new Error('offline')));
    page.retryFileUrls();
    expect(page.existingFiles()[0].url).toBe('https://example.test/ok.png');
    expect(page.existingFiles()[1].url).toBeUndefined();
    expect(notifications.warn).toHaveBeenCalledOnce();
  });
  it('permite volver a obtener una URL fallida', () => {
    page.existingFiles.set([{ id: 2 }]);
    facade.downloadFile.mockReturnValueOnce(throwError(() => new Error('offline')))
      .mockReturnValueOnce(of({ data: { url: 'https://example.test/recovered.png' } }));
    page.retryFileUrls();
    page.retryFileUrls();
    expect(page.existingFiles()[0].url).toContain('recovered.png');
  });
  it('no abre el editor con una respuesta HTTP fallida', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false } as Response);
    await page.editExistingImage({ id: 2, name: 'photo.png', url: 'https://example.test/photo.png' });
    expect(page.imageBeingEdited()).toBeNull();
    expect(notifications.error).toHaveBeenCalledOnce();
    fetchMock.mockRestore();
  });
  it('conserva los cambios del formulario cuando el guardado falla', () => {
    page.note.set({ id: 10, title: 'Anterior', content: 'Antes', files: [], tasks: [] });
    page.form.setValue({ title: 'Nuevo', content: 'Después' });
    facade.update.mockReturnValue(throwError(() => new Error('offline')));
    page.persist(true);
    expect(page.form.getRawValue()).toEqual({ title: 'Nuevo', content: 'Después' });
    expect(page.saving()).toBe(false);
    expect(notifications.error).toHaveBeenCalledOnce();
  });
});

describe('Apertura de documentos de la nota', () => {
  let page: any;
  let dialog: any;
  let createUrl: any;
  let revokeUrl: any;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoteDetailPageComponent],
      providers: [
        { provide: NoteFacade, useValue: { downloadFile: vi.fn() } },
        { provide: RepositoryFacade, useValue: {} },
        { provide: AuthFacade, useValue: { currentUser: () => null } },
        { provide: NotificationService, useValue: { error: vi.fn() } },
        { provide: AppConfirmService, useValue: {} },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '10' } } } },
        { provide: Router, useValue: {} },
      ],
    }).overrideComponent(NoteDetailPageComponent, { set: { template: '' } });
    page = TestBed.createComponent(NoteDetailPageComponent).componentInstance;
    dialog = { showModal: vi.fn(), close: vi.fn() };
    page.documentDialog = { nativeElement: dialog };
    createUrl = vi.fn().mockReturnValue('blob:http://localhost/qa-document');
    revokeUrl = vi.fn();
    const BaseURL = URL;
    vi.stubGlobal('URL', class extends BaseURL {
      static override createObjectURL = createUrl;
      static override revokeObjectURL = revokeUrl;
    });
  });
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
  it('convierte un PDF data URL en blob y habilita su vista previa', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, blob: async () => new Blob(['%PDF-1.4'], { type: 'application/pdf' }) } as Response);
    await page.download({ id: 1, name: 'qa.pdf', isImage: false, url: 'data:application/pdf;base64,JVBERg==' });
    expect(dialog.showModal).toHaveBeenCalledOnce();
    expect(createUrl.mock.calls[0][0].type).toBe('application/pdf');
    expect(page.documentPreview()).not.toBeNull();
    expect(page.openingDocument()).toBe(false);
  });
  it('muestra un fallo de descarga sin crear una URL inválida', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false } as Response);
    await page.download({ id: 1, name: 'qa.pdf', isImage: false, url: 'https://example.invalid/file.pdf' });
    expect(page.documentError()).toContain('No se pudo cargar');
    expect(createUrl).not.toHaveBeenCalled();
  });
  it('abre el blob válido en una pestaña desde una acción del usuario', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    page.pdfObjectUrl = 'blob:http://localhost/qa-document';
    page.openDocumentInTab();
    expect(open).toHaveBeenCalledWith('blob:http://localhost/qa-document', '_blank', 'noopener,noreferrer');
  });
  it('libera el blob y cancela la solicitud al cerrar', () => {
    page.pdfObjectUrl = 'blob:http://localhost/qa-document';
    page.documentRequest = new AbortController();
    const request = page.documentRequest;
    page.closeDocument();
    expect(request.signal.aborted).toBe(true);
    expect(revokeUrl).toHaveBeenCalledWith('blob:http://localhost/qa-document');
    expect(page.documentPreview()).toBeNull();
  });
});
