import { CommonModule } from '@angular/common';
import { Review } from './../../interfaces/games.interfaces';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rating-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating-bar.component.html',
  styles: ``,
})
export class RatingBarComponent {
  @Input() reviews!: Review[];

  // Método para obtener el porcentaje de opiniones positivas
  get positiveRatio(): number {
    const positive = this.reviews.filter((review) => review.rating >= 3).length;
    const total = this.reviews.length;
    return Math.floor((positive / total) * 100);
  }
}
