import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";
import {NgClass, NgForOf} from "@angular/common";

@Component({
  selector: 'app-dropdown',
  imports: [
    NgbDropdownToggle,
    NgClass,
    NgForOf,
    NgbDropdownMenu,
    NgbDropdown
  ],
  templateUrl: './dropdown.component.html',
  standalone: true,
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent {
  @Input() title!: string;
  @Input() items!: any[];
  @Input() selectedItems!: any[] | string;
  @Input() displayProperty!: string;
  @Output() itemSelected = new EventEmitter<any>();

  onItemSelected(item: any) {
    this.itemSelected.emit(item);
  }

  isActive(item: any) {
    if (Array.isArray(this.selectedItems)) {
      return this.selectedItems.includes(item[this.displayProperty]);
    } else {
      return this.selectedItems === item[this.displayProperty];
    }
  }
}
