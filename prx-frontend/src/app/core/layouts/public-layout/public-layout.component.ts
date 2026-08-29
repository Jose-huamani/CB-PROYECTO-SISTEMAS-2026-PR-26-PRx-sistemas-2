import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppFooterComponent } from '@shared/ui/components/app-footer/app-footer.component';
import { AppHeaderComponent } from '@shared/ui/components/app-header/app-header.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, AppHeaderComponent, AppFooterComponent],
  templateUrl: './public-layout.component.html',
})
export class PublicLayoutComponent {}
