import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import jwt_decode from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';

//Google SignIn OAuth
import {
  GoogleLoginProvider,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { AuthService } from 'src/app/core/auth.service';
import { UserState } from '../../interfaces/userstate';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
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
            const decoded_token = jwt_decode(resp.data) as UserState;
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
        const decoded_token = jwt_decode(resp.data) as UserState;
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
