import { Component, inject } from '@angular/core';
import { BillsService } from './bills.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GroupsService } from '../groups/groups.service';
import { IGroup, IPaid_By, IOwed_By } from 'src/app/types/interfaces';

@Component({
  selector: 'app-bills-add',
  template: `
    <div class="wrapper">
      <div id="formContent">
        <!-- Tabs Titles -->

        <!-- Icon -->
        <div class="fadeIn first p-3">
          <h2>
            <i class="bi bi-cash-coin"></i> Bill
            <span *ngIf="group"> for {{ group.name }}</span>
          </h2>
        </div>

        <!-- Login Form -->
        <form [formGroup]="myForm">
          <input type="text" placeholder="Title" formControlName="title" />
          <input
            type="text"
            placeholder="Description"
            formControlName="description"
          />
          <select formControlName="category">
            <option value="" disabled selected hidden>Category</option>
            <option value="Foods and Drinks">Foods and Drinks</option>
            <option value="Transportation">Transportation</option>
            <option value="Shopping">Shopping</option>
            <option value="Accomodation">Accomodation</option>
            <option value="Entertainment">Entertainment</option>
          </select>

          <input
            type="number"
            placeholder="Bill Amount"
            formControlName="total_amount"
          />

          <div class="container mt-2" *ngIf="group && group.members.length > 0">
            <h4>💸 Paid By</h4>
            <div class="row" *ngFor="let member of group.members">
              <div class="col align-middle">{{ member.fullname }}</div>
              <div class="col">
                <input
                  type="number"
                  placeholder="Paid Amount"
                  class="form-control"
                  [formControlName]="member.user_id"
                />
              </div>
            </div>
          </div>

          <label>📜 Upload Receipt</label>
          <div class="container">
            <div class="row">
              <div class="col align-middle">
                <input
                  type="file"
                  accept="image/jpg"
                  formControlName="receipt"
                  (change)="onFileSelected($event)"
                />
              </div>
              <div class="col">
                <input type="date" placeholder="Date" formControlName="date" />
              </div>
            </div>
          </div>

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
          *ngIf="title.invalid && (title.dirty || title.touched)"
          class="alert alert-danger"
        >
          <div *ngIf="title.errors?.['required']">Title is required</div>
        </div>
        <div
          *ngIf="category.invalid && (category.dirty || category.touched)"
          class="alert alert-danger"
        >
          <div *ngIf="category.errors?.['required']">Category is required</div>
        </div>
        <div
          *ngIf="
            total_amount.invalid && (total_amount.dirty || total_amount.touched)
          "
          class="alert alert-danger"
        >
          <div *ngIf="total_amount.errors?.['required']">
            Bill amount is required
          </div>
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
export class BillsAddComponent {
  private service = inject(BillsService);
  private groupService = inject(GroupsService);
  private router = inject(Router);
  private activeRoute = inject(ActivatedRoute);
  private receiptFile!: File;
  private subscription!: Subscription;
  private subscription2!: Subscription;
  private subscription3!: Subscription;
  private notification = inject(ToastrService);
  private group_id = '';
  group!: IGroup;
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

    let paid_by: IPaid_By[] = [];
    let owed_by: IOwed_By[] = [];
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
