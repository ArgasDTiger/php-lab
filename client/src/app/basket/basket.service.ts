import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {BehaviorSubject, map} from "rxjs";
import {Basket, IBasket, IBasketItem, IBasketTotals} from "../shared/models/basket";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {IBook} from "../shared/models/book";


@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket>(null!);
  basket$ = this.basketSource.asObservable();

  constructor(private http: HttpClient,
              private router: Router) { }

  getBasket(id: string) {
    return this.http.get<IBasket>(this.baseUrl + 'basket?id=' + id)
      .pipe(
        map((basket: IBasket) => {
          this.basketSource.next(basket);
        })
      );
  }

  setBasket(basket: IBasket) {
    console.log(`basket is `, basket)
    return this.http.post<IBasket>(this.baseUrl + 'basket', basket)
      .subscribe((response: IBasket) => {
        this.basketSource.next(response);
      }, error => {
        console.log(error);
      });
  }

  getCurrentBasketValue() {
    return this.basketSource.value;
  }

  addBookToBasket(book: IBook, quantity = 1) {
    const bookToAdd: IBasketItem = this.mapBookToBasketItem(book, quantity);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, bookToAdd, quantity);
    this.setBasket(basket);
  }


  private mapBookToBasketItem(book: IBook, quantity: number): IBasketItem {
    console.log('Mapping book to basket item:', book);
    return {
      id: book.id,
      isbn: book.isbn,
      title: book.title,
      imageUrl: book.imageUrl,
      quantity,
      price: book.price,
      publisher: book.publisher,
      genres: book.genres,
      authors: book.authors
    };
  }

  private createBasket() {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number) : IBasketItem[] {
    const index = items.findIndex(i => i.id === itemToAdd.id);
    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }

  incrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    basket.items[foundItemIndex].quantity++;
    this.setBasket(basket);
  }

  decrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    if (basket.items[foundItemIndex].quantity > 1) {
      basket.items[foundItemIndex].quantity--;
      this.setBasket(basket);
    }
  }

  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket.items.some(x => x.id === item.id)) {
      basket.items = basket.items.filter(i => i.id !== item.id);
      if (basket.items.length > 0) {
        this.setBasket(basket);
      } else {
        this.deleteBasket(basket);
      }
    }
  }

  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe(() => {
      this.basketSource.next(null!);
      localStorage.removeItem('basket_id');
    }, error => {
      console.log(error);
    });
  }

}
