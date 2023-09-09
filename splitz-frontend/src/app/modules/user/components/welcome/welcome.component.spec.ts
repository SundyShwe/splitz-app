import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { WelcomeComponent } from './welcome.component';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WelcomeComponent],
      providers: [
        {
          provide: 'SocialAuthServiceConfig',
          useValue: {} as SocialAuthServiceConfig,
        },
      ],
    });
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
