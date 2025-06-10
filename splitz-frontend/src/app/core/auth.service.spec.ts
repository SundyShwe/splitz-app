import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

xdescribe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let url = 'http://localhost:3000/';

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [AuthService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should signed in', (done: DoneFn) => {
    let data = { email: 'moon@bin.io', password: 'qazxsw' };
    let ExpectValue = { success: true, data: 'xxxxdfdsf' };
    service.signin(data).subscribe((value) => {
      expect(value).toBe(ExpectValue);
      done();
    });
  });
});
