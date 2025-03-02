import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-paging-header',
    imports: [
        NgIf
    ],
    templateUrl: './paging-header.component.html',
    styleUrl: './paging-header.component.css'
})
export class PagingHeaderComponent {
  @Input() pageNumber!: number;
  @Input() pageSize!: number;
  @Input() totalCount!: number;
}
