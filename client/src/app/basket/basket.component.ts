import {Component, OnInit} from '@angular/core';
import {BasketService} from "./basket.service";
import {Observable} from "rxjs";
import {Basket, IBasket, IBasketItem} from "../shared/models/basket";
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf} from "@angular/common";

@Component({
    selector: 'app-basket',
    imports: [
        NgForOf,
        AsyncPipe,
        NgIf,
        CurrencyPipe
    ],
    templateUrl: './basket.component.html',
    styleUrl: './basket.component.css'
})
export class BasketComponent implements OnInit {
  basket$!: Observable<IBasket>;

  constructor(private basketService: BasketService) {
  }

  ngOnInit() {
    this.basket$ = this.basketService.basket$;
  }

  incrementItemQuantity(item: IBasketItem) {
    this.basketService.incrementItemQuantity(item);
  }

  decrementItemQuantity(item: IBasketItem) {
    this.basketService.decrementItemQuantity(item);
  }

  removeItemFromBasket(item: IBasketItem) {
    this.basketService.removeItemFromBasket(item);
  }

  getTotal(basket: Basket): number {
    return basket.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }
}
