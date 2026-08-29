import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { ScrollTopModule } from 'primeng/scrolltop';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';

interface DocSection {
  title: string;
  icon: string;
  items: DocItem[];
}

interface DocItem {
  title: string;
  description: string;
  link?: string;
}

@Component({
  selector: 'app-docs-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    PanelModule,
    TagModule,
    ChipModule,
    ScrollTopModule,
    AccordionModule,
    TableModule,
  ],
  templateUrl: './docs-page.component.html',
  styleUrls: ['./docs-page.component.scss'],
})
export class DocsPageComponent implements OnInit {
  private readonly router = inject(Router);

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
  docSections: DocSection[] = [
    {
      title: 'Introducción',
      icon: 'pi pi-info-circle',
      items: [
        {
          title: '¿Qué es PRX?',
          description: 'Plataforma colaborativa para compartir conocimiento.',
        },
        {
          title: 'Conceptos básicos',
          description: 'Repositorios, carpetas, archivos y notas.',
        },
        {
          title: 'Roles en la plataforma',
          description: 'Propietario, Copropietario, Cocreador y Miembro.',
        },
      ],
    },
    {
      title: 'Repositorios',
      icon: 'pi pi-folder',
      items: [
        {
          title: 'Crear un repositorio',
          description: 'Guía paso a paso para crear tu primer repositorio.',
        },
        {
          title: 'Configurar visibilidad',
          description: 'Público, Privado - cómo elegir.',
        },
        {
          title: 'Gestionar carpetas',
          description: 'Organizar contenido con carpetas anidadas.',
        },
        {
          title: 'Subir archivos',
          description: 'Tipos de archivo soportados y límites.',
        },
      ],
    },
    {
      title: 'Equipo y Colaboración',
      icon: 'pi pi-users',
      items: [
        {
          title: 'Invitar colaboradores',
          description: 'Cómo invitar a otros usuarios al repositorio.',
        },
        {
          title: 'Gestionar roles',
          description: 'Asignar y cambiar roles de los miembros.',
        },
        {
          title: 'Notas',
          description: 'Documentar el progreso del proyecto.',
        },
      ],
    },
    {
      title: 'API y Desarrollo',
      icon: 'pi pi-code',
      items: [
        {
          title: 'API REST',
          description: 'Endpoints disponibles y autenticación.',
        },
        {
          title: 'Webhooks',
          description: 'Configurar notificaciones automáticas.',
        },
        {
          title: 'SDKs',
          description: 'Librerías oficiales para integrar PRX.',
        },
      ],
    },
  ];
}
