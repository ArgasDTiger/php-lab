import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {NgbCollapse, NgbDropdown, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";
import {ModalService} from "../../shared/modal/modal.service";
import {LoginModalComponent} from "../modals/login-modal/login-modal.component";
import {RegisterModalComponent} from "../modals/register-modal/register-modal.component";
import {Observable} from "rxjs";
import {IUser} from "../../shared/models/user";
import {AccountService} from "../../account/account.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {BasketService} from "../../basket/basket.service";
import {IBasket} from "../../shared/models/basket";

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgbCollapse,
    NgbDropdownMenu,
    NgbDropdown,
    NgbDropdownToggle,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isCollapsed = true;
  currentUser$!: Observable<IUser>;
  basket$!: Observable<IBasket>;
  constructor(private modalService: ModalService,
              private accountService: AccountService,
              private basketService: BasketService) {}

  ngOnInit(): void {
    this.currentUser$ = this.accountService.currentUser$;
    this.basket$ = this.basketService.basket$;
  }

  openLoginModal() {
    this.modalService.open(LoginModalComponent);
  }

  openRegisterModal() {
    this.modalService.open(RegisterModalComponent);
  }

  onLogout() {
    this.accountService.logout()
  }

}
