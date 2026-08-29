import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { PanelModule } from 'primeng/panel';
import { TimelineModule } from 'primeng/timeline';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { ScrollTopModule } from 'primeng/scrolltop';

interface TimelineEvent {
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface RepositoryFeature {
  title: string;
  description: string;
  icon: string;
  badge?: string;
}

interface CommunityTestimonial {
  name: string;
  role: string;
  avatar: string;
  message: string;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    CarouselModule,
    PanelModule,
    TimelineModule,
    AvatarModule,
    AvatarGroupModule,
    ChipModule,
    TagModule,
    DividerModule,
    TooltipModule,
    ScrollTopModule,
  ],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        setTimeout(() => {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    });
  }

  galleriaImages: any[] = [
    {
      itemImageSrc: 'images/landing-page/colaboration.jpg',
      thumbnailImageSrc: 'images/landing-page/colaboration.jpg',
      alt: 'Colaboración en equipo',
      title: 'Colabora sin límites',
      description: 'Conecta con personas de todo el mundo y construye conocimiento colectivo.',
    },
    {
      itemImageSrc: 'images/landing-page/passion.jpg',
      thumbnailImageSrc: 'images/landing-page/passion.jpg',
      alt: 'Pasión por el conocimiento',
      title: 'Comparte tu pasión',
      description: 'Cada aporte construye un futuro más informado y colaborativo.',
    },
    {
      itemImageSrc: 'images/landing-page/colaboration.jpg',
      thumbnailImageSrc: 'images/landing-page/colaboration.jpg',
      alt: 'Trabajo en equipo',
      title: 'Trabajo en equipo',
      description: 'Los equipos multidisciplinarios generan ideas innovadoras.',
    },
    {
      itemImageSrc: 'images/landing-page/passion.jpg',
      thumbnailImageSrc: 'images/landing-page/passion.jpg',
      alt: 'Comunidad activa',
      title: 'Únete a una comunidad activa',
      description: '+5000 usuarios transformando realidades.',
    },
  ];

  repositoryFeatures: RepositoryFeature[] = [
    {
      title: 'Organización por Carpetas',
      description:
        'Estructura tu conocimiento con carpetas anidadas. Sube archivos y ordénalos como prefieras.',
      icon: 'pi pi-folder',
      badge: 'Multi-nivel',
    },
    {
      title: 'Roles y Permisos',
      description:
        'Propietario, Copropietario, Cocreador y Miembro. Control total sobre quién puede hacer qué.',
      icon: 'pi pi-users',
      badge: '4 roles',
    },
    {
      title: 'Notas Integradas',
      description:
        'Documenta el progreso de tus proyectos directamente desde el repositorio.',
      icon: 'pi pi-book',
      badge: 'Seguimiento',
    },
    {
      title: 'Visibilidad Flexible',
      description: 'Público, Privado o Íntimo. Tú decides quién ve y accede a tu contenido.',
      icon: 'pi pi-lock',
      badge: 'Seguridad',
    },
    {
      title: 'Etiquetas y Categorías',
      description:
        'Clasifica tu contenido para encontrarlo fácilmente. Filtros avanzados y búsqueda inteligente.',
      icon: 'pi pi-tags',
      badge: 'Organización',
    },
    {
      title: 'Archivos Adjuntos',
      description: 'Sube documentos, imágenes y cualquier tipo de archivo. Vista previa integrada.',
      icon: 'pi pi-file',
      badge: 'Multiformato',
    },
  ];

  timelineEvents: TimelineEvent[] = [
    {
      title: 'Crea tu cuenta',
      description: 'Regístrate gratis. Solo necesitas un email.',
      icon: 'pi pi-user-plus',
      color: '#3B82F6',
    },
    {
      title: 'Crea o únete a un repositorio',
      description:
        'Inicia tu propio repositorio o solicita unirte a uno existente. Empieza a colaborar.',
      icon: 'pi pi-folder-open',
      color: '#8B5CF6',
    },
    {
      title: 'Organiza tu contenido',
      description: 'Crea carpetas, sube archivos, escribe notas. Estructura tu conocimiento.',
      icon: 'pi pi-sitemap',
      color: '#EC4899',
    },
    {
      title: 'Invita colaboradores',
      description: 'Invita a otros usuarios. Trabaja en equipo.',
      icon: 'pi pi-user-plus',
      color: '#10B981',
    },
    {
      title: 'Comparte y transforma',
      description: 'Tu conocimiento ahora está organizado y accesible. Genera impacto real.',
      icon: 'pi pi-globe',
      color: '#F59E0B',
    },
  ];

  testimonials: CommunityTestimonial[] = [
    {
      name: 'Ana Martínez',
      role: 'Cocreadora',
      avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png',
      message:
        'PRX transformó la manera en que mi equipo colabora.',
    },
    {
      name: 'Carlos López',
      role: 'Miembro',
      avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/asiyajavayant.png',
      message:
        'Encontré repositorios increíbles sobre filosofía y tecnología. La comunidad es muy activa y siempre dispuesta a ayudar.',
    },
    {
      name: 'Laura Fernández',
      role: 'Copropietaria',
      avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png',
      message:
        'Gestionar un repositorio nunca fue tan fácil. Los roles y permisos nos dan el control que necesitamos.',
    },
  ];

  resourceLinks = [
    {
      label: 'Documentación',
      icon: 'pi pi-file-pdf',
      description: 'Guías técnicas y API reference',
      link: '/docs',
    },
    {
      label: 'Guía de uso',
      icon: 'pi pi-book',
      description: 'Aprende a usar todas las funciones',
      link: '/guide',
    },
    {
      label: 'Preguntas frecuentes',
      icon: 'pi pi-question-circle',
      description: 'Respuestas a dudas comunes',
      link: '/faq',
    },
  ];

  carouselResponsiveOptions = [
    { breakpoint: '1024px', numVisible: 2, numScroll: 1 },
    { breakpoint: '768px', numVisible: 1, numScroll: 1 },
    { breakpoint: '560px', numVisible: 1, numScroll: 1 },
  ];

  openSocialLink(url: string): void {
    window.open(url, '_blank');
  }
}
