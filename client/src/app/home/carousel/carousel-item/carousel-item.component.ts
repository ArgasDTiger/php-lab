import {AfterViewInit, Component, ElementRef, Input, Output, ViewChild} from '@angular/core';
import {IBook} from "../../../shared/models/book";
import {Subject} from "rxjs";

@Component({
  selector: 'app-carousel-item',
  imports: [],
  templateUrl: './carousel-item.component.html',
  standalone: true,
  styleUrl: './carousel-item.component.css'
})
export class CarouselItemComponent implements AfterViewInit {
  @Input("book") book!: IBook;
  @ViewChild("cardContainer") cardContainer!: ElementRef;
  @Output() cardWidthEmitter = new Subject<number>();

  ngAfterViewInit() {
    const cardWidth = this.cardContainer.nativeElement.offsetWidth;
    this.cardWidthEmitter.next(cardWidth);
  }
}
