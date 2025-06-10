import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { BillUpdateComponent } from './bill-update.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('BillUpdateComponent', () => {
  let component: BillUpdateComponent;
  let fixture: ComponentFixture<BillUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [BillUpdateComponent],
    imports: [RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot()],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    fixture = TestBed.createComponent(BillUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
