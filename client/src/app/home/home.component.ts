import {Component, OnInit} from '@angular/core';
import {CarouselComponent} from "./carousel/carousel.component";
import {HomeService} from "./home.service";
import {IBook} from "../shared/models/book";

@Component({
    selector: 'app-home',
    imports: [
        CarouselComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  books!: IBook[];
  constructor(private homeService: HomeService) {
  }

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks(): void {
    this.homeService.getBooks()
      .subscribe(response => {
        this.books = response!.data;
      });
  }


}
