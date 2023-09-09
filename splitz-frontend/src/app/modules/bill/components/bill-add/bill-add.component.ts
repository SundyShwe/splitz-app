import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BillService } from '../../services/bill.service';
import { GroupService } from 'src/app/modules/group/services/group.service';
import { Group } from 'src/app/modules/group/interfaces/group';
import { Owed_By, Paid_By } from '../../interfaces/bills';

@Component({
  selector: 'app-bill-add',
  templateUrl: './bill-add.component.html',
  styleUrls: ['./bill-add.component.css'],
})
export class BillAddComponent {
  private service = inject(BillService);
  private groupService = inject(GroupService);
  private router = inject(Router);
  private activeRoute = inject(ActivatedRoute);
  private receiptFile!: File;
  private subscription!: Subscription;
  private subscription2!: Subscription;
  private subscription3!: Subscription;
  private notification = inject(ToastrService);
  private group_id = '';
  group!: Group;
  myForm!: FormGroup;
  private fb = inject(FormBuilder);

  ngOnInit() {
    this.group_id = this.activeRoute.snapshot.paramMap.get(
      'group_id'
    ) as string;

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
      formData: form_data,
    };

    let paid_by: Paid_By[] = [];
    let owed_by: Owed_By[] = [];
    const each = this.total_amount.value / this.group.members.length;
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

    let new_bill_id = '';
    if (total_paid < this.total_amount.value) {
      this.notification.error(
        'Amount Paid is less than Bill Amount. Please Check again.'
      );
    } else {
      //save an dupoad image
      this.subscription2 = this.service.addBill(data).subscribe((resp) => {
        if (resp.success) {
          new_bill_id = resp.data._id;
          // console.log('new_bill_id =' + new_bill_id);
          const data2 = {
            gid: this.group_id,
            bid: new_bill_id,
            paidowed: {
              paid_by: paid_by,
              owed_by: owed_by,
            },
          };
          //console.log('saving paidowed :' + data2);
          this.subscription3 = this.service
            .addPaidOwed(data2)
            .subscribe((resp) => {
              if (resp.success) {
                this.notification.success('Bill is saved');
                this.goToList();
              } else {
                this.notification.error(resp.data);
                console.log(resp.data);
              }
            });
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
    if (this.subscription3) this.subscription3.unsubscribe();
  }
}
