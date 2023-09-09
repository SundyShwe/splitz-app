import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { BillAddComponent } from './bill-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('BillAddComponent', () => {
  let component: BillAddComponent;
  let fixture: ComponentFixture<BillAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
      ],
      declarations: [BillAddComponent],
    });
    fixture = TestBed.createComponent(BillAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
