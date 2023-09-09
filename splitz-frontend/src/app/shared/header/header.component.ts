import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { Initial_State } from 'src/app/modules/user/interfaces/userstate';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  private router = inject(Router);
  authService = inject(AuthService);
  googleAuthService = inject(SocialAuthService);

  onSignOut() {
    localStorage.clear();
    this.authService.state.set(Initial_State);
    this.googleAuthService.signOut();
    this.router.navigate(['signin']);
  }
}
