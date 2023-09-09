import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BillListComponent } from './components/bill-list/bill-list.component';
import { BillAddComponent } from './components/bill-add/bill-add.component';
import { BillUpdateComponent } from './components/bill-update/bill-update.component';

@NgModule({
  declarations: [BillListComponent, BillAddComponent, BillUpdateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: BillListComponent,
        title: 'Bill List',
      },
      {
        path: 'add',
        component: BillAddComponent,
        title: 'Add Bill',
      },
      {
        path: ':bill_id/update',
        component: BillUpdateComponent,
        title: 'Update Bill',
      },
    ]),
  ],
})
export class BillModule {}
