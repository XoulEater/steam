import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../user/services/user.service';
import { User } from '../../../games/interfaces/games.interfaces';

@Component({
  selector: 'shared-navigation-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation-bar.component.html',
})
export class NavigationBarComponent {
  isDropdownOpen = false;
  public user!: User;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUserById().subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }
}
