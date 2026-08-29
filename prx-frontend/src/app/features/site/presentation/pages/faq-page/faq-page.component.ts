import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { ChipModule } from 'primeng/chip';
import { ScrollTopModule } from 'primeng/scrolltop';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

interface FAQCategory {
  name: string;
  icon: string;
  questions: FAQItem[];
}

interface FAQItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    PanelModule,
    ChipModule,
    ScrollTopModule,
    InputTextModule,
    FormsModule,
  ],
  templateUrl: './faq-page.component.html',
  styleUrls: ['./faq-page.component.scss'],
})
export class FaqPageComponent implements OnInit {
  private readonly router = inject(Router);

  searchTerm: string = '';

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  faqCategories: FAQCategory[] = [
    {
      name: 'General',
      icon: 'pi pi-question-circle',
      questions: [
        {
          question: '¿Qué es PRX?',
          answer:
            'PRX es una plataforma digital colaborativa que integra el arte, la filosofía, la ciencia y la tecnología, permitiendo a las personas compartir conocimiento, experiencias y recursos para comprender y transformar la realidad.',
        },
        {
          question: '¿Cómo me registro?',
          answer:
            'Puedes registrarte usando tu email. Ve a la página de registro, completa tus datos y confirma tu cuenta con el enlace que recibirás por correo.',
        },
      ],
    },
    {
      name: 'Cuenta y Perfil',
      icon: 'pi pi-user',
      questions: [
        {
          question: '¿Cómo edito mi perfil?',
          answer:
            'Inicia sesión, ve a tu perfil y haz clic en "Editar perfil". Puedes cambiar tu foto, biografía, información personal y enlaces a redes sociales.',
        },
        {
          question: '¿Puedo cambiar mi contraseña?',
          answer:
            'Sí, desde la sección de perfil puedes acceder a "Cambiar contraseña". Se te pedirá tu contraseña actual y la nueva contraseña.',
        },
        {
          question: '¿Cómo elimino mi cuenta?',
          answer:
            'Para eliminar tu cuenta, contacta a soporte. Ten en cuenta que esta acción es irreversible y perderás todo tu contenido.',
        },
      ],
    },
    {
      name: 'Repositorios',
      icon: 'pi pi-folder',
      questions: [
        {
          question: '¿Cómo creo un repositorio?',
          answer:
            'Haz clic en "Crear repositorio" desde el menú principal. Completa el nombre, descripción, visibilidad, categoría y etiquetas. Luego haz clic en "Crear".',
        },
        {
          question: '¿Qué diferencias hay entre Público, Privado e Íntimo?',
          answer:
            'Público: visible para todos. Privado: solo visible para miembros del repositorio. Íntimo: solo visible para el propietario y copropietarios.',
        },
        {
          question: '¿Puedo cambiar la visibilidad después?',
          answer:
            'Sí, los propietarios y copropietarios pueden cambiar la visibilidad desde la configuración del repositorio en cualquier momento.',
        },
        {
          question: '¿Cómo invito a alguien a mi repositorio?',
          answer:
            'Ve a la sección "Equipo" de tu repositorio, haz clic en "Invitar colaborador", ingresa el email y selecciona la función que desempeñará.',
        },
      ],
    },
    {
      name: 'Roles y Permisos',
      icon: 'pi pi-users',
      questions: [
        {
          question: '¿Qué puede hacer un Cocreador?',
          answer:
            'Los Cocreadores pueden crear y editar contenido (carpetas, archivos, notas).',
        },
        {
          question: '¿Qué diferencia hay entre Cocreador y Miembro?',
          answer:
            'Ninguna en cuanto a permisos: ambos pueden crear y editar contenido del repositorio (carpetas, archivos, notas). La diferencia está en cómo se obtiene el rol: el Cocreador es invitado por el propietario o los copropietarios sin costo, mientras que el Miembro accede pagando una membresía.',
        },
        {
          question: '¿Puedo ascender a alguien a Copropietario?',
          answer:
            'Solo el propietario puede ascender a otros usuarios a Copropietario. Ve a la sección "Equipo" y usa las opciones de acción.',
        },
      ],
    },
    {
      name: 'Archivos y Contenido',
      icon: 'pi pi-file',
      questions: [
        {
          question: '¿Qué tipos de archivo puedo subir?',
          answer:
            'Puedes subir imágenes, documentos PDF, Word, Excel, archivos comprimidos (ZIP, RAR) y videos. El límite máximo por archivo es de 10MB.',
        },
        {
          question: '¿Cómo organizo mis archivos?',
          answer:
            'Puedes crear carpetas dentro del repositorio para organizar mejor tu contenido. Las carpetas pueden tener colores personalizados.',
        },
        {
          question: '¿Qué son las notas?',
          answer:
            'Las notas son entradas de texto para documentar el progreso de tus proyectos. Tienen título y contenido.',
        },
      ],
    },
    {
      name: 'Soporte',
      icon: 'pi pi-headphones',
      questions: [
        {
          question: '¿Cómo contacto con soporte?',
          answer:
            'Puedes contactarnos a través de soporte@prx.com o usando el formulario de contacto en nuestra web. Respondemos en un máximo de 48 horas.',
        },
        {
          question: '¿Dónde puedo reportar un error?',
          answer:
            'Reporta errores a través del correo bugs@prx.com. Por favor incluye una descripción detallada y capturas de pantalla si es posible.',
        },
        {
          question: '¿PRX tiene documentación?',
          answer:
            'Sí, contamos con documentación completa en nuestro sitio, incluyendo guías de uso, API reference y tutoriales en video.',
        },
      ],
    },
  ];

  get filteredCategories(): FAQCategory[] {
    if (!this.searchTerm.trim()) {
      return this.faqCategories;
    }

    const term = this.searchTerm.toLowerCase();
    return this.faqCategories
      .map((category) => ({
        ...category,
        questions: category.questions.filter(
          (q) => q.question.toLowerCase().includes(term) || q.answer.toLowerCase().includes(term),
        ),
      }))
      .filter((category) => category.questions.length > 0);
  }

  clearSearch(): void {
    this.searchTerm = '';
  }
}
