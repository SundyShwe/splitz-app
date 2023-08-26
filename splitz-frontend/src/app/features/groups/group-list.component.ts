import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GroupsService } from './groups.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { IGroup } from 'src/app/types/interfaces';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-group-list',
  template: `
    <h1>
      My Groups
      <button (click)="onCreateGroup()" type="button" class="btn btn-info">
        👨‍👦‍👦 Create Group
      </button>
    </h1>
    <div>
      <div
        class="p-2 border border-warning mb-3 alert alert-secondary"
        *ngIf="myGroups.length > 0"
      >
        <form [formGroup]="filterForm">
          <div class="row align-items-center p-1">
            <div class="col">
              <label class="sr-only">Name</label>
              <div class="input-group ">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Group Name"
                  formControlName="searchKey"
                />
              </div>
            </div>
            <div class="col">
              <label class="sr-only">Category</label>
              <select
                class="form-control form-select"
                formControlName="category"
              >
                <option value="" selected>Select..</option>
                <option value="Trip">Trip</option>
                <option value="Activity">Activity</option>
                <option value="Event">Event</option>
                <option value="Housing">Housing</option>
                <option value="Utilities">Utilities</option>
              </select>
            </div>
            <div class="col">
              <label class="sr-only">Date : From</label>
              <div class="input-group ">
                <input
                  type="date"
                  class="form-control"
                  formControlName="fromDate"
                />
              </div>
            </div>
            <div class="col">
              <label class="sr-only" for="inlineFormInputGroup">To</label>
              <div class="input-group ">
                <input
                  type="date"
                  class="form-control"
                  formControlName="toDate"
                />
              </div>
            </div>
            <div class="col">
              <button class="btn btn-info mt-3" (click)="onFilter()">
                🔎 Search
              </button>
              <button class="btn btn-info mt-3" (click)="onClear()">
                ✨ Clear
              </button>
            </div>
          </div>
        </form>
        <div class="row p-1" *ngIf="serachError.length > 0">
          <p class="text-danger" *ngFor="let err of serachError">
            <em>* {{ err }}.</em>
          </p>
        </div>
      </div>
      <div
        class="table-responsive"
        *ngIf="filteredGroups.length > 0; else noGroup"
      >
        <table class="table table-striped">
          <thead class="thead-dark">
            <tr class="table-warning">
              <th scope="col">Name</th>
              <th scope="col">Category</th>
              <th scope="col">Members</th>
              <th scope="col">Date</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tr *ngFor="let g of filteredGroups">
            <td>{{ g.name }}</td>
            <td>{{ g.category }}</td>
            <td class="text-align-center">
              {{ g.members.length }}
            </td>
            <td>{{ g.date | date }}</td>
            <td>
              <button (click)="addMember(g._id)" class="btn btn-info">
                ➕ Add Member
              </button>
              <button (click)="addBill(g._id)" class="btn btn-info">
                📜 Add A Bill
              </button>
              <button (click)="viewBills(g._id)" class="btn btn-info">
                💲 View All Bills
              </button>

              <button
                (click)="goToReport(g._id)"
                type="button"
                class="btn btn-info"
              >
                📊 Report
              </button>
              <button (click)="viewDetails(g._id)" class="btn btn-info">
                ⚙ View Details
              </button>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <ng-template #noGroup>
      <table class="table table-striped">
        <thead class="thead-dark">
          <tr class="table-warning">
            <th scope="col">Name</th>
            <th scope="col">Category</th>
            <th scope="col">Members</th>
            <th scope="col">Date</th>
            <th scope="col">Action</th>
          </tr>
          <tr>
            <td colspan="7">
              No Groups Found.
              <button
                (click)="onCreateGroup()"
                type="button"
                class="btn btn-info"
                *ngIf="myGroups.length < 0"
              >
                Create New Group
              </button>
            </td>
          </tr>
        </thead>
      </table>
    </ng-template>
  `,
  styles: [],
})
export class GroupListComponent {
  private router = inject(Router);
  private groupsService = inject(GroupsService);
  private subscription!: Subscription;
  private notification = inject(ToastrService);

  myGroups: IGroup[] = [];
  filteredGroups: IGroup[] = [];

  ngOnInit() {
    this.subscription = this.groupsService.getAllGroups().subscribe((resp) => {
      if (resp.success) {
        this.myGroups = resp.data;
        let members = [...this.myGroups];
        members.forEach((element) => {
          element.member_names = element.members.map((obj) => obj.fullname);
        });

        this.filteredGroups = [...this.myGroups];
      }
    });
  }

  serachError: string[] = [];
  filterForm = inject(FormBuilder).nonNullable.group({
    searchKey: '',
    category: '',
    fromDate: '',
    toDate: '',
  });
  get searchKey() {
    return this.filterForm.get('searchKey') as FormControl;
  }
  get category() {
    return this.filterForm.get('category') as FormControl;
  }
  get fromDate() {
    return this.filterForm.get('fromDate') as FormControl;
  }
  get toDate() {
    return this.filterForm.get('toDate') as FormControl;
  }
  isFormEmpty(formData: any) {
    return Object.values(formData).every((x) => x === null || x === '');
  }

  onFilter() {
    let result = [...this.myGroups];

    if (this.isFormEmpty(this.filterForm.value)) {
      this.serachError.push('Please enter at least one Filter Criteria');
    } else {
      this.serachError = [];
      //search for name

      if (this.searchKey.value != '') {
        result = result.filter((g) =>
          g.name.toLowerCase().match(this.searchKey.value.toLowerCase())
        );
      }

      //search by caategory
      if (this.category.value) {
        result = result.filter((g) => g.category.match(this.category.value));
      }

      //search with date
      if (this.fromDate.value && this.toDate.value) {
        if (
          new Date(this.fromDate.value).getTime() >
          new Date(this.toDate.value).getTime()
        ) {
          this.serachError.push('From date must be before To date');
        } else {
          const fromDate =
            new Date(this.fromDate.value).getTime() + 3600 * 1000 * 24;
          const toDate =
            new Date(this.toDate.value).getTime() + 3600 * 1000 * 24;
          result = result.filter((g) => g.date > fromDate && g.date < toDate);
        }
      } else if (this.fromDate.value) {
        const fromDate = new Date(this.fromDate.value).getTime();
        result = result.filter((g) => g.date > fromDate);
      } else if (this.toDate.value) {
        const toDate = new Date(this.toDate.value).getTime();
        result = result.filter((g) => g.date < toDate);
      }

      this.filteredGroups = [...result];
    }
  }
  onClear() {
    this.filterForm.reset();
    this.filteredGroups = [...this.myGroups];
    this.serachError = [];
  }

  onCreateGroup() {
    this.router.navigate(['', 'groups', 'create']);
  }
  onUpdateGroup(group_id: string) {
    this.router.navigate(['', 'groups', group_id]);
  }
  addMember(group_id: string) {
    this.router.navigate(['', 'groups', group_id, 'members']);
  }
  viewBills(group_id: string) {
    this.router.navigate(['', 'groups', group_id, 'bills']);
  }
  addBill(group_id: string) {
    this.router.navigate(['', 'groups', group_id, 'bills', 'add']);
  }
  viewDetails(group_id: string) {
    this.router.navigate(['', 'groups', group_id]);
  }
  goToReport(group_id: string) {
    this.router.navigate(['', 'groups', group_id, 'report']);
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
