import { UserService } from './../../../user/services/user.service';
import { Component, Input } from '@angular/core';
import { User } from '../../../games/interfaces/games.interfaces';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-admin-user-card',
  standalone: true,
  imports: [],
  templateUrl: './admin-user-card.component.html',
  styles: ``,
})
export class AdminUserCardComponent {
  @Input()
  public user!: User;

  constructor(private userService: UserService, private dialog: MatDialog) {}

  onDeleteUser() {
    this.userService.deleteUser(this.user._id).subscribe(() => {
      // delete user
    });
  }

  onEditUser() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '700px',
      height: '350px',
      data: { user: this.user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.updateUser(result).subscribe((updatedUser) => {
          Object.assign(this.user, updatedUser);
        });
      }
    });
  }
}
