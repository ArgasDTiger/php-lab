import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavbarComponent} from "./core/navbar/navbar.component";
import {FooterComponent} from "./core/footer/footer.component";
import {AccountService} from "./account/account.service";
import {BasketService} from "./basket/basket.service";
import {NgxSpinnerComponent} from "ngx-spinner";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, NgxSpinnerComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private accountService: AccountService,
              private basketService: BasketService) {
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    // this.loadBasket();
  }

  loadCurrentUser() {
    const token = localStorage.getItem('token');
    this.accountService.loadCurrentUser(token!)
      .subscribe(() => {
    }, error => {
      console.log(error);
    });
  }

  loadBasket() {
    const basketId = localStorage.getItem('basket_id');
    if (basketId) {
      this.basketService.getBasket(basketId)
        .subscribe(() => {
        }, error => {
          console.log(error);
        });
    }
  }
}
