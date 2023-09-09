import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GroupReportComponent } from './group-report.component';
import { ToastrModule } from 'ngx-toastr';

describe('GroupReportComponent', () => {
  let component: GroupReportComponent;
  let fixture: ComponentFixture<GroupReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
      declarations: [GroupReportComponent],
    });
    fixture = TestBed.createComponent(GroupReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
