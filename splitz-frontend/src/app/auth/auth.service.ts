import { Injectable, inject, signal } from '@angular/core';
import { IState, IUser, Initial_State } from '../types/interfaces';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../environment/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  state = signal<IState>(Initial_State);

  private http = inject(HttpClient);

  signin(data: { email: string; password: string }) {
    return this.http.post<{ success: boolean; data: any }>(
      env.SERVER_URL + 'auth/signin',
      data
    );
  }

  register(data: IUser) {
    return this.http.post<{ success: boolean; data: any }>(
      env.SERVER_URL + 'auth/signup',
      data
    );
  }

  googleSignIn(data: IUser) {
    return this.http.post<{ success: boolean; data: any }>(
      env.SERVER_URL + 'auth/google',
      data
    );
  }

  constructor() {}
}
