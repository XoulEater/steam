import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Review } from '../../interfaces/games.interfaces';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-review-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-section.component.html',
  styles: ``,
})
export class ReviewSectionComponent {
  @Input()
  public reviews!: Review[];
  public newComment: string = '';
  public rating: number = 0;

  get validComment(): boolean {
    return this.newComment.trim() !== '' && this.rating > 0;
  }

  @Output()
  newReview = new EventEmitter<Review>();

  public updateRating(rating: number) {
    this.rating = rating;
  }

  // id: number;
  // name: string;
  // comment: string;
  // rating: number;
  // date: string;
  public addComment() {
    if (!this.validComment) return;

    const newReview: Review = {
      id: this.reviews.length + 1,
      name: 'Whiit', // FIXME: Cambiar por el nombre del usuario
      comment: this.newComment,
      rating: this.rating,
      date: new Date().toISOString(),
    };

    this.newComment = '';
    this.rating = 0;
    this.newReview.emit(newReview);
  }

  public rate(rating: number) {
    this.rating = rating;
  }
}
