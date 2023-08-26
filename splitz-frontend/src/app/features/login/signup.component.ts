import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { IUser } from 'src/app/types/interfaces';

@Component({
  selector: 'app-signup',
  template: `
    <div class="wrapper">
      <div id="formContent">
        <!-- Tabs Titles -->

        <!-- Icon -->
        <div class="fadeIn first p-3">
          <h1><i class="bi bi-person-lock"></i> Register</h1>
        </div>

        <!-- Login Form -->
        <form [formGroup]="myForm">
          <input
            type="text"
            class="fadeIn second"
            placeholder="full name"
            formControlName="fullname"
          />
          <input
            type="text"
            class="fadeIn second"
            placeholder="email"
            formControlName="email"
          />
          <input
            type="password"
            class="fadeIn third"
            placeholder="password"
            formControlName="password"
          />
          <input
            [disabled]="myForm.invalid"
            type="button"
            class="fadeIn fourth"
            value="Register"
            (click)="onRegister()"
          />
        </form>

        <!-- Form Error -->
        <div
          *ngIf="fullname.invalid && (fullname.dirty || fullname.touched)"
          class="alert alert-danger"
        >
          <div *ngIf="fullname.errors?.['required']">Full name is required</div>
        </div>
        <div
          *ngIf="email.invalid && (email.dirty || email.touched)"
          class="alert alert-danger"
        >
          <div *ngIf="email.errors?.['required']">Email is required</div>
          <div *ngIf="email.errors?.['email']">Please enter a proper email</div>
        </div>
        <div
          *ngIf="password.invalid && (password.dirty || password.touched)"
          class="alert alert-danger"
        >
          <div *ngIf="password.errors?.['required']">Password is required</div>
          <div *ngIf="password.errors?.['minlength']">
            Password must be at least 6 characters
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./signin.component.css'],
})
export class SignupComponent {
  private authSerive = inject(AuthService);
  private notification = inject(ToastrService);
  private router = inject(Router);
  private subscription!: Subscription;

  myForm = inject(FormBuilder).nonNullable.group({
    fullname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  get fullname() {
    return this.myForm.get('fullname') as FormControl;
  }
  get email() {
    return this.myForm.get('email') as FormControl;
  }
  get password() {
    return this.myForm.get('password') as FormControl;
  }
  onRegister() {
    const new_user = this.myForm.value as IUser;

    this.subscription = this.authSerive.register(new_user).subscribe((resp) => {
      if (resp.success) {
        this.notification.success(
          'Successfully Registered. Please sign in to use the system'
        );
        this.router.navigate(['signin']);
      } else {
        this.notification.error(resp.data);
      }
    });
  }
  ngOnDestory() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
