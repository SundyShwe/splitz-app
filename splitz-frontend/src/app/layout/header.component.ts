import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Initial_State } from '../types/interfaces';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-header',
  template: `
    <nav class="navbar navbar-expand-lg navbar-light p-3">
      <div class="container-fluid">
        <a class="navbar-brand" [routerLink]="['']"
          ><span class="h1">SPLITZ</span>
          <small class="text-muted" *ngIf="authService.state().jwt">
            | Welcome {{ authService.state().fullname }}</small
          >
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div
          class=" collapse navbar-collapse"
          id="navbarNavDropdown"
          *ngIf="authService.state().jwt; else singIn"
        >
          <ul class="navbar-nav ms-auto ">
            <li class="nav-item">
              <a
                class="nav-link mx-2"
                aria-current="page"
                routerLink="home"
                [routerLinkActive]="['active']"
                >Home</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link mx-2"
                routerLink="groups"
                [routerLinkActive]="['active']"
                >Groups</a
              >
            </li>

            <li class="nav-item">
              <button class="nav-link mx-2" (click)="onSignOut()">
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <ng-template #singIn>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a
              [routerLink]="['signin']"
              class="nav-link"
              [routerLinkActive]="['active']"
              >Sign In</a
            >
          </li>
          <li class="nav-item">
            <a
              [routerLink]="['signup']"
              class="nav-link"
              [routerLinkActive]="['active']"
              >Sign Up</a
            >
          </li>
        </ul>
      </div>
    </ng-template>
  `,
  styles: [],
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
