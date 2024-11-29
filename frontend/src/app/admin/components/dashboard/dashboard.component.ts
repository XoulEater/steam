import { Component } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Game, Order } from '../../interfaces/dashboard.interfaces';
import { BarChartComponent } from '../bar-chart/bar-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BarChartComponent],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent {
  public orders: Order[] = [];
  public topSales: Game[] = [];
  constructor(
    private dasboardService: DashboardService
  ) {}
  ngOnInit(): void {
    this.dasboardService.getTopSales().subscribe((topSales) => {
      this.topSales = topSales
    });

    this.dasboardService.getOrdersPerDay().subscribe((orders) => {
      console.log(orders)
      this.orders = orders
    });

    this.dasboardService.getNotifications().subscribe((notification) => {
      console.log(notification)
    });
  }
}
