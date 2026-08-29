import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { ChipModule } from 'primeng/chip';
import { ScrollTopModule } from 'primeng/scrolltop';
import { StepsModule } from 'primeng/steps';
import { TimelineModule } from 'primeng/timeline';

interface GuideStep {
  title: string;
  description: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-guide-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    PanelModule,
    ChipModule,
    ScrollTopModule,
    StepsModule,
    TimelineModule,
  ],
  templateUrl: './guide-page.component.html',
  styleUrls: ['./guide-page.component.scss'],
})
export class GuidePageComponent implements OnInit {
  private readonly router = inject(Router);

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
  mainSteps: GuideStep[] = [
    {
      title: 'Registro',
      description: 'Crea tu cuenta gratis en PRX. Solo necesitas un email.',
      icon: 'pi pi-user-plus',
      color: '#3B82F6',
    },
    {
      title: 'Explorar',
      description: 'Navega por repositorios públicos y descubre contenido.',
      icon: 'pi pi-search',
      color: '#8B5CF6',
    },
    {
      title: 'Crear o unirse',
      description: 'Crea tu repositorio o solicita unirte a uno existente.',
      icon: 'pi pi-folder-plus',
      color: '#EC4899',
    },
    {
      title: 'Colaborar',
      description: 'Invita miembros, sube archivos y escribe notas.',
      icon: 'pi pi-users',
      color: '#10B981',
    },
    {
      title: 'Compartir',
      description: 'Comparte tu conocimiento y genera impacto.',
      icon: 'pi pi-globe',
      color: '#F59E0B',
    },
  ];

  repositoryGuide = [
    {
      title: 'Crear repositorio',
      steps: [
        'Haz clic en "Crear repositorio" en el menú principal',
        'Completa el nombre, descripción y visibilidad',
        'Selecciona una categoría y etiquetas',
        'Haz clic en "Crear" para finalizar',
      ],
      icon: 'pi pi-folder-plus',
    },
    {
      title: 'Configurar visibilidad',
      steps: [
        'Ve a "Configuración" del repositorio',
        'En "Visibilidad", selecciona Público, Privado',
        'Guarda los cambios',
      ],
      icon: 'pi pi-eye',
    },
    {
      title: 'Gestionar carpetas',
      steps: [
        'Dentro del repositorio, haz clic en "Nueva carpeta"',
        'Escribe el nombre y el color',
        'Puedes crear carpetas anidadas para mejor organización',
      ],
      icon: 'pi pi-folder',
    },
    {
      title: 'Subir archivos',
      steps: [
        'Haz clic en "Subir archivo"',
        'Selecciona el archivo desde tu computadora',
        'Añade etiquetas si lo deseas',
        'El archivo se guardará en la ubicación actual',
      ],
      icon: 'pi pi-upload',
    },
  ];

  teamGuide = [
    {
      title: 'Invitar colaboradores',
      steps: [
        'Ve a la sección "Equipo" del repositorio',
        'Haz clic en "Invitar colaborador"',
        'Ingresa el email del usuario',
        'Selecciona la función que desempeñará',
        'Envía la invitación',
      ],
      icon: 'pi pi-user-plus',
    },
    {
      title: 'Roles disponibles',
      items: [
        { role: 'Propietario', description: 'Control total del repositorio' },
        { role: 'Copropietario', description: 'Puede gestionar todo excepto eliminar' },
        { role: 'Cocreador', description: 'Crea y edita contenido — acceso por invitación' },
        { role: 'Miembro', description: 'Crea y edita contenido — acceso mediante pago' },
      ],
      icon: 'pi pi-users',
    },
    {
      title: 'Gestionar roles',
      steps: [
        'Ve a "Equipo" y busca al usuario',
        'Usa el selector para cambiar su rol',
        'Confirma los cambios',
      ],
      icon: 'pi pi-pencil',
    },
  ];

  binnacleGuide = [
    {
      title: 'Crear nota',
      steps: [
        'Ve a la sección "Notas" del repositorio',
        'Haz clic en "Agregar Nota"',
        'Escribe nombre y contenido',
        'Guarda la entrada',
      ],
      icon: 'pi pi-book',
    },
    {
      title: 'Gestionar notas',
      steps: ['Puedes editar o eliminar tus notas'],
      icon: 'pi pi-pencil',
    },
  ];
}
