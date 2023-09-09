import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { BillService } from 'src/app/modules/bill/services/bill.service';
import { GroupService } from 'src/app/modules/group/services/group.service';
import { UserState } from '../../interfaces/userstate';
import { Subscription } from 'rxjs';
import { Bills } from 'src/app/modules/bill/interfaces/bills';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  private groupServie = inject(GroupService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private notification = inject(ToastrService);

  private authSubscription!: Subscription;
  private groupSubscription!: Subscription;
  private billSubscription!: Subscription;
  private billSubscription1!: Subscription;
  private billSubscription2!: Subscription;

  myaccount!: UserState;
  myBills: Bills[] = [];
  totalGroup = 0;
  totalExp = 0;
  totalPaid = 0;
  totalOwed = 0;

  myForm = inject(FormBuilder).nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get password() {
    return this.myForm.get('password') as FormControl;
  }

  ngOnInit() {
    this.myaccount = this.authService.state();

    //get all groupy by userID
    this.groupSubscription = this.groupServie
      .getAllGroups()
      .subscribe((resp) => {
        if (resp.success) {
          this.totalGroup = resp.data.length;
        }
      });

    //get all bills in the groups of userID
    this.billSubscription = this.userService
      .getAllBillsByUser()
      .subscribe((resp) => {
        if (resp.success) {
          //console.log(resp.data[0].totalExp);
          this.totalExp = resp.data[0].totalExp;
        }
      });

    //get all bills paid by userID
    this.billSubscription1 = this.userService
      .getPaidByUser()
      .subscribe((resp) => {
        if (resp.success) {
          this.myBills = resp.data;
          this.myBills.forEach((bill) => {
            this.totalPaid += bill.paid_by[0].paid_amount;
          });
        }
      });

    //get all bills owed by userID
    this.billSubscription2 = this.userService
      .getOwedByUser()
      .subscribe((resp) => {
        if (resp.success) {
          this.myBills = resp.data;
          this.myBills.forEach((bill) => {
            this.totalOwed += bill.owed_by[0].owed_amount;
          });
        }
      });
  }

  onChangePassword() {
    //console.log(this.password.value);
    this.authSubscription = this.userService
      .changePassword(this.password.value)
      .subscribe((resp) => {
        if (resp.success) {
          console.log(resp.data);
          this.notification.success('Successfully updated the password');
        } else {
          this.notification.error(resp.data);
        }
      });
  }
  ngOnDestory() {
    if (this.authSubscription) this.authSubscription.unsubscribe();
    if (this.groupSubscription) this.groupSubscription.unsubscribe();
    if (this.billSubscription) this.billSubscription.unsubscribe();
    if (this.billSubscription1) this.billSubscription1.unsubscribe();
    if (this.billSubscription2) this.billSubscription2.unsubscribe();
  }
}
