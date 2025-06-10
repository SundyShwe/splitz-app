import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { GroupReportComponent } from './group-report.component';
import { ToastrModule } from 'ngx-toastr';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('GroupReportComponent', () => {
  let component: GroupReportComponent;
  let fixture: ComponentFixture<GroupReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [GroupReportComponent],
    imports: [RouterTestingModule,
        ToastrModule.forRoot()],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    fixture = TestBed.createComponent(GroupReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
