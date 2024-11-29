import { Component, OnInit } from '@angular/core';
import { TooltipComponent } from '../../../shared/components/tooltip/tooltip.component';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../../games/interfaces/games.interfaces';
import { UserService } from '../../services/user.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-profile-settings-page',
  standalone: true,
  imports: [TooltipComponent, RouterModule, ReactiveFormsModule],
  templateUrl: './profile-settings-page.component.html',
  styles: ``,
})
export class ProfileSettingsPageComponent implements OnInit {
  public user!: User;
  public profileForm!: FormGroup;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      bio: [''],
      newPassword: ['', Validators.minLength(8)],
      confirmPassword: ['', Validators.minLength(8)],
    });

    this.userService.getUserById().subscribe((user) => {
      if (user) {
        this.user = user;
        this.profileForm.patchValue({
          name: user.username,
          email: user.email,
          bio: user.bio,
        });
      }
    });
  }

  onSave() {
    if (this.profileForm.valid) {
      const newUser = this.newUser;
      if (newUser) {
        this.userService.updateUser(newUser).subscribe(() => {
          alert('Profile updated successfully');
          // redirect to profile page

          this.router.navigate(['/profile']);
        });
        console.log(newUser);
      }
    } else {
      alert('Please fill in the required fields');
    }
  }

  get newUser(): User | undefined {
    if (this.profileForm.value.newPassword) {
      if (
        this.profileForm.value.newPassword !==
        this.profileForm.value.confirmPassword
      ) {
        alert('Passwords do not match');
        return;
      }
      this.user.password = this.profileForm.value.newPassword;
    }
    return {
      ...this.user,
      username: this.profileForm.value.name,
      email: this.profileForm.value.email,
      bio: this.profileForm.value.bio,
    };
  }

  onDeleteAccount() {
    if (
      confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      this.userService.deleteUser(this.user._id).subscribe(() => {
        // Handle account deletion
      });
    }
  }
}
