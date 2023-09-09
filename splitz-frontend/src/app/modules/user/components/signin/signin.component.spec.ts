import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SigninComponent } from './signin.component';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  SocialAuthServiceConfig,
  GoogleLoginProvider,
  GoogleSigninButtonModule,
} from '@abacritt/angularx-social-login';
import { AuthService } from 'src/app/core/auth.service';

fdescribe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;
  // let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
        GoogleSigninButtonModule,
      ],
      declarations: [SigninComponent],
      providers: [
        AuthService,
        {
          provide: 'SocialAuthServiceConfig',
          useValue: {
            autoLogin: false,
            providers: [
              {
                id: 'sample_ID',
                provider: new GoogleLoginProvider('sample_ID'),
              },
            ],
          } as SocialAuthServiceConfig,
        },
      ],
    });
    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
    //component.ngOnInit();
    fixture.detectChanges();

    // service = TestBed.inject(AuthService);
    // spyOn(service, 'signin');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should form invalid when empty', () => {
    expect(component.myForm.valid).toBeFalsy();
  });

  it('should email be invalid when it is empty', () => {
    let email = component.myForm.controls['email'];
    email.setValue('');
    expect(email.valid).toBeFalsy();
  });

  it('should email be invalid when it is not email format', () => {
    let email = component.myForm.controls['email'];
    email.setValue('test');
    expect(email.valid).toBeFalsy();
  });

  it('should password be valid when it is email format', () => {
    let email = component.myForm.controls['email'];
    email.setValue('test@example.com');
    expect(email.valid).toBeTruthy();
  });

  it('should passord be invalid when it is empty', () => {
    let password = component.myForm.controls['password'];
    password.setValue('');
    expect(password.valid).toBeFalsy();
  });

  it('should passord be invalid when it is less than 6 characters', () => {
    let password = component.myForm.controls['password'];
    password.setValue('abc');
    expect(password.valid).toBeFalsy();
  });

  it('should passord be valid when it is at least 6 characters', () => {
    let password = component.myForm.controls['password'];
    password.setValue('qwerty123');
    expect(password.valid).toBeTruthy();
  });

  // it('email field validity', () => {
  //   let email = component.myForm.controls['email'];

  //   // Email field is required
  //   // email.setValue('');
  //   // expect(email.valid).toBeFalsy();
  //   // Set email to something
  //   email.setValue('test');
  //   expect(email.valid).toBeFalsy();

  //   // Set email to something correct
  //   email.setValue('test@example.com');
  //   expect(email.valid).toBeTruthy();
  // });

  it('password field validity', () => {
    let password = component.myForm.controls['password'];
    // password field is required
    password.setValue('');
    expect(password.valid).toBeFalsy();
    // Set password less than 6 character
    password.setValue('1234');
    expect(password.valid).toBeFalsy();
    // Set password >= 6 character
    password.setValue('123456');
    expect(password.valid).toBeTruthy();
  });

  // it('should allow user to log in', () => {
  //   const formData = {
  //     email: 'moon@bin.io',
  //     password: 'qazxsw',
  //   };
  //   component.myForm.setValue(formData);
  //   component.onSignIn();

  //   expect(service.signin).toHaveBeenCalled();
  // });
});
