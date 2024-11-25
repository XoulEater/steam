import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'shared-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styles: ``,
})
export class PaginationComponent {
  @Input() totalItems = 100;
  @Input() itemsPerPage = 10;
  @Output() pageChange = new EventEmitter<number>();

  totalPages!: number;
  currentPage = 1;
  pages: number[] = [];

  ngOnInit() {
    this.totalPages = this.totalItems;
    this.updatePages();
  }

  updatePages() {
    const pageNumbers: number[] = [];

    // Mostrar las primeras 5 páginas o las 5 más cercanas a la página actual
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);

    console.log(start, end);

    // Agregar los números de las páginas visibles
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    // Añadir el último número de página, si no está ya en la lista
    if (this.totalPages > end) {
      if (end + 1 < this.totalPages) {
        pageNumbers.push(-1); // -1 indica el "..." en el template
      }
      pageNumbers.push(this.totalPages);
    }

    this.pages = pageNumbers;
  }

  goToPage(page: number) {
    if (page === -1) return; // Ignorar clics en el "..."
    this.currentPage = page;
    this.pageChange.emit(this.currentPage);
    this.updatePages();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }
}
