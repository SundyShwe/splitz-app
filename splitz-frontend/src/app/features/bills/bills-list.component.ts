import { Component, inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BillsService } from './bills.service';
import { environment as env } from 'src/environment/environment.development';
import { IBills, IGroup, IOwed_Member } from 'src/app/types/interfaces';
import { GroupsService } from '../groups/groups.service';

@Component({
  selector: 'app-bills-list',
  template: `
    <h1 *ngIf="group">
      Expenses for {{ group.name }}
      <button (click)="goToAdd()" type="button" class="btn btn-info">
        📜 Add A Bill
      </button>
      <button (click)="goToReport()" type="button" class="btn btn-info">
        📊 Finance Report
      </button>
      <button (click)="goToGroup()" type="button" class="btn btn-info">
        ⏪ Back to Group
      </button>
    </h1>
    <div>
      <div class="p-2 border border-warning mb-3 alert alert-secondary">
        <form [formGroup]="filterForm">
          <div class="row align-items-center p-1">
            <div class="col">
              <label class="sr-only">Filter By</label>
              <select
                class="form-control form-select"
                formControlName="filterBy"
              >
                <option selected value="">Select..</option>
                <option selected value="Title">Title</option>
                <option value="Paid By">Paid By</option>
              </select>
            </div>
            <div class="col">
              <label class="sr-only">Enter</label>
              <div class="input-group ">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Username"
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
                <option value="Foods and Drinks">Foods and Drinks</option>
                <option value="Transportation">Transportation</option>
                <option value="Shopping">Shopping</option>
                <option value="Accomodation">Accomodation</option>
                <option value="Entertainment">Entertainment</option>
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
              <button class="btn btn-primary mb-2" (click)="onFilter()">
                Search
              </button>
              <button class="btn btn-primary mb-2" (click)="onClear()">
                Clear
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
        *ngIf="filteredBills.length > 0; else noTranasaction"
      >
        <table class="table table-striped">
          <thead class="thead-dark">
            <tr class="table-warning">
              <th scope="col">Title</th>
              <th scope="col">Category</th>
              <th scope="col">Paid By</th>
              <th scope="col">Amount</th>
              <th scope="col">Date</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tr *ngFor="let t of filteredBills">
            <td>{{ t.title }}</td>
            <td>{{ t.category }}</td>
            <td>{{ t.paid_by_names.join(',') }}</td>

            <td class="text-align-center">{{ t.total_amount }}</td>
            <td>{{ t.date | date }}</td>
            <td>
              <button (click)="viewDetails(t._id)" class="btn btn-info">
                ⚙ View Details
              </button>
              <button (click)="deleteBill(t._id)" class="btn btn-info">
                ❌ Delete
              </button>
            </td>
            <!-- <td>
              <img
                src="{{ imgurl + t.receipt.filename }}"
                width="100"
                (click)="viewImage(imgurl + t.receipt.filename)"
              />
            </td> -->
          </tr>
        </table>
      </div>
    </div>
    <ng-template #noTranasaction>
      <table class="table table-striped">
        <thead class="thead-dark">
          <tr class="table-warning">
            <th scope="col">Title</th>
            <th scope="col">Category</th>
            <th scope="col">Paid By</th>
            <th scope="col">Amount</th>
            <th scope="col">Date</th>
            <th scope="col">Action</th>
          </tr>
          <tr>
            <td colspan="7">No Bills Found</td>
          </tr>
        </thead>
      </table>
    </ng-template>
  `,
  styles: [],
})
export class BillsListComponent {
  private router = inject(Router);
  private activeRoute = inject(ActivatedRoute);
  private billService = inject(BillsService);
  private groupService = inject(GroupsService);
  private subscription!: Subscription;
  private subscription2!: Subscription;
  private notification = inject(ToastrService);
  group_id = '';

  //group!: Observable<any>;
  group!: IGroup;
  bills: IBills[] = [];
  filteredBills: IBills[] = [];
  imgurl = env.SERVER_URL + 'receipts/';

