import { CommonModule } from '@angular/common';
import { Review } from './../../interfaces/games.interfaces';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review.component.html',
  styles: ``,
})
export class ReviewComponent {
  @Input()
  public review!: Review;

  public getRatingIcon(rating: number): string {
    return rating >= 3 ? 'goodReview.png' : 'badReview.png';
  }
}
