import {Component, Input, OnInit} from '@angular/core';
import {IBook} from "../../shared/models/book";
import {DecimalPipe, NgIf} from "@angular/common";
import {BasketService} from "../../basket/basket.service";
import {RouterLink} from "@angular/router";
import {ModalService} from "../../shared/modal/modal.service";
import {UpdateBookModalComponent} from "../update-book-modal/update-book-modal.component";
import {StoreService} from "../store.service";
import {AccountService} from "../../account/account.service";

@Component({
  selector: 'app-book-item',
  imports: [
    DecimalPipe,
    RouterLink,
    NgIf
  ],
  templateUrl: './book-item.component.html',
  standalone: true,
  styleUrl: './book-item.component.css'
})
export class BookItemComponent implements OnInit {
  @Input() book!: IBook;

  role: string = 'User';


  constructor(private basketService: BasketService, private modalService: ModalService, private storeService: StoreService, private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.role = this.accountService.getRole() || 'User';
  }

  addBookToBasket(book: IBook) {
    this.basketService.addBookToBasket(book);
  }

  openUpdateModal() {
    this.modalService.open(UpdateBookModalComponent, { bookId: this.book.id });
  }

  onDelete() {
    console.log("on delete")
    this.storeService.deleteBook(this.book.id).subscribe( res => {
      console.log(res);
      }
    );
  }
}