  ngOnInit() {
    this.group_id = this.activeRoute.snapshot.paramMap.get(
      'group_id'
    ) as string;
    //console.log(this.group_id);
    //this.group = this.groupService.getGroupInfo(this.group_id);

    this.subscription = this.groupService
      .getGroupInfo(this.group_id)
      .subscribe((resp) => {
        if (resp.success) {
          this.group = resp.data;
        } else {
          this.notification.error('Cannot retrieved data');
        }
      });

    this.subscription2 = this.billService
      .getAllBills(this.group_id)
      .subscribe((resp) => {
        if (resp.success) {
          this.bills = resp.data;

          let alter_bills = [...this.bills];
          alter_bills.forEach((bill) => {
            if (bill.paid_by) {
              let paid_ones = bill.paid_by.filter((obj) => obj.paid_amount > 0);
              bill.paid_by_names = paid_ones.map((obj) => obj.fullname);
            }
          });
          this.bills = [...alter_bills];
          this.filteredBills = [...this.bills];
        }
      });
  }

  serachError: string[] = [];
  filterForm = inject(FormBuilder).nonNullable.group({
    filterBy: '',
    searchKey: '',
    category: '',
    fromDate: '',
    toDate: '',
  });
  get filterBy() {
    return this.filterForm.get('filterBy') as FormControl;
  }
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

  onFilter() {
    let result = [...this.bills];

    if (this.isFormEmpty(this.filterForm.value)) {
      this.serachError.push('Please enter at least one Filter Criteria');
    } else {
      this.serachError = [];

      if (this.filterBy.value && !this.searchKey.value) {
        this.serachError.push('Enter a value to filter');
      }
      if (!this.filterBy.value && this.searchKey.value) {
        this.serachError.push('Select a Filter-By type');
      }
      if (this.filterBy.value != '' && this.searchKey.value != '') {
        if (this.filterBy.value == 'Title') {
          result = result.filter((t) => t.title.match(this.searchKey.value));
        } else {
          result = result.filter((t) =>
            t.paid_by_names.includes(this.searchKey.value)
          );
        }
      }

      if (this.category.value) {
        result = result.filter((t) => t.category.match(this.category.value));
      }

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
          result = result.filter((t) => t.date > fromDate && t.date < toDate);
        }
      } else if (this.fromDate.value) {
        const fromDate = new Date(this.fromDate.value).getTime();
        result = result.filter((t) => t.date > fromDate);
      } else if (this.toDate.value) {
        const toDate = new Date(this.toDate.value).getTime();
        result = result.filter((t) => t.date < toDate);
      }

      this.filteredBills = [...result];
    }
  }

  onClear() {
    this.filterForm.reset();
    this.filteredBills = [...this.bills];
    this.serachError = [];
  }

  isFormEmpty(formData: any) {
    return Object.values(formData).every((x) => x === null || x === '');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }

  deleteBill(bill_id: string) {
    const data = { gid: this.group_id, bid: bill_id };
    this.subscription2 = this.billService.deleteBill(data).subscribe((resp) => {
      if (resp.success) {
        this.notification.success('Bill removed from the group');

        this.filteredBills = this.filteredBills.filter(
          (m) => m._id !== bill_id
        );
      } else {
        this.notification.error('Cannot retrieved data');
      }
    });
  }

  viewDetails(bill_id: string) {
    this.router.navigate([
      '',
      'groups',
      this.group_id,
      'bills',
      bill_id,
      'update',
    ]);
  }
  goToAdd() {
    this.router.navigate(['', 'groups', this.group_id, 'bills', 'add']);
  }

  goToReport() {
    this.router.navigate(['', 'groups', this.group_id, 'report']);
  }

  goToGroup() {
    this.router.navigate(['', 'groups']);
  }
  viewImage(image: string) {
    this.notification.show("<img src='" + image + "'/>");
  }
}
