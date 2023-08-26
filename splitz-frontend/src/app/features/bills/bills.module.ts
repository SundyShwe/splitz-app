import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillsListComponent } from './bills-list.component';
import { BillsAddComponent } from './bills-add.component';
import { BillsUpdateComponent } from './bills-update.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BillsViewComponent } from './bills-view.component';

@NgModule({
  declarations: [
    BillsListComponent,
    BillsAddComponent,
    BillsUpdateComponent,
    BillsViewComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: BillsListComponent,
        title: 'Bill List',
      },
      {
        path: 'add',
        component: BillsAddComponent,
        title: 'Add Bill',
      },
      {
        path: ':bill_id/update',
        component: BillsUpdateComponent,
        title: 'Update Bill',
      },
      {
        path: ':bill_id',
        component: BillsViewComponent,
        title: 'View Bill Details',
      },
    ]),
  ],
})
export class BillsModule {}
