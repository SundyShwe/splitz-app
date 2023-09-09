import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { environment } from 'src/environments/environment.development';
import { BillService } from '../../services/bill.service';
import { GroupService } from 'src/app/modules/group/services/group.service';
import { Group } from 'src/app/modules/group/interfaces/group';
import { Bills, Owed_By, Paid_By } from '../../interfaces/bills';

@Component({
  selector: 'app-bill-update',
  templateUrl: './bill-update.component.html',
  styleUrls: ['./bill-update.component.css'],
})
export class BillUpdateComponent {
  private service = inject(BillService);
  private groupService = inject(GroupService);
  private router = inject(Router);
  private activeRoute = inject(ActivatedRoute);
  private receiptFile!: File;
  private subscription!: Subscription;
  private subscription2!: Subscription;
  private notification = inject(ToastrService);
  private group_id = '';
  private bill_id = '';
  imgurl = '';
  group!: Group;
  bill!: Bills;
  myForm!: FormGroup;
  private fb = inject(FormBuilder);

  ngOnInit() {
    this.group_id = this.activeRoute.snapshot.paramMap.get(
      'group_id'
    ) as string;
    this.bill_id = this.activeRoute.snapshot.paramMap.get('bill_id') as string;

    this.myForm = this.fb.nonNullable.group({
      title: ['', [Validators.required]],
      description: [''],
      category: ['', [Validators.required]],
      total_amount: ['', [Validators.required]],
      date: ['', [Validators.required]],
      receipt: [''],
    });

    this.subscription = this.groupService
      .getGroupInfo(this.group_id)
      .subscribe((resp) => {
        if (resp.success) {
          this.group = resp.data;
          //add form control
          this.group.members.forEach((member) => {
            this.myForm.addControl(member.user_id, new FormControl('0'));
          });
        } else {
          this.notification.error('Cannot retrieved data');
        }
      });

    //get bill data
    this.subscription = this.service
      .getBillInfo(this.group_id, this.bill_id)
      .subscribe((resp) => {
        if (resp.success) {
          this.bill = resp.data;
          //set form value
          this.myForm.get('title')?.setValue(this.bill.title);
          this.myForm.get('description')?.setValue(this.bill.description);
          this.myForm.get('category')?.setValue(this.bill.category);
          this.myForm.get('total_amount')?.setValue(this.bill.total_amount);
          this.myForm
            .get('date')
            ?.setValue(new Date(this.bill.date).toISOString().substr(0, 10));

          this.bill.paid_by.forEach((member) => {
            this.myForm.get(member.user_id)?.setValue(member.paid_amount);
          });

          if (this.bill.receipt.filename) {
            this.imgurl =
              environment.SERVER_URL + 'receipts/' + this.bill.receipt.filename;
          }
        } else {
          this.notification.error('Cannot retrieved data');
        }
      });
  }

  get title() {
    return this.myForm.get('title') as FormControl;
  }
  get description() {
    return this.myForm.get('description') as FormControl;
  }
  get category() {
    return this.myForm.get('category') as FormControl;
  }
  get total_amount() {
    return this.myForm.get('total_amount') as FormControl;
  }
  get date() {
    return this.myForm.get('date') as FormControl;
  }
  get receipt() {
    return this.myForm.get('receipt') as FormControl;
  }

  onFileSelected(event: Event) {
    const input_element = event.target as HTMLInputElement;
    if (input_element.files) {
      this.receiptFile = input_element.files[0];
    }
  }

  onSave() {
    const timestamp = new Date(this.date.value).getTime() + 3600 * 1000 * 24;
    const form_data = new FormData();
    form_data.append('title', this.title.value);
    form_data.append('description', this.description.value);
    form_data.append('category', this.category.value);
    form_data.append('total_amount', this.total_amount.value);
    form_data.append('date', timestamp + '');
    form_data.append('receipt', this.receiptFile);

    const data = {
      gid: this.group_id,
      bid: this.bill_id,
      formData: form_data,
    };
    //console.log('data to update', data);

    let paid_by: Paid_By[] = [];
    let owed_by: Owed_By[] = [];
    let each = this.total_amount.value / this.group.members.length;
    each = Math.round(each * 100) / 100;
    let total_paid = 0;
    this.group.members.forEach((member) => {
      let paid_amount = this.myForm.get(member.user_id)?.value;
      total_paid += paid_amount;
      let new_paidby = {
        user_id: member.user_id,
        fullname: member.fullname,
        paid_amount: paid_amount,
      };
      paid_by.push(new_paidby);

      let new_owedBy = {
        user_id: member.user_id,
        fullname: member.fullname,
        owed_amount: paid_amount - each,
        settled: paid_amount - each < 0 ? false : true,
      };
      owed_by.push(new_owedBy);
    });

    if (total_paid < this.total_amount.value) {
      this.notification.error(
        'Amount Paid is less than Bill Amount. Please Check again.'
      );
    } else {
      //save an dupoad image
      this.subscription = this.service.updateBill(data).subscribe((resp) => {
        if (resp.success) {
          // this.notification.success(resp.data);
        } else {
          this.notification.error(resp.data);
          console.log(resp.data);
        }
      });

      const data2 = {
        gid: this.group_id,
        bid: this.bill_id,
        paidowed: {
          paid_by: paid_by,
          owed_by: owed_by,
        },
      };

      this.subscription2 = this.service
        .updatePaidOwed(data2)
        .subscribe((resp) => {
          if (resp.success) {
            this.notification.success('Bill is saved');
            this.goToList();
          } else {
            this.notification.error(resp.data);
            console.log(resp.data);
          }
        });
    }
  }

  goToList() {
    this.router.navigate(['', 'groups', this.group_id, 'bills']);
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.subscription2) this.subscription2.unsubscribe();
  }
}
