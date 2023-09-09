import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl } from '@angular/forms';
import { Group } from '../../interfaces/group';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css'],
})
export class GroupListComponent {
  private router = inject(Router);
  private groupsService = inject(GroupService);
  private subscription!: Subscription;
  private notification = inject(ToastrService);

  myGroups: Group[] = [];
  filteredGroups: Group[] = [];

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
