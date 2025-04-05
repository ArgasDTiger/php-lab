import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { TextInputComponent } from '../../../shared/components/text-input/text-input.component';
import { AccountService } from '../../../account/account.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {NgForOf, NgIf} from "@angular/common";
import { ModalService } from "../../../shared/modal/modal.service";

@Component({
  selector: 'app-register-modal',
  imports: [
    FormsModule,
    ModalComponent,
    ReactiveFormsModule,
    TextInputComponent,
    NgIf,
    NgForOf,
  ],
  templateUrl: './register-modal.component.html',
  standalone: true,
  styleUrls: ['./register-modal.component.css']
})
export class RegisterModalComponent implements OnInit {
  registerForm!: FormGroup;
  languages: any[] = [];

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private modalService: ModalService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.createRegisterForm();
    this.loadLanguages();
  }

  loadLanguages() {
    this.http.get<any[]>('/assets/languages.json').subscribe(
      (data) => { this.languages = data; },
      (error) => { console.error('Error loading languages:', error); }
    );
  }


  passwordMatchValidator: ValidatorFn = (control: AbstractControl): { [key: string]: boolean } | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword!.setErrors(null);
    }

    return null;
  };

  createRegisterForm() {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[_#?!@$%^&*-]).{8,}$/)]],
        confirmPassword: ['', [Validators.required]],
        language: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.accountService.checkEmailExists(this.registerForm.get('email')?.value).subscribe({
      next: (emailExists) => {
        if (emailExists) {
          this.registerForm.get('email')?.setErrors({ emailExists: true });
        } else {
          this.performRegistration();
        }
      },
      error: (error) => {
        console.log(error);
        this.registerForm.setErrors({ apiError: true });
      }
    });
  }

  performRegistration() {
    this.accountService.register(this.registerForm.value).subscribe({
      next: () => {
        this.modalService.close();
        this.router.navigateByUrl('/store');
      },
      error: (error) => {
        console.log(error);
        this.registerForm.setErrors({ apiError: true });
      }
    });
  }
}
