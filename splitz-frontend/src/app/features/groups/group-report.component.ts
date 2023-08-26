import { Component, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BillsService } from '../bills/bills.service';
import { IBills, IGroup, IOwed_Member } from 'src/app/types/interfaces';
import { GroupsService } from '../groups/groups.service';

@Component({
  selector: 'app-group-report',
  template: ` <h2 *ngIf="group">
      Expenses Report for {{ group.name }}
      <button (click)="goToAdd()" type="button" class="btn btn-info">
        📜 Add A Bill
      </button>
      <button (click)="goToGroup()" type="button" class="btn btn-info">
        ⏪ Back to Group
      </button>
    </h2>
    <div>
      <div class="p-2 border border-warning mb-3 alert alert-secondary">
        <div class="row">
          <div class="col">
            <p class="text-center font-weight-bold">
              Total Expense : $ {{ total_expense }}
            </p>
          </div>
          <div class="col">
            <p class="text-center font-weight-bold">
              Number of Members : {{ number_of_members }}
            </p>
          </div>
          <div class="col">
            <p class="text-center font-weight-bold">
              Amount for Each : $ {{ amount_each }}
            </p>
          </div>
        </div>
      </div>
      <div class="container px-4">
        <div class="row gx-5">
          <div class="col">
            <div class="p-3 border bg-light">
              <h4 class="text-center mb-3">💸 Paid By</h4>
              <div
                class="alert p-3"
                role="alert"
                *ngFor="let member of paid_member"
              >
                <p class="float-start">{{ member.fullname }}</p>
                <p class="float-end">{{ member.total_amount }} $</p>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="p-3 border bg-light">
              <h4 class="text-center mb-3">💸 Owed Amount Per Members</h4>
              <div
                role="alert"
                *ngFor="let member of owed_member"
                [ngClass]="
                  member.total_amount > 0
                    ? ' alert text-primary'
                    : 'alert text-danger'
                "
              >
                <p class="float-start align-top p-0">{{ member.fullname }}</p>
                <p class="float-end align-top p-0">
                  {{ member.total_amount }} $
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`,
  styles: [],
})
export class GroupReportComponent {
  private router = inject(Router);
  private activeRoute = inject(ActivatedRoute);
  private billService = inject(BillsService);
  private groupService = inject(GroupsService);
  private subscription!: Subscription;
  private subscription2!: Subscription;
  private notification = inject(ToastrService);
  group_id = '';
  total_expense = 0;
  number_of_members = 0;
  amount_each = 0;

  group!: IGroup;
  bills: IBills[] = [];
  paid_member: IOwed_Member[] = [];
  owed_member: IOwed_Member[] = [];

  ngOnInit() {
    this.group_id = this.activeRoute.snapshot.paramMap.get(
      'group_id'
    ) as string;

    this.subscription = this.groupService
      .getGroupInfo(this.group_id)
      .subscribe((resp) => {
        if (resp.success) {
          this.group = resp.data;
          this.number_of_members = this.group.members.length;
        } else {
          this.notification.error('Cannot retrieved data');
        }
      });

    this.subscription2 = this.billService
      .getAllBills(this.group_id)
      .subscribe((resp) => {
        if (resp.success) {
          this.bills = resp.data;

          //get total expense for the group
          this.total_expense = this.bills.reduce(
            (sum, obj) => sum + obj.total_amount,
            0
          );
          this.amount_each = this.total_expense / this.number_of_members;

          this.group.members.forEach((member) => {
            //paid
            let total_paid = 0;
            this.bills.forEach((bill) => {
              let paid = bill.paid_by.filter(
                (obj) => obj.user_id === member.user_id
              );
              total_paid += paid[0].paid_amount;
            });
            let user_paid: IOwed_Member = {
              user_id: member.user_id,
              fullname: member.fullname,
              total_amount: total_paid,
            };
            this.paid_member.push(user_paid);

            //owed
            let total_owed = 0;
            this.bills.forEach((bill) => {
              let owed = bill.owed_by.filter(
                (obj) => obj.user_id === member.user_id
              );
              total_owed += owed[0].owed_amount;
            });
            let owed_user: IOwed_Member = {
              user_id: member.user_id,
              fullname: member.fullname,
              total_amount: total_owed,
            };
            this.owed_member.push(owed_user);
          });
          console.log('total exp', this.total_expense, 'avg', this.amount_each);
          console.log('each member paid ', this.paid_member);
          console.log('each member owed ', this.owed_member);

          let alter_bills = [...this.bills];
          alter_bills.forEach((bill) => {
            if (bill.paid_by) {
              let paid_ones = bill.paid_by.filter((obj) => obj.paid_amount > 0);
              bill.paid_by_names = paid_ones.map((obj) => obj.fullname);
            }
          });
          this.bills = [...alter_bills];
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
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
  goToGroup() {
    this.router.navigate(['', 'groups']);
  }
}
