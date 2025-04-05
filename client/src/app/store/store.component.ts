import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";
import {StoreService} from "./store.service";
import {IGenre} from "../shared/models/genre";
import {IAuthorFullName} from "../shared/models/authorFullName";
import {ISort} from "../shared/models/sort";
import {IBook} from "../shared/models/book";
import {StoreParams} from "../shared/models/storeParams";
import {BookItemComponent} from "./book-item/book-item.component";
import {PagerComponent} from "../shared/components/pager/pager.component";
import {PagingHeaderComponent} from "../shared/components/paging-header/paging-header.component";
import {DropdownComponent} from "../shared/components/dropdown/dropdown.component";
import {ModalService} from "../shared/modal/modal.service";
import {AddBookModalComponent} from "./add-book-modal/add-book-modal.component";
import {AccountService} from "../account/account.service";

@Component({
  selector: 'app-store',
  imports: [
    NgClass,
    NgIf,
    NgForOf,
    BookItemComponent,
    PagerComponent,
    PagingHeaderComponent,
    DropdownComponent
  ],
  templateUrl: './store.component.html',
  standalone: true,
  styleUrl: './store.component.css'
})
export class StoreComponent implements OnInit {
  @ViewChild("searchInput") searchInput!: ElementRef;

  books!: IBook[];
  genres: IGenre[] = [{id: 0, name: 'All'}];
  authors: IAuthorFullName[] = [{id: 0, fullName: 'All'}];
  sortOptions: ISort[] = [
    { name: 'Name (A-Z)', value: 'titleAsc' },
    { name: 'Prise Ascending', value: 'priceAsc' },
    { name: 'Price Descending', value: 'priceDesc' }
  ];

  selectedGenres: string[] = ['All'];
  selectedAuthors: string[] = ['All'];
  selectedSort: string = 'Name (A-Z)';
  role: string = 'User';

  totalCount = 0;
  storeParams = new StoreParams();

  constructor(private storeService: StoreService, private modalService: ModalService, private accountService: AccountService,) {
  }

  ngOnInit(): void {
      this.getBooks();
      this.getGenres();
      this.getAuthors();
      this.role = this.accountService.getRole() || 'User';
  }

  getBooks() {
    this.storeService.getBooks(this.storeParams)
      .subscribe(response => {
        this.books = response!.data;
        this.storeParams.pageSize = response!.pageSize;
        this.totalCount = response?.count!;
      }, error => {
        console.log(error);
      });

  }

  getGenres() {
    this.storeService.getGenres()
      .subscribe(response => {
        this.genres = [...this.genres, ...response!];
      });
  }

  getAuthors() {
    this.storeService.getAuthors()
      .subscribe(response => {
        console.log("response", response);
        this.authors = [...this.authors, ...response!];
        console.log("this.authors", this.authors);
      });
  }

  onGenreSelected(genre: IGenre) {
    if (genre.name === 'All') {
      this.selectedGenres = ['All'];
      this.storeParams.genreIds = [];
    } else {
      const genreIndex = this.selectedGenres.indexOf(genre.name);
      if (this.selectedGenres.includes('All')) {
        this.selectedGenres = [genre.name];
        this.storeParams.genreIds = [genre.id];
      } else if (genreIndex !== -1) {
        this.selectedGenres.splice(genreIndex, 1);
        this.storeParams.genreIds.splice(genreIndex, 1);
      } else {
        this.selectedGenres.push(genre.name);
        this.storeParams.genreIds.push(genre.id);
      }
    }
    this.storeParams.pageIndex = 1;
    this.getBooks();
  }

  onAuthorSelected(author: IAuthorFullName) {
    if (author.fullName === 'All') {
      this.selectedAuthors = ['All'];
      this.storeParams.authorIds = [];
    } else {
      const authorIndex = this.selectedAuthors.indexOf(author.fullName);
      if (this.selectedAuthors.includes('All')) {
        this.selectedAuthors = [author.fullName];
        this.storeParams.authorIds = [author.id];
      } else if (authorIndex !== -1) {
        this.selectedAuthors.splice(authorIndex, 1);
        this.storeParams.authorIds.splice(authorIndex, 1);
      } else {
        this.selectedAuthors.push(author.fullName);
        this.storeParams.authorIds.push(author.id);
      }
    }
    this.storeParams.pageIndex = 1;
    this.getBooks();
  }

  onSortSelected(sort: ISort) {
    if (this.selectedSort === sort.name)
      return;
    this.selectedSort = sort.name;
    this.storeParams.sort = sort.value;
    this.getBooks();
  }

  onSearch() {
    this.storeParams.search = this.searchInput.nativeElement.value;
    this.storeParams.pageIndex = 1;
    this.getBooks();
  }

  onPageChanged(event: any) {
    console.log("on page changed")
    if (this.storeParams.pageIndex !== event) {
      this.storeParams.pageIndex = event;
      this.getBooks();
    }
  }

  onAddBook() {
    this.modalService.open(AddBookModalComponent);
  }


}
