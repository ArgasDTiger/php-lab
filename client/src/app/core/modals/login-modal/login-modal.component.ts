import {Component, OnInit} from '@angular/core';
import {ModalComponent} from "../../../shared/modal/modal.component";
import {TextInputComponent} from "../../../shared/components/text-input/text-input.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {AccountService} from "../../../account/account.service";
import {Router} from "@angular/router";
import {ModalService} from "../../../shared/modal/modal.service";

@Component({
  selector: 'app-login-modal',
  imports: [
    ModalComponent,
    TextInputComponent,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './login-modal.component.html',
  standalone: true,
  styleUrl: './login-modal.component.css'
})
export class LoginModalComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private modalService: ModalService) {}

  ngOnInit(): void {
    this.createLoginForm();
  }
  createLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[_#?!@$%^&*-]).{8,}$/)
      ]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.accountService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.modalService.close();
        this.router.navigateByUrl('/store');
      },
      error: (error) => {
        if (error.error && error.error.message === "Invalid email and/or password") {
          this.loginForm.setErrors({ wrongCredentials: true });
        } else if (error.error && error.error.message === "User doesn't exist") {
          this.loginForm.setErrors({ noUser: true });
        } else {
          console.log(error);
          this.loginForm.setErrors({ apiError: true });
        }
      },
    });
  }
}
