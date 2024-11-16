import { Component } from '@angular/core';
import { TooltipComponent } from '../../../shared/components/tooltip/tooltip.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile-settings-page',
  standalone: true,
  imports: [TooltipComponent, RouterModule],
  templateUrl: './profile-settings-page.component.html',
  styles: ``,
})
export class ProfileSettingsPageComponent {
  // TODO: Add properties and methods
  // Consider using mat-forms
}
