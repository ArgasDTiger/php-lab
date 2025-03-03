import {Component, OnInit} from '@angular/core';
import {IBook} from "../../shared/models/book";
import {StoreService} from "../store.service";
import {ActivatedRoute} from "@angular/router";
import {BasketService} from "../../basket/basket.service";
import {CurrencyPipe, DatePipe, NgIf, NgOptimizedImage} from "@angular/common";
import {StarRatingComponent} from "../../shared/components/star-rating/star-rating.component";

@Component({
  selector: 'app-book-details',
  imports: [
    NgIf,
    NgOptimizedImage,
    DatePipe,
    StarRatingComponent,
    CurrencyPipe
  ],
  templateUrl: './book-details.component.html',
  standalone: true,
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent implements OnInit {
  book!: IBook;
  authors!: string;
  constructor(private storeService: StoreService,
              private activatedRoute: ActivatedRoute,
              private basketService: BasketService) {
  }

  ngOnInit() {
    this.loadBook();
  }

  loadBook(): void {
    this.storeService.getBook(+this.activatedRoute.snapshot.params['id'])
      .subscribe((book: IBook) => {
        this.book = book;
        if (this.book.authors) {
          this.authors = this.book.authors.join(', ');
        }
      },
        error => {
        console.log(error);
        })
  }

  addBookToBasket() {
    this.basketService.addBookToBasket(this.book);
  }

}
