import { Component, inject } from '@angular/core';
import { GroupsService } from './groups.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { IGroupInfo } from 'src/app/types/interfaces';

@Component({
  selector: 'app-group-create',
  template: `
    <div class="wrapper">
      <div id="formContent">
        <!-- Tabs Titles -->

        <!-- Icon -->
        <div class="fadeIn first p-3">
          <h1><i class="bi bi-people-fill"></i> Add Group</h1>
        </div>

        <!-- Login Form -->
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
            value="💾 Save"
            (click)="onSave()"
          />
          <input
            type="button"
            class="fadeIn fourth"
            value="⏪ Back"
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
          <div *ngIf="category.errors?.['required']">Category is required</div>
        </div>

        <div
          *ngIf="date.invalid && (date.dirty || date.touched)"
          class="alert alert-danger"
        >
          <div *ngIf="date.errors?.['required']">Date is required</div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class GroupCreateComponent {
  private groupsService = inject(GroupsService);
  private router = inject(Router);
  private subscription!: Subscription;
  private notification = inject(ToastrService);

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

  //save group
  onSave() {
    const timestamp = new Date(this.date.value).getTime() + 3600 * 1000 * 24;
    console.log('Group Name : ' + this.name.value);

    const form_data = new FormData();
    form_data.append('name', this.name.value);
    form_data.append('description', this.description.value);
    form_data.append('category', this.category.value);
    form_data.append('date', timestamp + '');

    const group: IGroupInfo = {
      name: this.name.value,
      description: this.description.value,
      category: this.category.value,
      date: timestamp,
    };

    console.log(`before calling servie : ${group}`);

    this.subscription = this.groupsService
      .createGroup(group as IGroupInfo)
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

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
