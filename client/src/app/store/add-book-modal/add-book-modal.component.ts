import {Component, OnInit} from "@angular/core";
import {ModalComponent} from "../../shared/modal/modal.component";
import {TextInputComponent} from "../../shared/components/text-input/text-input.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DatePipe, NgFor, NgIf} from "@angular/common";
import {IGenre} from "../../shared/models/genre";
import {IAuthorFullName} from "../../shared/models/authorFullName";
import {environment} from "../../../environments/environment.development";
import {StoreService} from "../store.service";
import {ModalService} from "../../shared/modal/modal.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-add-book-modal',
  imports: [
    ModalComponent,
    TextInputComponent,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    DatePipe
  ],
  templateUrl: './add-book-modal.component.html',
  standalone: true,
  styleUrl: './add-book-modal.component.css'
})
export class AddBookModalComponent implements OnInit {
  bookForm!: FormGroup;
  genres: IGenre[] = [];
  authors: IAuthorFullName[] = [];
  loading = false;
  errorMessage = '';
  imageFile: File | null = null;
  imagePreview: string | null = null;
  baseUrl = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
    private modalService: ModalService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.createBookForm();
    this.loadGenres();
    this.loadAuthors();
  }

  createBookForm() {
    this.bookForm = this.fb.group({
      isbn: ['', [Validators.required, Validators.pattern(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/)]],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      pages: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      publishDate: ['', [Validators.required]],
      genreIds: [[], [Validators.required, Validators.minLength(1)]],
      authorIds: [[], [Validators.required, Validators.minLength(1)]]
    });
  }

  loadGenres() {
    this.storeService.getGenres().subscribe({
      next: (genres) => {
        if (genres) {
          this.genres = genres;
        }
      },
      error: (error) => {
        console.error('Error loading genres:', error);
        this.errorMessage = 'Failed to load genres';
      }
    });
  }

  loadAuthors() {
    this.storeService.getAuthors().subscribe({
      next: (authors) => {
        if (authors) {
          this.authors = authors;
        }
      },
      error: (error) => {
        console.error('Error loading authors:', error);
        this.errorMessage = 'Failed to load authors';
      }
    });
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(this.imageFile.type)) {
        this.errorMessage = 'Only JPEG, JPG, and PNG images are allowed';
        this.imageFile = null;
        this.imagePreview = null;
        return;
      }

      if (this.imageFile.size > 20 * 1024 * 1024) {
        this.errorMessage = 'Image size should not exceed 20MB';
        this.imageFile = null;
        this.imagePreview = null;
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.imageFile);
      this.errorMessage = '';
    }
  }

  onSubmit() {
    if (this.bookForm.invalid || !this.imageFile) {
      if (!this.imageFile) {
        this.errorMessage = 'Please upload an image for the book';
      }
      return;
    }

    this.loading = true;

    // Create FormData object to handle file upload and form data together
    const formData = new FormData();

    // Add book form data
    const bookData = this.bookForm.value;

    // Add basic book fields
    formData.append('isbn', bookData.isbn);
    formData.append('title', bookData.title);
    formData.append('description', bookData.description);
    formData.append('pages', bookData.pages);
    formData.append('price', bookData.price);
    formData.append('publishDate', bookData.publishDate);

    // Add the image file
    formData.append('image', this.imageFile, this.imageFile.name);

    // Add genre IDs as JSON array
    formData.append('genreIds', JSON.stringify(bookData.genreIds));

    // Add author IDs as JSON array
    formData.append('authorIds', JSON.stringify(bookData.authorIds));

    // Send the request
    this.storeService.addBook(formData).subscribe({
      next: (response) => {
        this.modalService.close();
        this.router.navigateByUrl(`/store/book/${response.id}`);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error adding book:', error);
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Failed to add book. Please try again.';
        }
      }
    });
  }

  onGenreChange(event: Event, genreId: number) {
    const checkbox = event.target as HTMLInputElement;
    const genreIds = this.bookForm.get('genreIds')?.value as number[] || [];

    if (checkbox.checked) {
      genreIds.push(genreId);
    } else {
      const index = genreIds.indexOf(genreId);
      if (index > -1) {
        genreIds.splice(index, 1);
      }
    }

    this.bookForm.get('genreIds')?.setValue(genreIds);
  }

  onAuthorChange(event: Event, authorId: number) {
    const checkbox = event.target as HTMLInputElement;
    const authorIds = this.bookForm.get('authorIds')?.value as number[] || [];

    if (checkbox.checked) {
      authorIds.push(authorId);
    } else {
      const index = authorIds.indexOf(authorId);
      if (index > -1) {
        authorIds.splice(index, 1);
      }
    }

    this.bookForm.get('authorIds')?.setValue(authorIds);
  }

  isGenreSelected(genreId: number): boolean {
    const genreIds = this.bookForm.get('genreIds')?.value as number[] || [];
    return genreIds.includes(genreId);
  }

  isAuthorSelected(authorId: number): boolean {
    const authorIds = this.bookForm.get('authorIds')?.value as number[] || [];
    return authorIds.includes(authorId);
  }
}
