import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-tooltip',
  standalone: true,
  imports: [],
  templateUrl: './tooltip.component.html',
  styles: ``,
})
export class TooltipComponent {
  @Input() for: string = '';
  @Input() text: string = '';
}
