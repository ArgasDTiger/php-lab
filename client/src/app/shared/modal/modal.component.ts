import {Component, Input} from '@angular/core';
import {ModalService} from "./modal.service";

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  standalone: true,
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() modalName!: string;
  constructor(private modalService: ModalService) {}

  close() {
    this.modalService.close();
  }
}
