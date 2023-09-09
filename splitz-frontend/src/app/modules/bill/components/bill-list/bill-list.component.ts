import { Component, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment as env } from 'src/environments/environment.development';
import { BillService } from '../../services/bill.service';
import { GroupService } from 'src/app/modules/group/services/group.service';
import { Bills } from '../../interfaces/bills';
import { Group } from 'src/app/modules/group/interfaces/group';

@Component({
  selector: 'app-bill-list',
  templateUrl: './bill-list.component.html',
  styleUrls: ['./bill-list.component.css'],
})
export class BillListComponent {
  private router = inject(Router);
  private activeRoute = inject(ActivatedRoute);
  private billService = inject(BillService);
  private groupService = inject(GroupService);
  private subscription!: Subscription;
  private subscription2!: Subscription;
  private notification = inject(ToastrService);
  group_id = '';

  //group!: Observable<any>;
  group!: Group;
  bills: Bills[] = [];
  filteredBills: Bills[] = [];
  imgurl = env.SERVER_URL + 'receipts/';

  ngOnInit() {
    this.group_id = this.activeRoute.snapshot.paramMap.get(
      'group_id'
    ) as string;

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

  // Filter Form
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

      // Filter by bill title or paid user name
      // when what to filter is selected but no value is provided
      if (this.filterBy.value && !this.searchKey.value) {
        this.serachError.push('Enter a value to filter');
      }
      // when value is entered but what to filter is not provided
      if (!this.filterBy.value && this.searchKey.value) {
        this.serachError.push('Select a Filter-By type');
      }
      // when both value and what to filter is provided
      if (this.filterBy.value != '' && this.searchKey.value != '') {
        // filter by title
        if (this.filterBy.value == 'Title') {
          result = result.filter((t) => t.title.match(this.searchKey.value));
        }
        // filter by paid user name
        else {
          result = result.filter((t) =>
            t.paid_by_names.includes(this.searchKey.value)
          );
        }
      }

      //filter by bill cateogry
      if (this.category.value) {
        result = result.filter((t) => t.category.match(this.category.value));
      }

      //filter with dates
      // when both dates are provided : get the bills between from-date and to-date
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
      }
      // when only from-date is provided, get bills from that date on
      else if (this.fromDate.value) {
        const fromDate = new Date(this.fromDate.value).getTime();
        result = result.filter((t) => t.date > fromDate);
      }
      // when only to-date is provided, get bills up to that date
      else if (this.toDate.value) {
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
