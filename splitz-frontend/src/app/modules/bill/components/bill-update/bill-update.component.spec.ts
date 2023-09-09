import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { BillUpdateComponent } from './bill-update.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('BillUpdateComponent', () => {
  let component: BillUpdateComponent;
  let fixture: ComponentFixture<BillUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
      ],
      declarations: [BillUpdateComponent],
    });
    fixture = TestBed.createComponent(BillUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
