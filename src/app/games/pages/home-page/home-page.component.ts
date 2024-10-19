import { Component } from '@angular/core';
import { CarouselComponent } from '../../component/carousel/carousel.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CarouselComponent],
  templateUrl: './home-page.component.html',
  styles: ``,
})
export class HomePageComponent {}
