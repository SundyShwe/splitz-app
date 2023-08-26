import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header.component';
import { FooterComponent } from './layout/footer.component';
import { WelcomeComponent } from './layout/welcome.component';
import { SigninComponent } from './features/login/signin.component';
import { SignupComponent } from './features/login/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { AuthInterceptor } from './auth/auth.interceptor';

const bootstrap = function (
  authservice: AuthService,
  googleAuthService: SocialAuthService
) {
  return () => {
    const state = localStorage.getItem('APP_STATE');
    if (state) {
      authservice.state.set(JSON.parse(state));
      //googleAuthService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
      //googleAuthService.refreshAccessToken(GoogleLoginProvider.PROVIDER_ID);
    }
  };
};

//Google oAuth
import {
  GoogleLoginProvider,
  GoogleSigninButtonDirective,
  GoogleSigninButtonModule,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SigninComponent,
    SignupComponent,
    WelcomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
    NgChartsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
    RouterModule.forRoot([
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'signin', component: SigninComponent, title: 'Sign In' },
      { path: 'signup', component: SignupComponent, title: 'Register' },
      {
        path: 'home',
        canActivate: [AuthGuard],
        component: WelcomeComponent,
        title: 'Welcome to Splitz',
      },
      {
        path: 'groups',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./features/groups/groups.module').then((m) => m.GroupsModule),
      },
    ]),
  ],
  providers: [
    provideHttpClient(withInterceptors([AuthInterceptor])),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: bootstrap,
      deps: [AuthService, SocialAuthService],
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '260118741812-nrbrb912ff4t678voqrj5ion6dkv438b.apps.googleusercontent.com'
            ),
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
