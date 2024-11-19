import { Component, Inject } from '@angular/core';
import { Category, Discount } from '../../../games/interfaces/games.interfaces';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TooltipComponent } from '../../../shared/components/tooltip/tooltip.component';
import { GamesService } from '../../../games/services/games.service';

@Component({
  selector: 'app-discount-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TooltipComponent],
  templateUrl: './discount-dialog.component.html',
  styles: ``,
})
export class DiscountDialogComponent {
  constructor(
    public gamesService: GamesService,
    public dialogRef: MatDialogRef<DiscountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Discount
  ) {}

  public isCreateMode = false;
  public hasDiscount = false;
  public categories: Category[] = [];

  closeDialog(): void {
    this.dialogRef.close();
  }

  get newDiscount() {
    return this.discountForm.value as Discount;
  }

  public discountForm = new FormGroup({
    category: new FormControl<Category | null>(null),
    value: new FormControl<number>(0, Validators.required),
    type: new FormControl<string>('fixed', Validators.required),
    until: new FormControl<Date>(new Date(), Validators.required),
  });

  ngOnInit() {
    console.log(this.data);
    this.gamesService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
    if (this.data) {
      this.discountForm.patchValue(this.data);
      this.hasDiscount = this.data.type !== 'none';
    } else {
      this.isCreateMode = true;
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.discountForm.valid) {
      this.dialogRef.close({
        data: this.newDiscount,
        category: this.discountForm.value.category,
      });
    }
  }
  onRemove() {
    this.dialogRef.close({
      data: {
        type: 'none',
      },
    });
  }
}
