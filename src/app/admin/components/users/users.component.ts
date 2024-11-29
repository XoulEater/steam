import { Component } from '@angular/core';
import { User } from '../../../games/interfaces/games.interfaces';
import { UserService } from '../../../user/services/user.service';
import { AdminUserCardComponent } from '../admin-user-card/admin-user-card.component';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [AdminUserCardComponent],
  templateUrl: './users.component.html',
  styles: ``,
})
export class UsersComponent {
  public users: User[] = [];

  constructor(private userService: UserService, private dialog: MatDialog) {}

  ngOnInit() {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

  onAddUser() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '700px',
      height: '350px',
      data: { user: null },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.createUser(result).subscribe((newUser) => {
          this.users.push(newUser);
        });
      }
    });
  }
}
