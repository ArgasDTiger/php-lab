import {AfterViewInit, Component, ElementRef, Input, Query, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {IBook} from "../../shared/models/book";
import {CarouselItemComponent} from "./carousel-item/carousel-item.component";
import {NgForOf} from "@angular/common";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

@Component({
  selector: 'app-carousel',
  imports: [
    CarouselItemComponent,
    NgForOf
  ],
  templateUrl: './carousel.component.html',
  standalone: true,
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements AfterViewInit {
  @Input("books") books!: IBook[];

  @ViewChild("prevBtn") prevBtn!: ElementRef;
  @ViewChild("nextBtn") nextBtn!: ElementRef;
  @ViewChild("carouselContainer") carouselContainer!: ElementRef
  @ViewChild("track") track!: ElementRef
  @ViewChildren(CarouselItemComponent) carouselItems!: QueryList<CarouselItemComponent>;

  currentPosition = 0;
  rowWidth!: number;
  cardWidth!: number;
  readonly cardsCount = 12;
  elementsInRow!: number;

  constructor() {
  }

  ngAfterViewInit(): void {
    this.rowWidth = this.carouselContainer.nativeElement.offsetWidth;
    this.carouselItems.changes.subscribe(() => {
      this.carouselItems.first.cardWidthEmitter.subscribe(width => {
        this.onWidthChange(width);
      });
    });
  }

  onWidthChange(width: number) {
    this.cardWidth = width;
    this.elementsInRow = Math.ceil(this.rowWidth / this.cardWidth);
  }

  prevBtnClick(): void {
    if (this.currentPosition > this.cardWidth * this.elementsInRow) {
      this.currentPosition -= this.cardWidth * this.elementsInRow;
      this.track.nativeElement.style.transition = 'transform 0.3s ease';
    } else {
      this.currentPosition = 0;
      this.track.nativeElement.style.transition = 'transform 0.3s ease';
    }
    this.track.nativeElement.style.transform = `translateX(-${this.currentPosition}px)`;
  }

  nextBtnClick(): void {

    if (this.currentPosition + this.cardWidth * this.elementsInRow < this.cardsCount * this.cardWidth) {
      this.currentPosition += this.cardWidth * this.elementsInRow;
      this.track.nativeElement.style.transition = 'transform 0.3s ease';
    }
    console.log(this.currentPosition + this.cardWidth * this.elementsInRow)
    console.log(this.cardsCount)

    this.track.nativeElement.style.transform = `translateX(-${this.currentPosition}px)`;
  }


}
