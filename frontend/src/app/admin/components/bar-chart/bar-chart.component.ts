import { Component, Input } from '@angular/core';
import { Game } from '../../interfaces/dashboard.interfaces';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  standalone: true,
  styles: ``,
})
export class BarChartComponent {
    @Input() game: Game | null = null;
    
    getSalesPercentage(sales: number): number {
        const maxSales = 50; // Define un máximo para las ventas
        return Math.min((sales / maxSales) * 100, 100); // Limita el ancho al 100%
      }
      ngOnInit(): void {
          console.log(this.game)
        };
}
