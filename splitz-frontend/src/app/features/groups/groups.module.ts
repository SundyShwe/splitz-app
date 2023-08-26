import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GroupListComponent } from './group-list.component';
import { GroupCreateComponent } from './group-create.component';
import { GroupUpdateComponent } from './group-update.component';
import { AddMembersComponent } from './add-members.component';
import { GroupReportComponent } from './group-report.component';

@NgModule({
  declarations: [
    GroupListComponent,
    GroupCreateComponent,
    GroupUpdateComponent,
    AddMembersComponent,
    GroupReportComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: GroupListComponent, title: 'Group List' },
      {
        path: 'create',
        component: GroupCreateComponent,
        title: 'Create Group',
      },
      {
        path: ':group_id',
        component: GroupUpdateComponent,
        title: 'Update Group',
      },
      {
        path: ':group_id/members',
        component: AddMembersComponent,
        title: 'Add Members to Group',
      },
      {
        path: ':group_id/report',
        component: GroupReportComponent,
        title: 'Expense Report',
      },
      {
        path: ':group_id/bills',
        loadChildren: () =>
          import('../bills/bills.module').then((m) => m.BillsModule),
      },
    ]),
  ],
})
export class GroupsModule {}
