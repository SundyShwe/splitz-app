import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { User } from '../../interfaces/users';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
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
    const new_user = this.myForm.value as User;

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
