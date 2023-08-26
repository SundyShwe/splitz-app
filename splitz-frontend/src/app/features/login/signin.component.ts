import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { AuthService } from 'src/app/auth/auth.service';
import jwt_decode from 'jwt-decode';
import { IState } from 'src/app/types/interfaces';
import { ToastrService } from 'ngx-toastr';

//Google SignIn OAuth
import {
  GoogleLoginProvider,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-signin',
  template: `
    <div class="wrapper">
      <div id="formContent">
        <!-- Tabs Titles -->

        <!-- Icon -->
        <div class="fadeIn first p-3">
          <h1><i class="bi bi-door-open"></i> Sign In</h1>
        </div>

        <!-- Login Form -->
        <form [formGroup]="myForm">
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
            class="fadeIn fourth btn btn-info"
            value="Sign In"
            (click)="onSignIn()"
          />
        </form>

        <!-- Form Error -->

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

        <!-- Register Account  -->
        <div id="formFooter">
          <button class="btn btn-info" (click)="goToRegister()">
            Register
          </button>

          <div class="btn btn-info" id="google-button">
            <asl-google-signin-button
              type="icon"
              size="medium"
            ></asl-google-signin-button>
            Log in with Google
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private subScription!: Subscription;
  private notification = inject(ToastrService);

  myForm = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.minLength(6), Validators.required]],
  });

  get email() {
    return this.myForm.get('email') as FormControl;
  }
  get password() {
    return this.myForm.get('password') as FormControl;
  }

  constructor(private googleAuthService: SocialAuthService) {}

  ngOnInit() {
    this.googleAuthService.authState.subscribe((user) => {
      console.log('after gogole', user);

      //save use in our system
      const new_user = {
        fullname: user.name,
        email: user.email,
        password: '',
      };

      this.subScription = this.authService
        .googleSignIn(new_user)
        .subscribe((resp) => {
          if (resp.success) {
            //add token
            const decoded_token = jwt_decode(resp.data) as IState;
            const new_state = { ...decoded_token, jwt: resp.data };

            //set state
            this.authService.state.set(new_state);
            localStorage.setItem('APP_STATE', JSON.stringify(new_state));

            //navigate to home
            this.router.navigate(['home']);
          } else this.notification.error(resp.data);
        });
    });
  }

  onSignIn() {
    const data = { email: this.email.value, password: this.password.value };

    this.subScription = this.authService.signin(data).subscribe((resp) => {
      if (resp.success) {
        //add token
        const decoded_token = jwt_decode(resp.data) as IState;
        const new_state = { ...decoded_token, jwt: resp.data };

        //set state
        this.authService.state.set(new_state);
        localStorage.setItem('APP_STATE', JSON.stringify(new_state));

        //navigate to home
        this.router.navigate(['home']);
      } else this.notification.error(resp.data);
    });
  }

  goToRegister() {
    this.router.navigate(['signup']);
  }

  ngOnDestory() {
    if (this.subScription) this.subScription.unsubscribe();
  }
}
