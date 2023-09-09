import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignupComponent } from './modules/user/components/signup/signup.component';
import { AuthGuard } from './core/auth.guard';
import { WelcomeComponent } from './modules/user/components/welcome/welcome.component';
import { ProfileComponent } from './modules/user/components/profile/profile.component';
import { SigninComponent } from './modules/user/components/signin/signin.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent, title: 'Sign In' },
  { path: 'signup', component: SignupComponent, title: 'Register' },
  { path: 'profile', component: ProfileComponent, title: 'My Account' },
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
      import('./modules/group/group.module').then((m) => m.GroupModule),
  },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
