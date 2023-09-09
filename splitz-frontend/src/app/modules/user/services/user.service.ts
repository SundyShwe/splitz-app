import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { environment as env } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  changePassword(new_password: String) {
    console.log('new password', new_password);
    return this.http.post<{ success: boolean; data: any }>(
      env.SERVER_URL +
        'user/' +
        this.authService.state()._id +
        '/changepassword',
      { password: new_password }
    );
  }

  getAllBillsByUser() {
    return this.http.get<{ success: boolean; data: any }>(
      env.SERVER_URL + 'user/' + this.authService.state()._id + '/bills'
    );
  }

  getPaidByUser() {
    return this.http.get<{ success: boolean; data: any }>(
      env.SERVER_URL +
        'user/' +
        this.authService.state()._id +
        '/bills/userpaid'
    );
  }

  getOwedByUser() {
    return this.http.get<{ success: boolean; data: any }>(
      env.SERVER_URL +
        'user/' +
        this.authService.state()._id +
        '/bills/userowed'
    );
  }

  constructor() {}
}
