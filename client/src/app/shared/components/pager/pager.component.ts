import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from "@angular/common";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'app-pager',
  imports: [
    NgIf,
    NgbPagination
  ],
  templateUrl: './pager.component.html',
  standalone: true,
  styleUrl: './pager.component.css'
})
export class PagerComponent {
  @Input() totalCount!: number;
  @Input() pageSize!: number;
  @Output() pageChanged = new EventEmitter<number>();
  currentPage = 1;

  onPagerChange(page: number) {
    this.pageChanged.emit(page);
  }
}
