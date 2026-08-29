import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { ScrollTopModule } from 'primeng/scrolltop';

interface Benefit {
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  message: string;
}

@Component({
  selector: 'app-become-co-creator-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    AccordionModule,
    PanelModule,
    AvatarModule,
    AvatarGroupModule,
    ChipModule,
    TagModule,
    DividerModule,
    TooltipModule,
    ScrollTopModule,
  ],
  templateUrl: './become-co-creator-page.component.html',
  styleUrls: ['./become-co-creator-page.component.scss'],
})
export class BecomeCoCreatorPageComponent implements OnInit {
  private readonly router = inject(Router);

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
  benefits: Benefit[] = [
    {
      title: 'Crear y gestionar contenido',
      description:
        'Puedes crear carpetas, subir archivos y organizar el conocimiento en repositorios.',
      icon: 'pi pi-folder-plus',
      color: '#8B5CF6',
    },
    {
      title: 'Participar en decisiones',
      description:
        'Formas parte activa del equipo, participas en discusiones y ayudas a definir el rumbo del repositorio.',
      icon: 'pi pi-comments',
      color: '#8B5CF6',
    },
    {
      title: 'Visibilidad y reconocimiento',
      description:
        'Tu perfil destaca como cocreador y tu contribución es visible para toda la comunidad.',
      icon: 'pi pi-star',
      color: '#8B5CF6',
    },
  ];

  permissions = [
    { action: 'Crear carpetas', icon: 'pi pi-folder', available: true },
    { action: 'Subir archivos', icon: 'pi pi-upload', available: true },
    { action: 'Eliminar contenido propio', icon: 'pi pi-trash', available: true },
    { action: 'Participar en discusiones', icon: 'pi pi-comments', available: true },
  ];

  testimonials: Testimonial[] = [
    {
      name: 'Ana Martínez',
      role: 'Cocreadora',
      avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png',
      message:
        'Ser cocreadora me ha permitido contribuir activamente en proyectos que me apasionan. Es increíble ver cómo el conocimiento que comparto ayuda a otros.',
    },
    {
      name: 'Carlos López',
      role: 'Cocreador',
      avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/asiyajavayant.png',
      message:
        'La libertad de organizar y crear contenido es fantástica. PRX me ha dado las herramientas para colaborar de manera efectiva con mi equipo.',
    },
  ];

  faqs = [
    {
      title: '¿Necesito experiencia previa para ser cocreador?',
      content:
        'No necesitas experiencia previa. Solo necesitas ganas de aprender y contribuir. La comunidad te ayudará en el proceso.',
    },
    {
      title: '¿Cómo se obtiene el rol de Cocreador?',
      content:
        'El rol de Cocreador se obtiene por invitación directa del propietario o los copropietarios de un repositorio, sin ningún costo.',
    },
    {
      title: '¿Puedo ser cocreador en múltiples repositorios?',
      content:
        'Sí, puedes ser cocreador en tantos repositorios como desees, siempre y cuando los propietarios te inviten.',
    },
    {
      title: '¿Qué diferencia hay entre Cocreador y Copropietario?',
      content:
        'Los Copropietarios tienen permisos de administración (pueden gestionar roles), mientras que los Cocreadores se enfocan en crear y editar contenido.',
    },
    {
      title: '¿Qué diferencia hay entre Cocreador y Miembro?',
      content:
        'Ninguna en cuanto a permisos: ambos pueden crear y editar contenido del repositorio. La diferencia está en cómo se obtiene el rol: el Cocreador es invitado de forma gratuita, mientras que el Miembro accede pagando una membresía.',
    },
    {
      title: '¿Puedo dejar de ser cocreador cuando quiera?',
      content:
        'Sí, puedes salir de un repositorio en cualquier momento desde la configuración del repositorio.',
    },
    {
      title: '¿Mis contribuciones son reconocidas?',
      content:
        'Sí, todas tus contribuciones quedan registradas y tu perfil muestra tu actividad como cocreador en los repositorios.',
    },
  ];

  openSocialLink(url: string): void {
    window.open(url, '_blank');
  }
}
