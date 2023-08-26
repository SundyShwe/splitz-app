import { Component, inject } from '@angular/core';
import { GroupsService } from './groups.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { IGroup, IGroupInfo } from 'src/app/types/interfaces';

@Component({
  selector: 'app-group-update',
  template: `
    <div class="wrapper mb-5">
      <div id="formContentLeft">
        <!-- Tabs Titles -->

        <!-- Icon -->
        <div class="fadeIn first p-3 text-center">
          <h1><i class="bi bi-people-fill"></i> Group Detials</h1>
        </div>

        <!--Form -->
        <div class="text-center">
          <form [formGroup]="myForm">
            <input type="text" placeholder="Name" formControlName="name" />
            <input
              type="text"
              placeholder="Description"
              formControlName="description"
            />

            <select formControlName="category">
              <option value="" disabled selected hidden>Category</option>
              <option value="Trip">Trip</option>
              <option value="Activity">Activity</option>
              <option value="Event">Event</option>
              <option value="Housing">Housing</option>
              <option value="Utilities">Utilities</option>
            </select>

            <input type="date" placeholder="Date" formControlName="date" />

            <input
              [disabled]="myForm.invalid"
              type="button"
              class="fadeIn fourth"
              value="💾 Update Info"
              (click)="onSave()"
            />

            <input
              type="button"
              class="fadeIn"
              value="⏪ Back to List"
              (click)="goToList()"
            />
          </form>

          <!-- Form Error -->
          <div
            *ngIf="name.invalid && (name.dirty || name.touched)"
            class="alert alert-danger"
          >
            <div *ngIf="name.errors?.['required']">Group Name is required</div>
          </div>
          <div
            *ngIf="category.invalid && (category.dirty || category.touched)"
            class="alert alert-danger"
          >
            <div *ngIf="category.errors?.['required']">
              Category is required
            </div>
          </div>
          <div
            *ngIf="date.invalid && (date.dirty || date.touched)"
            class="alert alert-danger"
          >
            <div *ngIf="date.errors?.['required']">Date is required</div>
          </div>
        </div>
        <h3 class="mb3 text-center">
          <i class="bi bi-people-fill"></i> Members
          <button (click)="addMember(group_id)" class="btn btn-info">
            ➕ Add Member
          </button>
        </h3>
        <div
          class="container text-left mb-3 mt-3"
          *ngIf="group && group.members"
        >
          <ul class="list-group">
            <li class="list-group-item" *ngFor="let member of group.members">
              <span class="text-left">{{ member.fullname }}</span>
              <a
                class="delete-icon"
                rel="Remove Member"
                (click)="removeMember(member.user_id)"
                >❌</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [
    '.delete-icon { cursor: pointer; float: right; text-decoration: none}',
  ],
})
export class GroupUpdateComponent {
  private groupsService = inject(GroupsService);
  private router = inject(Router);
  private activeRoute = inject(ActivatedRoute);
  private subscription!: Subscription;
  private removeSubscription!: Subscription;
  private notification = inject(ToastrService);
  group_id = '';
  group!: IGroup;

  //Form
  myForm = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required]],
    description: [''],
    category: ['', [Validators.required]],
    date: ['', [Validators.required]],
  });
  get name() {
    return this.myForm.get('name') as FormControl;
  }
  get description() {
    return this.myForm.get('description') as FormControl;
  }
  get category() {
    return this.myForm.get('category') as FormControl;
  }
  get date() {
    return this.myForm.get('date') as FormControl;
  }

  ngOnInit() {
    this.group_id = this.activeRoute.snapshot.paramMap.get(
      'group_id'
    ) as string;
    this.subscription = this.groupsService
      .getGroupInfo(this.group_id)
      .subscribe((resp) => {
        if (resp.success) {
          this.group = resp.data;
          //set form value
          this.myForm.get('name')?.setValue(this.group.name);
          this.myForm.get('description')?.setValue(this.group.description);
          this.myForm.get('category')?.setValue(this.group.category);
          this.myForm
            .get('date')
            ?.setValue(new Date(this.group.date).toISOString().substr(0, 10));
        } else {
          this.notification.error('Cannot retrieved data');
        }
      });

    //set form value
  }

  //save group
  onSave() {
    const timestamp = new Date(this.date.value).getTime() + 3600 * 1000 * 24;

    const form_data = new FormData();
    form_data.append('name', this.name.value);
    form_data.append('description', this.description.value);
    form_data.append('category', this.category.value);
    form_data.append('date', timestamp + '');

    const data = {
      group_id: this.group_id,
      group: {
        name: this.name.value,
        description: this.description.value,
        category: this.category.value,
        date: timestamp,
      },
    };

    this.subscription = this.groupsService
      .updateGroup(data)
      .subscribe((resp) => {
        if (resp.success) {
          this.notification.success('New Group Added!');
          this.goToList();
        } else {
          this.notification.error(resp.data);
        }
      });
  }

  goToList() {
    this.router.navigate(['', 'groups']);
  }

  addMember(group_id: string) {
    this.router.navigate(['', 'groups', group_id, 'members']);
  }
  viewBills(group_id: string) {
    this.router.navigate(['', 'groups', group_id, 'bills']);
  }
  removeMember(member_id: string) {
    const data = { group_id: this.group_id, member_id: member_id };
    this.removeSubscription = this.groupsService
      .removeMember(data)
      .subscribe((resp) => {
        if (resp.success) {
          this.notification.success('Member removed from the group');

          this.group.members = this.group.members.filter(
            (m) => m.user_id !== member_id
          );
        } else {
          this.notification.error('Cannot retrieved data');
        }
      });
  }
  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.removeSubscription) this.removeSubscription.unsubscribe();
  }
}
