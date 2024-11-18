import { Component, Inject } from '@angular/core';
import { Discount } from '../../../games/interfaces/games.interfaces';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-discount-dialog',
  standalone: true,
  imports: [],
  templateUrl: './discount-dialog.component.html',
  styles: ``,
})
export class DiscountDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DiscountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Discount
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  saveDiscount(): void {
    this.dialogRef.close(this.data);
  }
}
