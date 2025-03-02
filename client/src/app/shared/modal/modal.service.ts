import { Injectable } from '@angular/core';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalRef: NgbModalRef | null = null;
  constructor(private modalService: NgbModal) {}

  open(component: any, data?: any): NgbModalRef {
    this.modalRef = this.modalService.open(component, {
      backdrop: 'static',
      keyboard: false
    });    if (data) {
      Object.keys(data).forEach(key => {
        this.modalRef!.componentInstance[key] = data[key];
      });
    }
    return this.modalRef;
  }

  close() {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
  }
}
