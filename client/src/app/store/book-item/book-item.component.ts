import {Component, Input, OnInit} from '@angular/core';
import {IBook} from "../../shared/models/book";
import {DecimalPipe} from "@angular/common";
import {BasketService} from "../../basket/basket.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-book-item',
  imports: [
    DecimalPipe,
    RouterLink
  ],
  templateUrl: './book-item.component.html',
  standalone: true,
  styleUrl: './book-item.component.css'
})
export class BookItemComponent {
  @Input() book!: IBook;

  constructor(private basketService: BasketService) {
  }

  addBookToBasket(book: IBook) {
    this.basketService.addBookToBasket(book);
  }
}
