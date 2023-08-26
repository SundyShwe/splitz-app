import { Component, inject } from '@angular/core';
import { GroupsService } from './groups.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { IGroup, IGroupInfo } from 'src/app/types/interfaces';

@Component({
  selector: 'app-add-members',
  template: `
    <div class="wrapper">
      <div id="formContent">
        <!-- Tabs Titles -->

        <!-- Icon -->
        <div class="fadeIn first p-3">
          <h3><i class="bi bi-person-plus"></i> Add Members</h3>
          <span *ngIf="group"> Group : {{ group.name }}</span>
        </div>

        <!-- Login Form -->
        <form [formGroup]="myForm">
          <input
            type="text"
            class="fadeIn second"
            placeholder="full name"
            formControlName="fullname"
          />
          <input
            type="text"
            class="fadeIn second"
            placeholder="email"
            formControlName="email"
          />
        </form>
        <input
          [disabled]="myForm.invalid"
          type="button"
          class="fadeIn fourth"
          value="💾 Save"
          (click)="onSave()"
        />
        <input
          type="button"
          class="fadeIn fourth"
          value="⏪ Back"
          (click)="goToList()"
        />
        <!-- Form Error -->
        <div
          *ngIf="fullname.invalid && (fullname.dirty || fullname.touched)"
          class="alert alert-danger"
        >
          <div *ngIf="fullname.errors?.['required']">Full name is required</div>
        </div>
        <div
          *ngIf="email.invalid && (email.dirty || email.touched)"
          class="alert alert-danger"
        >
          <div *ngIf="email.errors?.['required']">Email is required</div>
          <div *ngIf="email.errors?.['email']">Please enter a proper email</div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class AddMembersComponent {
  private groupsService = inject(GroupsService);
  private router = inject(Router);
  private activeRoute = inject(ActivatedRoute);
  private getSubscription!: Subscription;
  private subscription!: Subscription;
  private notification = inject(ToastrService);

  group_id = '';
  group!: IGroup;

  myForm = inject(FormBuilder).nonNullable.group({
    fullname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });
  get fullname() {
    return this.myForm.get('fullname') as FormControl;
  }
  get email() {
    return this.myForm.get('email') as FormControl;
  }

  ngOnInit() {
    this.group_id = this.activeRoute.snapshot.paramMap.get(
      'group_id'
    ) as string;
    this.getSubscription = this.groupsService
      .getGroupInfo(this.group_id)
      .subscribe((resp) => {
        if (resp.success) {
          this.group = resp.data;
        } else {
          this.notification.error('Cannot retrieved data');
        }
      });
  }

  onSave() {
    const new_member = {
      group_id: this.group_id,
      fullname: this.fullname.value,
      email: this.email.value,
    };

    this.subscription = this.groupsService
      .addMemberToGroup(new_member)
      .subscribe((resp) => {
        if (resp.success) {
          this.notification.success('New member added to ' + this.group.name);
          this.goToList();
        } else {
          this.notification.error(resp.data);
        }
      });
  }
  goToList() {
    this.router.navigate(['', 'groups']);
  }
  ngOnDestory() {
    if (this.getSubscription) this.getSubscription.unsubscribe();
    if (this.subscription) this.subscription.unsubscribe();
  }
}
