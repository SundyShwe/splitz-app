import { Component, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BillService } from 'src/app/modules/bill/services/bill.service';
import { GroupService } from '../../services/group.service';
import { Group } from '../../interfaces/group';
import { Bills, Owed_Member } from 'src/app/modules/bill/interfaces/bills';

@Component({
  selector: 'app-group-report',
  templateUrl: './group-report.component.html',
  styleUrls: ['./group-report.component.css'],
})
export class GroupReportComponent {
  private router = inject(Router);
  private activeRoute = inject(ActivatedRoute);
  private billService = inject(BillService);
  private groupService = inject(GroupService);
  private subscription!: Subscription;
  private subscription2!: Subscription;
  private notification = inject(ToastrService);
  group_id = '';
  total_expense = 0;
  number_of_members = 0;
  amount_each = 0;

  group!: Group;
  bills: Bills[] = [];
  paid_member: Owed_Member[] = [];
  owed_member: Owed_Member[] = [];

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
            let user_paid: Owed_Member = {
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
            let owed_user: Owed_Member = {
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
