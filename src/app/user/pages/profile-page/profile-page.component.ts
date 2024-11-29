import { Component } from '@angular/core';
import { OrderCardComponent } from '../../components/order-card/order-card.component';
import { Order, User } from '../../../games/interfaces/games.interfaces';
import { RouterModule } from '@angular/router';
import { OrdersService } from '../../../admin/services/orders.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [OrderCardComponent, CommonModule, RouterModule],
  templateUrl: './profile-page.component.html',
  styles: ``,
})
export class ProfilePageComponent {
  public orders: Order[] = [];
  public user!: User;

  constructor(
    private ordersService: OrdersService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.ordersService.getOrderByUser().subscribe((orders) => {
      this.orders = orders;
    });

    this.userService.getUserById().subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  get countPendingOrders(): number {
    return this.orders.filter((order) => order.status === 'pending').length;
  }

  get countDeliveredOrders(): number {
    return this.orders.filter((order) => order.status === 'delivered').length;
  }

  get countSentOrders(): number {
    return this.orders.filter((order) => order.status === 'sent').length;
  }

  get countInPreparationOrders(): number {
    return this.orders.filter((order) => order.status === 'inPreparation')
      .length;
  }
}
