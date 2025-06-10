import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GroupAddMemberComponent } from './group-add-member.component';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('GroupAddMemberComponent', () => {
  let component: GroupAddMemberComponent;
  let fixture: ComponentFixture<GroupAddMemberComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [GroupAddMemberComponent],
    imports: [RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot()],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    fixture = TestBed.createComponent(GroupAddMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
