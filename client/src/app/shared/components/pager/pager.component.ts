import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-pager',
  standalone: true,
  imports: [CommonModule, PaginatorModule],
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.css']
})
export class PagerComponent {
  @Input() totalCount: number = 0;
  @Input() pageSize: number = 10;
  @Output() pageChanged = new EventEmitter<number>();

  currentPage = 1;

  onPageChange(event: any) {
    this.currentPage = Math.floor(event.first / event.rows) + 1;
    this.pageChanged.emit(this.currentPage);
  }
}
