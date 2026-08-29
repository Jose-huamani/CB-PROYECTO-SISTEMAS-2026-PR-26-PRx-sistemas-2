import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
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
  selector: 'app-become-member-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    AccordionModule,
    PanelModule,
    AvatarModule,
    ChipModule,
    TagModule,
    DividerModule,
    TooltipModule,
    ScrollTopModule,
  ],
  templateUrl: './become-member-page.component.html',
  styleUrls: ['./become-member-page.component.scss'],
})
export class BecomeMemberPageComponent implements OnInit {
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
      title: 'Mismos permisos que un Cocreador',
      description:
        'Crea carpetas, sube archivos y escribe notas con los mismos permisos que un Cocreador.',
      icon: 'pi pi-folder-plus',
      color: '#EC4899',
    },
  ];

  permissions = [
    { action: 'Crear carpetas', icon: 'pi pi-folder', available: true },
    { action: 'Subir archivos', icon: 'pi pi-upload', available: true },
    { action: 'Escribir notas', icon: 'pi pi-book', available: true },
    { action: 'Eliminar contenido propio', icon: 'pi pi-trash', available: true },
    { action: 'Participar en discusiones', icon: 'pi pi-comments', available: true },
  ];

  testimonials: Testimonial[] = [
    {
      name: 'Juan Pérez',
      role: 'Miembro',
      avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/ionibowcher.png',
      message:
        'Como Miembro tengo los mismos permisos que un Cocreador: subo archivos, escribo notas y participo en las discusiones del repositorio.',
    },
    {
      name: 'Sofía Ramírez',
      role: 'Miembro',
      avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/xuxuefeng.png',
      message:
        'Quería colaborar en un repositorio pero no conocía al equipo. Con la membresía pude entrar y empezar a aportar contenido de inmediato.',
    },
  ];

  faqs = [
    {
      title: '¿Qué diferencia hay entre Miembro y Cocreador?',
      content:
        'Ninguna en cuanto a permisos: ambos pueden crear carpetas, subir archivos, escribir notas y participar en discusiones. La diferencia está en cómo se obtiene el rol: el Cocreador es invitado directamente por el propietario o copropietarios, mientras que el Miembro accede pagando una membresía.',
    },
    {
      title: '¿Qué puede ver alguien que no es Miembro ni Cocreador?',
      content:
        'Cualquier persona que visite un repositorio público puede ver y descargar su contenido, sin necesidad de pagar ni de tener un rol asignado.',
    },
    {
      title: '¿Puedo acceder desde mi celular?',
      content:
        'Sí, PRX es completamente responsive y puedes acceder desde cualquier dispositivo con conexión a internet.',
    },
  ];

  openSocialLink(url: string): void {
    window.open(url, '_blank');
  }
}
