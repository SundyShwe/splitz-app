import { Injectable, inject, signal } from '@angular/core';
import { Initial_State, UserState } from '../modules/user/interfaces/userstate';
import { HttpClient } from '@angular/common/http';
import { User } from '../modules/user/interfaces/users';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  state = signal<UserState>(Initial_State);

  private http = inject(HttpClient);

  signin(data: { email: string; password: string }) {
    return this.http.post<{ success: boolean; data: any }>(
      environment.SERVER_URL + 'auth/signin',
      data
    );
  }

  register(data: User) {
    return this.http.post<{ success: boolean; data: any }>(
      environment.SERVER_URL + 'auth/signup',
      data
    );
  }

  googleSignIn(data: User) {
    return this.http.post<{ success: boolean; data: any }>(
      environment.SERVER_URL + 'auth/google',
      data
    );
  }

  constructor() {}
}
