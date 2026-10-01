from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK, WD_LINE_SPACING
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Inches, Pt, RGBColor


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "Informe_Defensa_Sprint_1_PRX.docx"

NAVY = "17324D"
TEAL = "009F92"
PALE_TEAL = "E7F6F4"
PALE_BLUE = "EEF4F8"
PALE_GRAY = "F5F7F9"
MID_GRAY = "D9E0E5"
DARK = "202A33"
MUTED = "5C6975"
RED = "B42318"
AMBER = "9A6700"
GREEN = "16794B"


def set_cell_shading(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), fill)


def set_cell_margins(cell, top=100, start=120, bottom=100, end=120):
    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for margin, value in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = tc_mar.find(qn(f"w:{margin}"))
        if node is None:
            node = OxmlElement(f"w:{margin}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(value))
        node.set(qn("w:type"), "dxa")


def set_cell_border(cell, color=MID_GRAY, size="6"):
    tc_pr = cell._tc.get_or_add_tcPr()
    borders = tc_pr.first_child_found_in("w:tcBorders")
    if borders is None:
        borders = OxmlElement("w:tcBorders")
        tc_pr.append(borders)
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        tag = f"w:{edge}"
        node = borders.find(qn(tag))
        if node is None:
            node = OxmlElement(tag)
            borders.append(node)
        node.set(qn("w:val"), "single")
        node.set(qn("w:sz"), size)
        node.set(qn("w:color"), color)


def set_repeat_table_header(row):
    tr_pr = row._tr.get_or_add_trPr()
    tbl_header = OxmlElement("w:tblHeader")
    tbl_header.set(qn("w:val"), "true")
    tr_pr.append(tbl_header)


def set_keep_with_next(paragraph, value=True):
    p_pr = paragraph._p.get_or_add_pPr()
    keep_next = p_pr.find(qn("w:keepNext"))
    if value and keep_next is None:
        p_pr.append(OxmlElement("w:keepNext"))
    elif not value and keep_next is not None:
        p_pr.remove(keep_next)


def add_page_number(paragraph):
    paragraph.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run = paragraph.add_run("Página ")
    run.font.size = Pt(8)
    run.font.color.rgb = RGBColor.from_string(MUTED)
    fld_char1 = OxmlElement("w:fldChar")
    fld_char1.set(qn("w:fldCharType"), "begin")
    instr_text = OxmlElement("w:instrText")
    instr_text.set(qn("xml:space"), "preserve")
    instr_text.text = "PAGE"
    fld_char2 = OxmlElement("w:fldChar")
    fld_char2.set(qn("w:fldCharType"), "end")
    run._r.append(fld_char1)
    run._r.append(instr_text)
    run._r.append(fld_char2)


def add_bullet(doc, text, level=0, bold_prefix=None):
    style = "List Bullet" if level == 0 else "List Bullet 2"
    p = doc.add_paragraph(style=style)
    p.paragraph_format.space_after = Pt(4)
    if bold_prefix and text.startswith(bold_prefix):
        p.add_run(bold_prefix).bold = True
        p.add_run(text[len(bold_prefix):])
    else:
        p.add_run(text)
    return p


def add_appendix_bullet(doc, text):
    p = doc.add_paragraph(style="List Bullet")
    p.paragraph_format.space_after = Pt(1)
    p.paragraph_format.line_spacing = 1.0
    r = p.add_run(text)
    r.font.size = Pt(9)
    return p


def add_number(doc, text, number):
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Cm(0.8)
    p.paragraph_format.first_line_indent = Cm(-0.5)
    p.paragraph_format.space_after = Pt(4)
    prefix = p.add_run(f"{number}. ")
    prefix.bold = True
    p.add_run(text)
    return p


def add_code(doc, code, caption=None):
    if caption:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(3)
        r = p.add_run(caption)
        r.bold = True
        r.font.size = Pt(8.5)
        r.font.color.rgb = RGBColor.from_string(MUTED)
        set_keep_with_next(p)
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    table.columns[0].width = Cm(16.2)
    cell = table.cell(0, 0)
    tr_pr = table.rows[0]._tr.get_or_add_trPr()
    cant_split = OxmlElement("w:cantSplit")
    tr_pr.append(cant_split)
    set_cell_shading(cell, "F3F5F7")
    set_cell_border(cell, "D4DAE0", "6")
    set_cell_margins(cell, top=110, start=150, bottom=110, end=150)
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.0
    r = p.add_run(code.strip())
    r.font.name = "Consolas"
    r._element.rPr.rFonts.set(qn("w:ascii"), "Consolas")
    r._element.rPr.rFonts.set(qn("w:hAnsi"), "Consolas")
    r.font.size = Pt(7.5)
    r.font.color.rgb = RGBColor.from_string(DARK)
    doc.add_paragraph().paragraph_format.space_after = Pt(0)


def add_table(doc, headers, rows, widths=None, font_size=8.5):
    table = doc.add_table(rows=1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    hdr = table.rows[0]
    set_repeat_table_header(hdr)
    for idx, title in enumerate(headers):
        cell = hdr.cells[idx]
        set_cell_shading(cell, NAVY)
        set_cell_border(cell)
        set_cell_margins(cell)
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(title)
        r.bold = True
        r.font.size = Pt(font_size)
        r.font.color.rgb = RGBColor(255, 255, 255)
    for row_index, values in enumerate(rows):
        row = table.add_row()
        for idx, value in enumerate(values):
            cell = row.cells[idx]
            set_cell_shading(cell, "FFFFFF" if row_index % 2 == 0 else PALE_BLUE)
            set_cell_border(cell)
            set_cell_margins(cell)
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if idx == 0 else WD_ALIGN_PARAGRAPH.LEFT
            r = p.add_run(str(value))
            r.font.size = Pt(font_size)
            r.font.color.rgb = RGBColor.from_string(DARK)
    if widths:
        for row in table.rows:
            for idx, width in enumerate(widths):
                row.cells[idx].width = Cm(width)
    doc.add_paragraph().paragraph_format.space_after = Pt(0)
    return table


def add_status(doc, label, color, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(5)
    r = p.add_run(f"{label}: ")
    r.bold = True
    r.font.color.rgb = RGBColor.from_string(color)
    p.add_run(text)


def add_heading(doc, text, level=1):
    p = doc.add_heading(text, level=level)
    set_keep_with_next(p)
    return p


def add_appendix_heading(doc, text):
    p = add_heading(doc, text, 2)
    p.paragraph_format.space_before = Pt(7)
    p.paragraph_format.space_after = Pt(3)
    return p


doc = Document()
section = doc.sections[0]
section.top_margin = Cm(1.8)
section.bottom_margin = Cm(1.7)
section.left_margin = Cm(2.1)
section.right_margin = Cm(2.1)

styles = doc.styles
normal = styles["Normal"]
normal.font.name = "Aptos"
normal._element.rPr.rFonts.set(qn("w:ascii"), "Aptos")
normal._element.rPr.rFonts.set(qn("w:hAnsi"), "Aptos")
normal.font.size = Pt(10.2)
normal.font.color.rgb = RGBColor.from_string(DARK)
normal.paragraph_format.space_after = Pt(6)
normal.paragraph_format.line_spacing = 1.12

styles["Title"].font.name = "Aptos Display"
styles["Title"]._element.rPr.rFonts.set(qn("w:ascii"), "Aptos Display")
styles["Title"]._element.rPr.rFonts.set(qn("w:hAnsi"), "Aptos Display")
styles["Title"].font.size = Pt(31)
styles["Title"].font.bold = True
styles["Title"].font.color.rgb = RGBColor(0, 0, 0)
title_style_p_pr = styles["Title"]._element.get_or_add_pPr()
title_style_borders = title_style_p_pr.find(qn("w:pBdr"))
if title_style_borders is not None:
    title_style_p_pr.remove(title_style_borders)

for style_name, size in (("Heading 1", 20), ("Heading 2", 14), ("Heading 3", 11.5)):
    style = styles[style_name]
    style.font.name = "Aptos Display"
    style._element.rPr.rFonts.set(qn("w:ascii"), "Aptos Display")
    style._element.rPr.rFonts.set(qn("w:hAnsi"), "Aptos Display")
    style.font.size = Pt(size)
    style.font.bold = True
    style.font.color.rgb = RGBColor(0, 0, 0)
    style.paragraph_format.space_before = Pt(12 if style_name != "Heading 1" else 18)
    style.paragraph_format.space_after = Pt(6)
    style.paragraph_format.keep_with_next = True

for section_item in doc.sections:
    header_p = section_item.header.paragraphs[0]
    header_p.text = "PRX  |  Sprint 1"
    header_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    for run in header_p.runs:
        run.font.size = Pt(8)
        run.font.color.rgb = RGBColor.from_string(MUTED)
    add_page_number(section_item.footer.paragraphs[0])

# Cover
p = doc.add_paragraph()
p.paragraph_format.space_before = Pt(36)
p.paragraph_format.space_after = Pt(10)
r = p.add_run("PROYECTO PRX")
r.bold = True
r.font.size = Pt(11)
r.font.color.rgb = RGBColor.from_string(TEAL)

title = doc.add_paragraph(style="Title")
title.add_run("Informe de defensa del Sprint 1")
title.paragraph_format.space_after = Pt(10)
title_p_pr = title._p.get_or_add_pPr()
title_borders = title_p_pr.find(qn("w:pBdr"))
if title_borders is not None:
    title_p_pr.remove(title_borders)

subtitle = doc.add_paragraph()
subtitle.paragraph_format.space_after = Pt(22)
r = subtitle.add_run("Notas, Bitácora y Autenticación")
r.font.size = Pt(17)
r.bold = True
r.font.color.rgb = RGBColor.from_string(NAVY)

intro = doc.add_paragraph()
intro.paragraph_format.space_after = Pt(18)
intro.add_run(
    "Documento técnico para presentar y defender el trabajo implementado, explicar dónde se encuentra cada pieza de código y relacionar las decisiones de arquitectura con los principios SOLID y los patrones empleados."
)

add_table(
    doc,
    ["Dato", "Detalle"],
    [
        ["Proyecto", "PRX"],
        ["Entrega", "Presentación y defensa del Sprint 1"],
        ["Fecha de preparación", "22 de septiembre de 2026"],
        ["Fecha límite informada", "23 de septiembre de 2026 a las 23:59"],
        ["Tecnologías principales", "Angular 21, PrimeNG 21, NestJS 11, CQRS, Prisma 6 y MySQL"],
    ],
    widths=[4.2, 12.0],
    font_size=9.2,
)

p = doc.add_paragraph()
p.paragraph_format.space_before = Pt(20)
r = p.add_run("Conclusión ejecutiva")
r.bold = True
r.font.size = Pt(13)
r.font.color.rgb = RGBColor.from_string(NAVY)

doc.add_paragraph(
    "El alcance asignado para el Sprint 1 comprende los módulos de Notas y Bitácora. Ambos se encuentran implementados de extremo a extremo: interfaz, API, reglas de acceso y persistencia. Notas permite consultar, crear, visualizar y editar contenido, archivos, imágenes, enlaces y tareas; Bitácora permite registrar actividades personales con tareas y enlaces, separar la consulta de la edición y marcar tareas directamente desde la vista. La autenticación funciona como soporte transversal mediante JWT, sesiones, renovación de tokens y roles."
)

doc.add_page_break()

# Contents
add_heading(doc, "Contenido", 1)
contents = [
    "1. Alcance y resultado del Sprint 1",
    "2. Arquitectura y tecnologías utilizadas",
    "3. Módulo de Notas",
    "4. Módulo de Bitácora",
    "5. Autenticación y autorización",
    "6. Aplicación de SOLID",
    "7. Patrones de diseño",
    "8. Calidad, puntualidad y evidencias",
    "9. Guion para la presentación y defensa",
    "10. Preguntas probables y respuestas",
    "11. Conclusiones y trabajo pendiente",
    "Anexo. Inventario de archivos principales",
]
for item in contents:
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Cm(0.4)
    p.paragraph_format.space_after = Pt(5)
    p.add_run(item)

add_heading(doc, "Fuentes de evidencia", 2)
add_bullet(doc, "Código fuente actual de prx-frontend y prx-backend.")
add_bullet(doc, "Alcance funcional asignado para el Sprint 1: Notas y Bitácora.")
add_bullet(doc, "Compilación y comprobaciones locales realizadas el 22 de septiembre de 2026.")

doc.add_page_break()

# 1 Sprint
add_heading(doc, "1 Alcance y resultado del Sprint 1", 1)
doc.add_paragraph(
    "El alcance comunicado para el Sprint 1 se concentra en dos módulos funcionales: Notas y Bitácora. La autenticación no se presenta como un tercer módulo del sprint, sino como la infraestructura transversal necesaria para identificar al usuario, proteger las rutas y aplicar permisos. La evaluación siguiente se limita a ese alcance asignado."
)
add_table(
    doc,
    ["Módulo", "Alcance del Sprint 1", "Evidencia actual", "Estado técnico"],
    [
        ["Notas", "Crear, consultar, editar y eliminar notas; administrar contenido, adjuntos, imágenes, enlaces y tareas.", "Listado en tarjetas, paginación, creación, detalle, edición, borrado lógico, archivos, enlaces y tareas marcables con persistencia.", "Cumplido"],
        ["Bitácora", "Registrar actividades personales y administrar tareas y enlaces con permisos por usuario.", "Creación, listado propio, consulta separada de edición, actualización, borrado lógico, enlaces y tareas marcables con persistencia.", "Cumplido"],
        ["Autenticación", "Soporte transversal para proteger ambos módulos.", "Login, JWT, refresh token, sesiones, guards, roles y validación de propiedad.", "Operativa"],
    ],
    widths=[1.8, 4.2, 7.0, 2.2],
    font_size=8.2,
)

add_status(doc, "Resultado", GREEN, "el alcance funcional asignado para el Sprint 1, compuesto por Notas y Bitácora, está implementado y puede demostrarse de extremo a extremo.")
doc.add_paragraph(
    "La defensa debe evaluar el cumplimiento contra la asignación efectiva del equipo. Funciones ajenas a Notas y Bitácora pueden considerarse mejoras futuras, pero no deben utilizarse para declarar incompleto este sprint."
)

add_heading(doc, "Criterio para defender el avance", 2)
add_bullet(doc, "Mostrar primero el flujo funcional que sí está terminado.")
add_bullet(doc, "Relacionar cada pantalla con su endpoint y persistencia.")
add_bullet(doc, "Explicar las decisiones de arquitectura y seguridad con ejemplos reales del código.")
add_bullet(doc, "Separar las mejoras futuras de los criterios que sí forman parte del alcance asignado.")

# 2 architecture
add_heading(doc, "2 Arquitectura y tecnologías utilizadas", 1)
doc.add_paragraph(
    "La solución separa responsabilidades tanto en frontend como en backend. Esta separación permite cambiar la interfaz, la fuente de datos o las reglas de negocio sin concentrar todo en un único componente."
)
add_table(
    doc,
    ["Capa", "Frontend Angular", "Backend NestJS"],
    [
        ["Presentación", "Páginas, plantillas, estilos, rutas y componentes standalone.", "Controladores HTTP, pipes, guards y decoradores."],
        ["Aplicación", "Facades, formularios y coordinación del estado.", "Commands, Queries y Handlers mediante CQRS."],
        ["Dominio", "Modelos, requests y contratos de API.", "Entidades y contratos abstractos de repositorio."],
        ["Infraestructura", "Servicios HTTP, configuración de endpoints y stores.", "Repositorios Prisma, mappers, JWT, bcrypt y almacenamiento."],
    ],
    widths=[2.8, 6.7, 6.7],
)

add_heading(doc, "Flujo general de una operación", 2)
for index, step in enumerate([
    "La persona interactúa con una página Angular.",
    "El componente delega la operación a una Facade.",
    "La Facade utiliza un servicio API y actualiza el Store.",
    "El controlador NestJS recibe y valida la solicitud.",
    "CommandBus o QueryBus dirige la operación al Handler correspondiente.",
    "El Handler aplica permisos y reglas de negocio mediante contratos de repositorio.",
    "La implementación Prisma guarda o consulta los datos y un Mapper forma la respuesta.",
], start=1):
    add_number(doc, step, index)

add_heading(doc, "Tecnologías", 2)
add_table(
    doc,
    ["Tecnología", "Uso en PRX"],
    [
        ["Angular 21", "Interfaz web, rutas protegidas, formularios reactivos, signals y carga diferida."],
        ["PrimeNG 21", "Botones, tarjetas, etiquetas, confirmaciones, skeletons y controles visuales."],
        ["RxJS", "Flujos asíncronos, manejo de loading, tap, catchError y finalize."],
        ["NestJS 11", "API modular, inyección de dependencias, validación y seguridad."],
        ["NestJS CQRS", "Separación entre comandos que modifican datos y consultas que los leen."],
        ["Prisma 6", "Mapeo y acceso tipado a MySQL."],
        ["JWT y bcrypt", "Tokens firmados y verificación segura de contraseñas."],
        ["Swagger", "Descripción de endpoints y cuerpos multipart/form-data."],
    ],
    widths=[4.0, 12.2],
)

# 3 Notes
add_heading(doc, "3 Módulo de Notas", 1)
doc.add_paragraph(
    "Notas permite trabajar dentro de un repositorio normal o del repositorio íntimo del usuario. La solución actual cubre listado, paginación, vista previa, detalle, edición, eliminación lógica, archivos, imágenes, enlaces y tareas."
)

add_heading(doc, "3.1 Funciones implementadas", 2)
for text in [
    "Listado por repositorio con tarjetas y paginación.",
    "Vista previa limitada a 180 caracteres para facilitar el escaneo.",
    "Creación con título, contenido, archivos, imágenes y enlaces web.",
    "Detalle independiente de la edición.",
    "Edición de título, contenido, tareas, enlaces y archivos conservados.",
    "Marcado de tareas desde la vista con guardado inmediato.",
    "Descarga de archivos mediante URL autorizada.",
    "Eliminación lógica y control de permisos según propietario o miembro del repositorio.",
]:
    add_bullet(doc, text)

add_heading(doc, "3.2 Modelo compartido en el frontend", 2)
add_code(
    doc,
    """export interface NoteTaskModel {
  id: string;
  title: string;
  completed: boolean;
}

export interface NoteLinkModel {
  id: string;
  url: string;
}""",
    "Archivo: prx-frontend/src/app/features/notes/domain/models/note.model.ts",
)
doc.add_paragraph(
    "Estas interfaces tipan las tareas y enlaces que viajan entre la pantalla, la Facade y la API. El identificador permite actualizar o eliminar un elemento concreto; completed representa el estado de la tarea; url almacena el enlace validado."
)

add_heading(doc, "3.3 Comunicación con la API", 2)
add_code(
    doc,
    """formData.append('title', data.title);
formData.append('content', data.content);
formData.append('tasks', JSON.stringify(data.tasks));
formData.append('links', JSON.stringify(data.links));
formData.append('retainedFileIds', data.retainedFileIds.join(','));""",
    "Archivo: prx-frontend/src/app/features/notes/infrastructure/api/note.api.ts",
)
doc.add_paragraph(
    "La actualización usa FormData porque una misma solicitud puede transportar texto estructurado y archivos binarios. Las tareas y enlaces se serializan como JSON; retainedFileIds indica cuáles adjuntos existentes deben conservarse."
)

add_heading(doc, "3.4 Marcado de tareas desde la vista", 2)
add_code(
    doc,
    """protected toggleTask(task: NoteTaskModel): void {
  this.tasks.update((tasks) =>
    tasks.map((item) => item.id === task.id
      ? { ...item, completed: !item.completed }
      : item),
  );
  if (!this.editing()) this.persist(false);
}""",
    "Archivo: prx-frontend/src/app/features/notes/presentation/pages/note-detail-page/note-detail-page.component.ts",
)
doc.add_paragraph(
    "El estado se actualiza de forma inmutable. Cuando la pantalla está en modo consulta, persist(false) envía el cambio sin abrir ni cerrar el editor. Esta decisión reproduce el comportamiento esperado de una lista de tareas: marcar debe ser una acción rápida."
)

add_heading(doc, "3.5 Endpoints y backend", 2)
add_table(
    doc,
    ["Método", "Ruta", "Responsabilidad"],
    [
        ["GET", "/prx/notes/repository/:repositoryId", "Listar notas paginadas del repositorio autorizado."],
        ["GET", "/prx/notes/:id", "Consultar el detalle de una nota."],
        ["POST", "/prx/notes/repository/:repositoryId", "Crear nota y hasta cinco archivos."],
        ["PUT", "/prx/notes/:id", "Actualizar contenido, tareas, enlaces y adjuntos."],
        ["DELETE", "/prx/notes/:id", "Realizar eliminación lógica."],
        ["GET", "/prx/notes/files/:id/download", "Obtener una URL de descarga autorizada."],
    ],
    widths=[2.0, 6.0, 8.2],
)

add_code(
    doc,
    """const tasks = this.parseTasks(command.dto.tasks);
const links = this.parseLinks(command.dto.links);

if (retainedFiles.length + command.files.length > 5) {
  throw new BadRequestException('La nota permite un máximo de 5 archivos');
}""",
    "Archivo: prx-backend/src/modules/notes/application/commands/update-note/update-note.handler.ts",
)
doc.add_paragraph(
    "El Handler no confía en el JSON recibido. Convierte y valida tareas y enlaces, limita cantidades y comprueba permisos antes de persistir. También sincroniza los adjuntos: elimina los descartados del repositorio y del almacenamiento, y carga los nuevos."
)

add_heading(doc, "3.6 Persistencia", 2)
add_code(
    doc,
    """model Note {
  id           Int      @id @default(autoincrement())
  repositoryId Int
  title        String
  content      String
  tasks        Json?
  links        Json?
  status       Int      @default(1)
}""",
    "Archivo: prx-backend/prisma/schema.prisma, modelo Note",
)
doc.add_paragraph(
    "tasks y links se guardan como JSON porque son listas pequeñas que pertenecen a una nota y se recuperan junto con ella. status permite eliminación lógica, conservando trazabilidad. Los archivos se normalizan en NoteFile porque requieren metadatos y ciclo de vida propio."
)

add_heading(doc, "3.7 Mejoras futuras de Notas", 2)
add_status(doc, "Mejora opcional", AMBER, "incorporar búsqueda por título o contenido cuando esa función sea priorizada en un sprint posterior.")
add_status(doc, "Mejora opcional", AMBER, "permitir agregar tareas durante la creación inicial; actualmente se administran desde el detalle y la edición de la nota.")
add_status(doc, "Mejora recomendada", AMBER, "añadir pruebas unitarias de parseTasks, parseLinks, permisos y persistencia inmediata de checkboxes.")

# 4 Binnacle
add_heading(doc, "4 Módulo de Bitácora", 1)
doc.add_paragraph(
    "Bitácora es uno de los dos módulos asignados al Sprint 1. Registra actividades personales del usuario estándar, mantiene los datos aislados por userId y expone únicamente las bitácoras propias. Su implementación cubre creación, consulta, edición, tareas, enlaces y eliminación lógica."
)

add_heading(doc, "4.1 Funciones implementadas", 2)
for text in [
    "Crear una bitácora con título, descripción, tareas y enlaces.",
    "Listar únicamente las bitácoras del usuario autenticado.",
    "Abrir una vista de consulta mediante el botón Ver.",
    "Entrar a edición desde la vista mediante un botón independiente.",
    "Agregar o eliminar tareas y enlaces en edición.",
    "Marcar tareas desde la vista y guardar inmediatamente.",
    "Abrir enlaces externos de forma segura con noopener noreferrer.",
    "Eliminar mediante borrado lógico.",
]:
    add_bullet(doc, text)

add_heading(doc, "4.2 Separación entre ver y editar", 2)
add_code(
    doc,
    """<p-button
  label=\"Ver\"
  icon=\"pi pi-eye\"
  (onClick)=\"openBinnacle(binnacle.id)\">
</p-button>

@if (!editing()) {
  <button (click)=\"startEditing()\">Editar</button>
}""",
    "Archivos: binnacle-page.component.html y binnacle-detail-page.component.html",
)
doc.add_paragraph(
    "La lista ya no mezcla dos intenciones distintas. Ver navega a una lectura limpia; Editar aparece dentro del detalle. Esto reduce errores de uso y mantiene una jerarquía clara de acciones."
)

add_heading(doc, "4.3 Guardado inmediato de tareas", 2)
add_code(
    doc,
    """protected toggleTask(id: string): void {
  if (this.saving()) return;
  this.tasks.update((tasks) =>
    tasks.map((task) => task.id === id
      ? { ...task, completed: !task.completed }
      : task),
  );
  if (!this.editing()) this.persist(false);
}""",
    "Archivo: prx-frontend/src/app/features/binnacles/presentation/pages/binnacle-detail-page.component.ts",
)
doc.add_paragraph(
    "saving evita solicitudes simultáneas. La actualización local ofrece respuesta inmediata y persist(false) envía título, contenido, tareas y enlaces al endpoint PUT sin sacar al usuario de la vista. Si la solicitud falla, el componente restaura el objeto recibido previamente."
)

add_heading(doc, "4.4 Seguridad y propiedad", 2)
add_code(
    doc,
    """@Controller('binnacles')
@Roles(Role.estandar)
export class BinnaclesController {
  @Get('me') findPaginatedMe(...) { ... }
  @Get(':id') findById(...) { ... }
  @Put(':id') update(...) { ... }
}""",
    "Archivo: prx-backend/src/modules/binnacles/presentation/controllers/binnacles.controllers.ts",
)
doc.add_paragraph(
    "El decorador limita todo el controlador al rol estandar. Además, los Handlers comparan binnacle.userId con el sub del token; por eso conocer el ID de otra bitácora no concede acceso. Se combinan autorización por rol y autorización por propiedad."
)

add_heading(doc, "4.5 Campos de base de datos", 2)
add_code(
    doc,
    """model Binnacle {
  id        Int      @id @default(autoincrement())
  userId    Int
  name      String
  content   String
  tasks     Json?
  links     Json?
  status    Int      @default(1)
  updatedBy Int?
}""",
    "Archivo: prx-backend/prisma/schema.prisma, modelo Binnacle",
)
doc.add_paragraph(
    "Sí existen campos para guardar tareas y enlaces. Ambos se persisten como JSON y son convertidos por BinnaclePrismaMapper. userId determina la propiedad; status implementa borrado lógico; createdBy y updatedBy conservan auditoría."
)

add_heading(doc, "4.6 Endpoints", 2)
add_table(
    doc,
    ["Método", "Ruta", "Responsabilidad"],
    [
        ["POST", "/prx/binnacles", "Crear bitácora propia."],
        ["GET", "/prx/binnacles/me", "Listar bitácoras propias con paginación."],
        ["GET", "/prx/binnacles/:id", "Consultar una bitácora propia."],
        ["PUT", "/prx/binnacles/:id", "Actualizar contenido, tareas y enlaces."],
        ["DELETE", "/prx/binnacles/:id", "Realizar eliminación lógica."],
    ],
    widths=[2.0, 6.0, 8.2],
)

# 5 Auth
add_heading(doc, "5 Autenticación y autorización", 1)
doc.add_paragraph(
    "El autenticador cubre el ciclo completo de identidad: solicitud y confirmación de registro, inicio de sesión, renovación de tokens, consulta del usuario actual, cierre de sesión y recuperación o cambio de contraseña."
)

add_heading(doc, "5.1 Flujo de inicio de sesión", 2)
for index, step in enumerate([
    "El usuario envía correo o nombre de usuario y contraseña.",
    "LoginHandler busca la cuenta por el tipo de identificador.",
    "BcryptService compara la contraseña con el hash almacenado.",
    "Se crea una Session con user agent e IP cuando están disponibles.",
    "JwtTokenService firma un access token y un refresh token con secretos y vencimientos distintos.",
    "El refresh token se guarda asociado a la sesión.",
    "El frontend guarda los tokens, actualiza AuthStore y adjunta Bearer a las solicitudes.",
], start=1):
    add_number(doc, step, index)

add_code(
    doc,
    """const validPassword = await this.bcryptService.compare(
  password,
  user.passwordHash,
);
const accessToken = await this.jwtTokenService.generateAccessToken(payload);
const refreshToken = await this.jwtTokenService.generateRefreshToken(payload);""",
    "Archivo: prx-backend/src/modules/auth/application/commands/login/login.handler.ts",
)
doc.add_paragraph(
    "La contraseña nunca se compara como texto plano contra la base de datos. El access token autoriza llamadas breves; el refresh token permite renovar la sesión sin pedir nuevamente la contraseña."
)

add_heading(doc, "5.2 Protección de la API", 2)
add_code(
    doc,
    """if (!authHeader || !authHeader.startsWith('Bearer ')) {
  throw new UnauthorizedException(AUTH_MESSAGES.UNAUTHORIZED);
}
const payload = await this.jwtService.verifyAsync(token, { secret });
if (payload.tokenType !== TokenTypeEnum.ACCESS) {
  throw new UnauthorizedException(AUTH_MESSAGES.INVALID_TOKEN);
}""",
    "Archivo: prx-backend/src/shared/presentation/guards/jwt-auth.guard.ts",
)
doc.add_paragraph(
    "JwtAuthGuard rechaza solicitudes sin Bearer, tokens vencidos, firmas inválidas y refresh tokens utilizados incorrectamente como access tokens. CurrentUser extrae sub para que los casos de uso apliquen propiedad y auditoría."
)

add_heading(doc, "5.3 Autorización por roles", 2)
add_code(
    doc,
    """const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
  context.getHandler(),
  context.getClass(),
]);
if (!user?.role || !requiredRoles.includes(user.role)) {
  throw new ForbiddenException(AUTH_MESSAGES.FORBIDDEN);
}""",
    "Archivo: prx-backend/src/shared/presentation/guards/roles.guard.ts",
)
doc.add_paragraph(
    "RolesGuard lee los roles declarados por @Roles y devuelve 403 cuando el usuario está autenticado pero no autorizado. En Angular, standardUserGuard evita navegar a Bitácora si el usuario actual no tiene rol estandar. El backend sigue siendo la autoridad definitiva."
)

add_heading(doc, "5.4 Renovación automática en el frontend", 2)
doc.add_paragraph(
    "auth.interceptor agrega Authorization: Bearer <token>. refresh.interceptor detecta respuestas 401, solicita un nuevo par de tokens y reintenta la petición original. AuthRefreshService centraliza una sola renovación compartida para evitar múltiples refresh simultáneos. error.interceptor limpia la sesión cuando la renovación no es posible."
)

add_heading(doc, "5.5 Endpoints de autenticación", 2)
add_table(
    doc,
    ["Endpoint", "Acceso", "Función"],
    [
        ["POST /auth/register-request", "Público", "Iniciar registro y generar código."],
        ["POST /auth/confirm-register", "Público", "Confirmar código y crear cuenta."],
        ["POST /auth/login", "Público limitado", "Autenticar; máximo 3 intentos por minuto."],
        ["POST /auth/refresh", "Público con refresh token", "Rotar refresh token y emitir access token."],
        ["POST /auth/forgot-password", "Público", "Iniciar recuperación."],
        ["POST /auth/reset-password", "Público con código", "Restablecer contraseña."],
        ["PATCH /auth/change-password", "JWT", "Cambiar contraseña autenticada."],
        ["POST /auth/logout", "JWT", "Revocar token o sesión."],
        ["GET /auth/me", "JWT", "Recuperar identidad de la sesión."],
    ],
    widths=[6.0, 3.8, 6.4],
    font_size=8.0,
)

add_heading(doc, "5.6 Medidas de seguridad utilizadas", 2)
for text in [
    "Hash de contraseñas con bcrypt y salt rounds configurados.",
    "Secretos diferentes para access token y refresh token.",
    "Validación explícita del tipo de token.",
    "Sesiones y refresh tokens persistidos con revocación y expiración.",
    "Rotación del refresh token durante la renovación.",
    "Rate limiting en login.",
    "Guards en frontend para experiencia de navegación y guards en backend para seguridad real.",
    "DTOs y ValidationPipe para rechazar datos inválidos o campos inesperados.",
]:
    add_bullet(doc, text)

# 6 SOLID
add_heading(doc, "6 Aplicación de los principios SOLID", 1)
doc.add_paragraph(
    "SOLID no se demuestra por nombrar carpetas, sino mostrando cómo una modificación queda localizada. En PRX hay ejemplos claros y también aspectos que pueden seguir mejorándose."
)
add_table(
    doc,
    ["Principio", "Aplicación en PRX", "Ejemplo defendible"],
    [
        ["S Responsabilidad única", "Componentes muestran UI; Facades coordinan; Handlers aplican casos de uso; repositorios persisten.", "BinnacleDetailPage no ejecuta Prisma y PrismaBinnacleRepository no decide navegación."],
        ["O Abierto cerrado", "Los contratos permiten sustituir implementaciones sin cambiar al consumidor.", "BinnacleRepository puede tener otra implementación además de Prisma."],
        ["L Sustitución de Liskov", "Las implementaciones respetan el contrato abstracto esperado por los Handlers.", "PrismaNoteRepository devuelve NoteEntity y conserva la semántica del repositorio."],
        ["I Segregación de interfaces", "Los contratos están separados por módulo y propósito.", "NoteApiContract no obliga a implementar operaciones de autenticación o Bitácora."],
        ["D Inversión de dependencias", "Los casos de uso dependen de abstracciones inyectadas, no directamente de Prisma.", "UpdateBinnacleHandler recibe BinnacleRepository mediante @Inject."],
    ],
    widths=[3.3, 6.0, 6.9],
    font_size=8.0,
)

add_heading(doc, "Ejemplo de inversión de dependencias", 2)
add_code(
    doc,
    """constructor(
  @Inject(BinnacleRepository)
  private readonly binnacleRepository: BinnacleRepository,
) {}""",
    "Archivo: update-binnacle.handler.ts",
)
doc.add_paragraph(
    "El Handler conoce la operación que necesita, no la tecnología de base de datos. El módulo enlaza el contrato con PrismaBinnacleRepository. Esto mejora pruebas, reemplazo de infraestructura y mantenimiento."
)

add_heading(doc, "Evaluación honesta de SOLID", 2)
add_status(doc, "Fortaleza", GREEN, "la separación por capas, CQRS, facades, contratos y repositorios ofrece una aplicación clara de SRP y DIP.")
add_status(doc, "Mejora", AMBER, "parseTasks y parseLinks están duplicados conceptualmente entre módulos; una política de validación compartida podría reducir repetición sin mezclar dominios.")
add_status(doc, "Mejora", AMBER, "algunos componentes de página todavía coordinan muchas acciones de UI; conviene extraer componentes cuando aumente su complejidad, no antes.")

# 7 Patterns
add_heading(doc, "7 Patrones de diseño utilizados", 1)
add_table(
    doc,
    ["Patrón", "Dónde aparece", "Qué problema resuelve"],
    [
        ["Arquitectura por capas", "Frontend y backend por presentación, aplicación, dominio e infraestructura.", "Evita acoplar interfaz, reglas y persistencia."],
        ["CQRS", "Commands, Queries, Handlers, CommandBus y QueryBus.", "Separa lectura de escritura y enfoca cada caso de uso."],
        ["Repository", "NoteRepository, BinnacleRepository y sus implementaciones Prisma.", "Oculta detalles de base de datos al dominio."],
        ["Facade", "NoteFacade, BinnacleFacade y AuthFacade.", "Entrega una API simple a las páginas y coordina Store más servicio HTTP."],
        ["Mapper", "NoteResponseMapper, Prisma mappers y AuthResponseMapper.", "Convierte entre registros, entidades y DTOs sin filtrar formatos entre capas."],
        ["Guard", "authGuard, JwtAuthGuard, RolesGuard y standardUserGuard.", "Centraliza decisiones de acceso y evita repetir validaciones en rutas."],
        ["DTO", "CreateNoteRequestDto, UpdateBinnacleDto y DTOs de Auth.", "Define y valida el contrato de entrada."],
        ["Store reactivo", "Stores Angular basados en signals.", "Mantiene loading, datos y errores compartidos de forma predecible."],
        ["Soft delete", "Campo status en Note y Binnacle.", "Conserva auditoría sin mostrar registros eliminados."],
    ],
    widths=[3.0, 6.5, 6.7],
    font_size=7.8,
)

add_heading(doc, "Por qué CQRS es apropiado", 2)
doc.add_paragraph(
    "Crear, actualizar y eliminar cambian el estado y se modelan como Commands. Listar o consultar por ID no cambia datos y se modela como Queries. Cada Handler tiene una entrada específica y una responsabilidad clara. Para este proyecto, CQRS también facilita ubicar reglas de permisos en el caso de uso correspondiente."
)

add_heading(doc, "Por qué se usa Facade en Angular", 2)
doc.add_paragraph(
    "La página no necesita conocer detalles del HttpClient ni cómo se administra loading. Por ejemplo, NoteFacade llama a NoteApi, normaliza respuestas paginadas y actualiza NoteStore. Esto reduce acoplamiento entre UI e infraestructura y permite que varias páginas reutilicen el mismo flujo."
)

# 8 quality
add_heading(doc, "8 Calidad, puntualidad y evidencias", 1)
add_heading(doc, "8.1 Puntualidad", 2)
doc.add_paragraph(
    "La fecha límite informada es el 23 de septiembre de 2026 a las 23:59 y este informe fue preparado el 22 de septiembre. La evidencia técnica puede presentarse antes del vencimiento. Sin embargo, la puntualidad de la entrega final depende de realizar el envío en la plataforma dentro del plazo; el código por sí solo no demuestra el momento del envío."
)

add_heading(doc, "8.2 Calidad técnica comprobada", 2)
add_table(
    doc,
    ["Comprobación", "Resultado", "Interpretación"],
    [
        ["Compilación Angular", "Aprobada", "ng build generó el bundle correctamente."],
        ["Servidor frontend", "Activo", "Disponible en http://127.0.0.1:4200/."],
        ["Servidor backend", "Activo", "Escucha en el puerto 3000."],
        ["Ruta protegida", "401 sin token", "GET /prx/binnacles/me respondió como recurso protegido."],
        ["Persistencia Bitácora", "Verificada", "GET y PUT fueron probados y se comprobó el cambio de tareas y enlaces."],
        ["Advertencia de build", "No bloqueante", "El SCSS de create-note supera el presupuesto por 818 bytes."],
    ],
    widths=[4.0, 3.0, 9.2],
)

add_heading(doc, "8.3 Criterios de calidad presentes", 2)
for text in [
    "Validación de formularios en frontend y DTOs en backend.",
    "Mensajes de error y estados loading para evitar dobles envíos.",
    "Paginación para no cargar todos los registros.",
    "Borrado lógico y campos de auditoría.",
    "URLs externas abiertas con rel noopener noreferrer.",
    "Comprobaciones de propietario o membresía antes de leer y modificar datos.",
    "Límites de tareas, enlaces, archivos y longitudes de texto.",
]:
    add_bullet(doc, text)

add_heading(doc, "8.4 Mejoras para siguientes iteraciones", 2)
add_table(
    doc,
    ["Prioridad", "Acción", "Razón"],
    [
        ["Media", "Agregar búsqueda de notas.", "Mejora la localización de contenido cuando aumente el volumen."],
        ["Media", "Agregar tareas al formulario de creación de nota.", "Permite preparar la lista antes del primer guardado."],
        ["Alta", "Añadir pruebas unitarias y de integración.", "Reduce regresiones en permisos y parseo JSON."],
        ["Baja", "Reducir el tamaño del SCSS de creación de notas.", "Elimina la advertencia del presupuesto Angular."],
    ],
    widths=[2.4, 6.2, 7.6],
)

# 9 presentation
add_heading(doc, "9 Guion para la presentación y defensa", 1)
doc.add_paragraph(
    "Duración sugerida: 10 a 12 minutos. Cada afirmación debe acompañarse con una pantalla o archivo concreto."
)
add_table(
    doc,
    ["Tiempo", "Qué mostrar", "Qué explicar"],
    [
        ["1 min", "Objetivo y alcance", "Notas y Bitácora como módulos asignados al Sprint 1."],
        ["2 min", "Arquitectura", "Capas, flujo Angular a NestJS y separación CQRS."],
        ["3 min", "Notas", "Listado, creación, detalle, enlaces, archivos, tareas y guardado inmediato."],
        ["2 min", "Autenticación", "Login, JWT, refresh, sesión, guards y roles."],
        ["2 min", "Bitácora", "Ver separado de Editar, tareas marcables y propiedad por usuario."],
        ["1 min", "SOLID y patrones", "Ejemplos concretos de SRP, DIP, Repository, Facade y CQRS."],
        ["1 min", "Calidad y cierre", "Build, API protegida, cumplimiento y mejoras posteriores."],
    ],
    widths=[2.0, 5.1, 9.1],
    font_size=8.2,
)

add_heading(doc, "Demostración recomendada", 2)
for index, step in enumerate([
    "Iniciar sesión con un usuario estándar y mostrar que se recupera la sesión.",
    "Abrir Notas y enseñar tarjetas, vista previa y paginación.",
    "Crear una nota con contenido, enlace y archivo o imagen.",
    "Abrir el detalle, marcar una tarea sin editar y comprobar que permanece tras recargar.",
    "Entrar en Editar, cambiar contenido o enlaces y guardar.",
    "Abrir Bitácora desde un usuario estándar, pulsar Ver y después Editar.",
    "Marcar una tarea en la vista de Bitácora y recargar para evidenciar persistencia.",
    "Cerrar con los archivos de Handler, Repository y Guard para explicar la arquitectura.",
], start=1):
    add_number(doc, step, index)

add_heading(doc, "Mensaje de apertura sugerido", 2)
doc.add_paragraph(
    "En este sprint construimos la base de gestión de notas y consolidamos la autenticación que protege los módulos. La solución no se limita a pantallas: conecta formularios Angular, casos de uso CQRS, control de permisos y persistencia Prisma. Además, adelantamos Bitácora con tareas y enlaces. Vamos a mostrar primero el flujo funcional y luego las decisiones de diseño que permiten mantenerlo."
)

add_heading(doc, "Mensaje de cierre sugerido", 2)
doc.add_paragraph(
    "El resultado demuestra separación de responsabilidades, seguridad por token, rol y propiedad, y persistencia completa de notas y bitácoras. Los dos módulos asignados al Sprint 1 están operativos. Las funciones adicionales identificadas se presentan como mejoras para siguientes iteraciones, no como requisitos pendientes de este sprint."
)

# 10 Q&A
add_heading(doc, "10 Preguntas probables y respuestas", 1)
qa = [
    ("¿Dónde se aplicó SOLID?", "Principalmente en la separación entre páginas, Facades, Handlers y repositorios. UpdateBinnacleHandler depende del contrato BinnacleRepository, no de Prisma directamente, lo que evidencia inversión de dependencias."),
    ("¿Qué patrón es el más importante?", "CQRS organiza cada lectura y escritura como un caso de uso independiente. Repository desacopla esos casos de uso de la base de datos y Facade simplifica el consumo desde Angular."),
    ("¿Por qué tareas y enlaces son JSON?", "Son colecciones pequeñas, propias de una nota o bitácora, que normalmente se leen y escriben junto con su registro. JSON reduce tablas auxiliares. Si se necesitara consultar tareas globalmente, asignarlas a usuarios o auditarlas individualmente, convendría normalizarlas."),
    ("¿Cómo se evita que un usuario edite datos ajenos?", "El JWT aporta el userId mediante sub. Los Handlers comparan ese valor con el propietario o verifican membresía. En Bitácora también se exige el rol estandar."),
    ("¿Por qué hay guards en frontend y backend?", "El frontend mejora la experiencia y evita navegación inválida; el backend es la barrera de seguridad porque no puede confiar en el navegador."),
    ("¿Qué ocurre cuando vence el access token?", "El interceptor detecta el 401, usa el refresh token, guarda el nuevo par y reintenta la solicitud. El backend rota el refresh token y comprueba que la sesión siga activa."),
    ("¿El Sprint 1 está terminado?", "Sí respecto al alcance asignado de Notas y Bitácora. Ambos módulos cuentan con interfaz, API, persistencia y control de acceso. La búsqueda u otras funciones no asignadas se consideran mejoras posteriores."),
    ("¿Qué se probaría primero?", "Permisos, parseo de tareas y enlaces, rotación de refresh token y persistencia al marcar tareas, porque son puntos con mayor impacto funcional y de seguridad."),
]
for question, answer in qa:
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(7)
    p.paragraph_format.space_after = Pt(3)
    r = p.add_run(question)
    r.bold = True
    r.font.color.rgb = RGBColor.from_string(NAVY)
    set_keep_with_next(p)
    doc.add_paragraph(answer)

# 11 Conclusion
add_heading(doc, "11 Conclusiones y trabajo pendiente", 1)
doc.add_paragraph(
    "PRX dispone de una base técnica coherente: Angular consume una API NestJS modular, los casos de uso están separados mediante CQRS, los repositorios encapsulan Prisma y los accesos se controlan con JWT, sesiones, roles y propiedad. Notas y Bitácora comparten una experiencia consistente para consultar, editar, manejar enlaces y completar tareas."
)
doc.add_paragraph(
    "La defensa debe centrarse en evidencia ejecutable y en decisiones concretas de diseño. La mejor postura ante la evaluación es mostrar lo que funciona, explicar por qué está construido de esa manera y reconocer con precisión lo que falta."
)
add_status(doc, "Cumplimiento del Sprint 1", GREEN, "Notas y Bitácora están implementadas con sus flujos principales, persistencia y permisos.")
add_status(doc, "Para elevar calidad", AMBER, "incorporar pruebas automatizadas de permisos, autenticación, JSON y persistencia inmediata.")
add_status(doc, "Soporte transversal", GREEN, "Autenticación protege ambos módulos mediante JWT, sesiones, roles y validación de propiedad.")

# Appendix
add_heading(doc, "Anexo Inventario de archivos principales", 1)
add_appendix_heading(doc, "Notas frontend")
for path, purpose in [
    ("features/notes/domain/models/note.model.ts", "Modelos de nota, tarea y enlace."),
    ("features/notes/domain/requests/create-note.request.ts", "Contrato de creación."),
    ("features/notes/domain/requests/update-note.request.ts", "Contrato de edición con tareas, enlaces y archivos."),
    ("features/notes/application/facades/note.facade.ts", "Coordinación de API y estado."),
    ("features/notes/infrastructure/api/note.api.ts", "Solicitudes HTTP y FormData."),
    ("features/notes/infrastructure/store/note.store.ts", "Estado reactivo del módulo."),
    ("features/notes/presentation/pages/notes-page", "Listado y tarjetas."),
    ("features/notes/presentation/pages/create-note-page", "Formulario de creación."),
    ("features/notes/presentation/pages/note-detail-page", "Consulta, tareas y edición."),
]:
    add_appendix_bullet(doc, f"{path}: {purpose}")

add_appendix_heading(doc, "Notas backend")
for path, purpose in [
    ("modules/notes/presentation/controllers/notes.controller.ts", "Endpoints HTTP."),
    ("modules/notes/application/commands", "Casos de uso de escritura."),
    ("modules/notes/application/queries", "Casos de uso de lectura."),
    ("modules/notes/domain/entities", "Entidades del dominio."),
    ("modules/notes/domain/repositories", "Contratos de persistencia."),
    ("modules/notes/infrastructure/persistence", "Implementación Prisma."),
    ("modules/notes/infrastructure/mappers", "Conversión Prisma a dominio."),
]:
    add_appendix_bullet(doc, f"{path}: {purpose}")

add_appendix_heading(doc, "Bitácora")
for path, purpose in [
    ("prx-frontend/src/app/features/binnacles", "Frontend completo del módulo."),
    ("prx-backend/src/modules/binnacles", "Backend completo del módulo."),
    ("binnacle-detail-page.component.ts", "Vista, edición y persistencia de tareas."),
    ("binnacles.controllers.ts", "CRUD protegido por rol estandar."),
    ("prisma-binnacle.repository.ts", "Persistencia y borrado lógico."),
]:
    add_appendix_bullet(doc, f"{path}: {purpose}")

add_appendix_heading(doc, "Autenticación")
for path, purpose in [
    ("prx-frontend/src/app/features/auth", "Pantallas, Facade, API y Store de autenticación."),
    ("prx-frontend/src/app/core/interceptors", "Bearer, renovación y errores 401."),
    ("prx-frontend/src/app/core/guards", "Protección de rutas por sesión y rol."),
    ("prx-backend/src/modules/auth", "Registro, login, refresh, logout y contraseñas."),
    ("jwt-auth.guard.ts", "Verificación global del access token."),
    ("roles.guard.ts", "Autorización declarativa por rol."),
    ("prisma/schema.prisma", "Session, RefreshToken, VerificationCode y PasswordReset."),
]:
    add_appendix_bullet(doc, f"{path}: {purpose}")

# Prevent heading orphans and normalize fonts in tables.
for paragraph in doc.paragraphs:
    if paragraph.style and paragraph.style.name.startswith("Heading"):
        set_keep_with_next(paragraph)

for table in doc.tables:
    for row in table.rows:
        for cell in row.cells:
            for paragraph in cell.paragraphs:
                paragraph.paragraph_format.line_spacing = 1.05
                for run in paragraph.runs:
                    if run.font.name is None:
                        run.font.name = "Aptos"
                        run._element.rPr.rFonts.set(qn("w:ascii"), "Aptos")
                        run._element.rPr.rFonts.set(qn("w:hAnsi"), "Aptos")

doc.core_properties.title = "Informe de defensa del Sprint 1 PRX"
doc.core_properties.subject = "Notas, Bitácora, Autenticación, SOLID y patrones"
doc.core_properties.author = "Equipo PRX"
doc.core_properties.keywords = "PRX, Sprint 1, Notas, Bitácora, Autenticación, SOLID, CQRS"
doc.save(OUTPUT)
print(OUTPUT)
